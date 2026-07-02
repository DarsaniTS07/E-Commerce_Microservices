const { v4: uuidv4 } = require('uuid');
const docClient = require('../config/dynamodb');
const { GetCommand, PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

function tableName() {
  return process.env.PAYMENT_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class PaymentRepository {
  async create(payload) {
    const item = {
      paymentId: payload.paymentId || uuidv4(),
      orderId: payload.orderId,
      amount: Number(payload.amount),
      paymentStatus: payload.paymentStatus || 'PENDING',
      providerReference: payload.providerReference,
      callbackProcessedAt: payload.callbackProcessedAt || null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName(),
        Item: item,
        ConditionExpression: 'attribute_not_exists(paymentId)',
      })
    );

    return item;
  }

  async findByPaymentId(paymentId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { paymentId },
      })
    );

    return result.Item || null;
  }

  async findByOrderId(orderId) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'orderId-index',
        KeyConditionExpression: 'orderId = :orderId',
        ExpressionAttributeValues: {
          ':orderId': orderId,
        },
        Limit: 1,
      })
    );

    return (result.Items && result.Items[0]) || null;
  }

  async findByProviderReference(providerReference) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'providerReference-index',
        KeyConditionExpression: 'providerReference = :providerReference',
        ExpressionAttributeValues: {
          ':providerReference': providerReference,
        },
        Limit: 1,
      })
    );

    return (result.Items && result.Items[0]) || null;
  }

  async updateByOrderId(orderId, payload) {
    const existing = await this.findByOrderId(orderId);
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
        Key: { paymentId: existing.paymentId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(paymentId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes || null;
  }

  async list() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'paymentStatus-createdAt-index',
        KeyConditionExpression: 'paymentStatus = :status',
        ExpressionAttributeValues: {
          ':status': 'PENDING',
        },
        ScanIndexForward: false,
      })
    );

    return result.Items || [];
  }

  async listRefunds() {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'paymentStatus-createdAt-index',
        KeyConditionExpression: 'paymentStatus = :status',
        ExpressionAttributeValues: {
          ':status': 'REFUNDED',
        },
        ScanIndexForward: false,
      })
    );

    return result.Items || [];
  }
}

module.exports = { PaymentRepository };
