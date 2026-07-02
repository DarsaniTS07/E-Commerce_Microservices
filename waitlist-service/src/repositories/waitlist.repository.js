const { v4: uuidv4 } = require("uuid");
const docClient = require("../config/dynamodb");
const {
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");

function tableName() {
  return process.env.WAITLIST_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class WaitlistRepository {
  async join(payload) {
    const item = {
      waitlistId: payload.waitlistId || uuidv4(),
      eventId: payload.eventId,
      userId: payload.userId,
      quantity: Number(payload.quantity),
      position: Number(payload.position),
      status: payload.status || 'WAITING',
      joinedAt: payload.joinedAt ? new Date(payload.joinedAt).toISOString() : nowIso(),
      notifiedAt: payload.notifiedAt ? new Date(payload.notifiedAt).toISOString() : null,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt).toISOString() : null,
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

  async listByEvent(eventId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        KeyConditionExpression: 'eventId = :eventId',
        ExpressionAttributeValues: {
          ':eventId': eventId,
        },
      })
    );

    const items = result.Items || [];
    items.sort((a, b) => a.position - b.position || new Date(a.joinedAt) - new Date(b.joinedAt));
    return items;
  }

  async listByUser(userId) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const items = result.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  }

  async findByWaitlistId(waitlistId) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
        FilterExpression: 'waitlistId = :waitlistId',
        ExpressionAttributeValues: {
          ':waitlistId': waitlistId,
        },
      })
    );

    return result.Items?.[0] || null;
  }

  async findByEventAndUser(eventId, userId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { eventId, userId },
      })
    );

    const item = result.Item || null;
    if (item && item.status === 'WAITING') {
      return item;
    }
    return null;
  }

  async nextWaiting(eventId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        KeyConditionExpression: 'eventId = :eventId',
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':eventId': eventId,
          ':status': 'WAITING',
        },
      })
    );

    const items = result.Items || [];
    if (items.length === 0) return null;

    items.sort((a, b) => a.position - b.position || new Date(a.joinedAt) - new Date(b.joinedAt));
    return items[0];
  }

  async countWaiting(eventId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        KeyConditionExpression: 'eventId = :eventId',
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':eventId': eventId,
          ':status': 'WAITING',
        },
      })
    );

    return result.Count || 0;
  }

  async updateStatus(waitlistId, payload) {
    const existing = await this.findByWaitlistId(waitlistId);
    if (!existing) {
      return null;
    }

    const names = { '#updatedAt': 'updatedAt' };
    const values = { ':updatedAt': nowIso() };
    const sets = ['#updatedAt = :updatedAt'];

    Object.entries(payload).forEach(([key, value]) => {
      names[`#${key}`] = key;
      values[`:${key}`] = value instanceof Date ? value.toISOString() : value;
      sets.push(`#${key} = :${key}`);
    });

    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName(),
        Key: { eventId: existing.eventId, userId: existing.userId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(eventId) AND attribute_exists(userId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes || null;
  }

  async leave(waitlistId) {
    return this.updateStatus(waitlistId, { status: 'EXPIRED' });
  }
}

module.exports = { WaitlistRepository };
