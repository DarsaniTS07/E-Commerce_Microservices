const { v4: uuidv4 } = require("uuid");
const docClient = require("../config/dynamodb");
const {
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

function tableName() {
  return process.env.NOTIFICATION_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class NotificationRepository {
  async create(payload) {
    const item = {
      notificationId: payload.notificationId || uuidv4(),
      userId: payload.userId,
      message: payload.message,
      status: payload.status || 'UNREAD',
      readAt: payload.readAt ? new Date(payload.readAt).toISOString() : null,
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

  async list() {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName(),
      })
    );

    const items = result.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  async findByNotificationId(notificationId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { notificationId },
      })
    );

    return result.Item || null;
  }

  async markAsRead(notificationId) {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName(),
        Key: { notificationId },
        UpdateExpression: 'SET #status = :status, readAt = :now, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': 'READ',
          ':now': nowIso(),
        },
        ConditionExpression: 'attribute_exists(notificationId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes || null;
  }
}

module.exports = { NotificationRepository };
