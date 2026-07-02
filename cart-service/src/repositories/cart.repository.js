const { v4: uuidv4 } = require('uuid');
const docClient = require('../config/dynamodb');
const { GetCommand, PutCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

function tableName() {
  return process.env.CART_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class CartRepository {
  async create(payload) {
    const item = {
      cartId: payload.cartId || uuidv4(),
      userId: payload.userId,
      eventId: payload.eventId,
      quantity: Number(payload.quantity),
      status: payload.status || 'ACTIVE',
      reservationExpiry: new Date(payload.reservationExpiry || new Date()).toISOString(),
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

  async findActiveByUserEvent(userId, eventId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { userId },
      })
    );

    const item = result.Item || null;
    if (item && item.eventId === eventId && item.status === 'ACTIVE') {
      return item;
    }
    return null;
  }

  async findByCartId(cartId) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
        FilterExpression: 'cartId = :cartId',
        ExpressionAttributeValues: {
          ':cartId': cartId,
        },
      })
    );

    return result.Items?.[0] || null;
  }

  async findByUserId(userId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { userId },
      })
    );

    const item = result.Item || null;
    return item ? [item] : [];
  }

  async updateByCartId(cartId, payload) {
    const existing = await this.findByCartId(cartId);
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
        Key: { userId: existing.userId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(userId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes || null;
  }

  async removeByCartId(cartId) {
    return this.updateByCartId(cartId, { status: 'REMOVED' });
  }

  async markExpired(cartId) {
    return this.updateByCartId(cartId, { status: 'EXPIRED' });
  }

  async findExpired(now = new Date()) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
        FilterExpression: '#status = :status AND reservationExpiry <= :now',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'ACTIVE',
          ':now': now.toISOString(),
        },
      })
    );

    return result.Items || [];
  }
}

module.exports = { CartRepository };
