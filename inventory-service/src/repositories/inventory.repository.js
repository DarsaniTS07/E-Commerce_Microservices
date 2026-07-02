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
      availableTickets: Number(payload.availableTickets ?? payload.totalTickets ?? 0),
      reservedTickets: Number(payload.reservedTickets || 0),
      lastReservationAt: payload.lastReservationAt || null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName(),
        Item: item,
        ConditionExpression: 'attribute_not_exists(eventId)',
      })
    );

    return item;
  }

  async findByEventId(eventId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { eventId },
      })
    );

    return result.Item || null;
  }

  async findByInventoryId(inventoryId) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
        FilterExpression: 'inventoryId = :inventoryId',
        ExpressionAttributeValues: { ':inventoryId': inventoryId },
      })
    );

    return result.Items?.[0] || null;
  }

  async reserve(eventId, quantity) {
    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName(),
          Key: { eventId },
          UpdateExpression: 'SET availableTickets = availableTickets - :qty, reservedTickets = reservedTickets + :qty, lastReservationAt = :now, updatedAt = :now',
          ExpressionAttributeValues: {
            ':qty': Number(quantity),
            ':now': nowIso(),
          },
          ConditionExpression: 'availableTickets >= :qty',
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes || null;
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
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
          UpdateExpression: 'SET availableTickets = availableTickets + :qty, reservedTickets = reservedTickets - :qty, updatedAt = :now',
          ExpressionAttributeValues: {
            ':qty': Number(quantity),
            ':now': nowIso(),
          },
          ConditionExpression: 'reservedTickets >= :qty',
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes || null;
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
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
          UpdateExpression: 'SET reservedTickets = reservedTickets - :qty, updatedAt = :now',
          ExpressionAttributeValues: {
            ':qty': Number(quantity),
            ':now': nowIso(),
          },
          ConditionExpression: 'reservedTickets >= :qty',
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes || null;
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
        return null;
      }
      throw err;
    }
  }

  async setTotals(eventId, totalTickets) {
    const total = Number(totalTickets);
    const available = Math.max(total, 0);

    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName(),
          Key: { eventId },
          UpdateExpression: 'SET totalTickets = :total, availableTickets = :available, reservedTickets = :zero, updatedAt = :now',
          ExpressionAttributeValues: {
            ':total': total,
            ':available': available,
            ':zero': 0,
            ':now': nowIso(),
          },
          ReturnValues: 'ALL_NEW',
        })
      );
      return result.Attributes || null;
    } catch (err) {
      // If the item does not exist, create it
      const item = {
        inventoryId: uuidv4(),
        eventId,
        totalTickets: total,
        availableTickets: available,
        reservedTickets: 0,
        lastReservationAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      await docClient.send(
        new PutCommand({
          TableName: tableName(),
          Item: item,
        })
      );
      return item;
    }
  }
}

module.exports = { InventoryRepository };
