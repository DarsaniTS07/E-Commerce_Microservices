const { v4: uuidv4 } = require("uuid");
const docClient = require("../config/dynamodb");
const {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

function tableName() {
  return process.env.INVENTORY_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class InventoryRepository {
  async create(payload) {
    const item = {
      inventoryId: payload.inventoryId || uuidv4(),
      eventId: payload.eventId,
      totalTickets: Number(payload.totalTickets || 0),
      availableTickets: Number(
        payload.availableTickets ?? payload.totalTickets ?? 0
      ),
      reservedTickets: Number(payload.reservedTickets || 0),
      lastReservationAt: payload.lastReservationAt || null,
      isDeleted: false,
      deletedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName(),
        Item: item,
        ConditionExpression: "attribute_not_exists(eventId)",
      })
    );

    return item;
  }

  async findById(eventId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { eventId },
      })
    );

    const item = result.Item || null;

    if (!item || item.isDeleted) {
      return null;
    }

    return item;
  }

  async findAll() {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
      })
    );

    return (result.Items || []).filter((item) => !item.isDeleted);
  }

  async updateByEventId(eventId, payload) {
    const existing = await this.findById(eventId);

    if (!existing) {
      return null;
    }

    const names = {
      "#updatedAt": "updatedAt",
    };

    const values = {
      ":updatedAt": nowIso(),
    };

    const sets = ["#updatedAt = :updatedAt"];

    Object.entries(payload).forEach(([key, value]) => {
      names[`#${key}`] = key;
      values[`:${key}`] = value;
      sets.push(`#${key} = :${key}`);
    });

    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName(),
        Key: { eventId },
        UpdateExpression: `SET ${sets.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: "attribute_exists(eventId)",
        ReturnValues: "ALL_NEW",
      })
    );

    return result.Attributes || null;
  }

  async softDelete(eventId) {
    return this.updateByEventId(eventId, {
      isDeleted: true,
      deletedAt: nowIso(),
    });
  }

  async reserve(eventId, quantity) {
    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName(),
          Key: { eventId },
          UpdateExpression:
            "SET availableTickets = availableTickets - :qty, reservedTickets = reservedTickets + :qty, lastReservationAt = :now, updatedAt = :now",
          ExpressionAttributeValues: {
            ":qty": Number(quantity),
            ":now": nowIso(),
          },
          ConditionExpression: "availableTickets >= :qty",
          ReturnValues: "ALL_NEW",
        })
      );

      return result.Attributes || null;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        return null;
      }

      throw err;
    }
  }

  async release(eventId, quantity) {
    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName(),
          Key: { eventId },
          UpdateExpression:
            "SET availableTickets = availableTickets + :qty, reservedTickets = reservedTickets - :qty, updatedAt = :now",
          ExpressionAttributeValues: {
            ":qty": Number(quantity),
            ":now": nowIso(),
          },
          ConditionExpression: "reservedTickets >= :qty",
          ReturnValues: "ALL_NEW",
        })
      );

      return result.Attributes || null;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        return null;
      }

      throw err;
    }
  }

  async confirm(eventId, quantity) {
    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName(),
          Key: { eventId },
          UpdateExpression:
            "SET reservedTickets = reservedTickets - :qty, updatedAt = :now",
          ExpressionAttributeValues: {
            ":qty": Number(quantity),
            ":now": nowIso(),
          },
          ConditionExpression: "reservedTickets >= :qty",
          ReturnValues: "ALL_NEW",
        })
      );

      return result.Attributes || null;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        return null;
      }

      throw err;
    }
  }

  async setTotals(eventId, totalTickets) {
    const total = Number(totalTickets);
    const available = Math.max(total, 0);

    const existing = await this.findById(eventId);

    if (existing) {
      return this.updateByEventId(eventId, {
        totalTickets: total,
        availableTickets: available,
        reservedTickets: 0,
      });
    }

    return this.create({
      eventId,
      totalTickets: total,
      availableTickets: available,
      reservedTickets: 0,
    });
  }
}

module.exports = { InventoryRepository };