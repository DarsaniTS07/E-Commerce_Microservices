const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

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
        ConditionExpression: 'attribute_not_exists(cartId)',
      })
    );

    return item;
  }

  async findActiveByUserEvent(userId, eventId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'userId-eventId-index',
        KeyConditionExpression: 'userId = :userId AND eventId = :eventId',
        FilterExpression: '#status = :active',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':userId': userId,
          ':eventId': eventId,
          ':active': 'ACTIVE',
        },
        Limit: 1,
      })
    );

    return (result.Items && result.Items[0]) || null;
  }

  async findByCartId(cartId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { cartId },
      })
    );

    return result.Item || null;
  }

  async findByUserId(userId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'userId-createdAt-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        ScanIndexForward: false,
      })
    );

    return result.Items || [];
  }

  async updateByCartId(cartId, payload) {
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
        Key: { cartId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(cartId)',
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
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'status-reservationExpiry-index',
        KeyConditionExpression: '#status = :status AND reservationExpiry <= :now',
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
