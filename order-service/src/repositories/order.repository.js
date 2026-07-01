const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

function tableName() {
  return process.env.ORDER_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class OrderRepository {
  async create(payload) {
    const item = {
      orderId: payload.orderId || uuidv4(),
      cartId: payload.cartId,
      userId: payload.userId,
      eventId: payload.eventId,
      quantity: Number(payload.quantity),
      amount: Number(payload.amount),
      status: payload.status || 'PENDING_PAYMENT',
      ticketCode: payload.ticketCode || null,
      cancellationReason: payload.cancellationReason || null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName(),
        Item: item,
        ConditionExpression: 'attribute_not_exists(orderId)',
      })
    );

    return item;
  }

  async findByOrderId(orderId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { orderId },
      })
    );

    return result.Item || null;
  }

  async findByCartId(cartId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'cartId-index',
        KeyConditionExpression: 'cartId = :cartId',
        ExpressionAttributeValues: {
          ':cartId': cartId,
        },
        Limit: 1,
      })
    );

    return (result.Items && result.Items[0]) || null;
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

  async updateByOrderId(orderId, payload) {
    const names = { '#updatedAt': 'updatedAt' };
    const values = { ':updatedAt': nowIso() };
    const sets = ['#updatedAt = :updatedAt'];

    Object.entries(payload).forEach(([key, value]) => {
      names[`#${key}`] = key;
      values[`:${key}`] = value;
      sets.push(`#${key} = :${key}`);
    });

    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName(),
        Key: { orderId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(orderId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes || null;
  }
}

module.exports = { OrderRepository };
