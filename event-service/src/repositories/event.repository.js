const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

function tableName() {
  return process.env.EVENT_TABLE_NAME;
}

function nowIso() {
  return new Date().toISOString();
}

class EventRepository {
  activeFilter() {
    return { isDeleted: { $ne: true } };
  }

  async create(payload) {
    const item = {
      eventId: payload.eventId || uuidv4(),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      venue: payload.venue,
      city: payload.city,
      eventDate: new Date(payload.eventDate).toISOString(),
      eventTime: payload.eventTime,
      status: payload.status || 'DRAFT',
      availableStatus: payload.availableStatus || 'HIDDEN',
      availableTicketCount: Number(payload.availableTicketCount || 0),
      ticketPrice: Number(payload.ticketPrice || 0),
      createdBy: payload.createdBy || null,
      isDeleted: false,
      deletedAt: null,
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

  async findByIdIncludingDeleted(eventId) {
    const result = await docClient.send(
      new GetCommand({
        TableName: tableName(),
        Key: { eventId },
      })
    );

    return result.Item || null;
  }

  async search(filters, pagination) {
    const result = await docClient.send(
      new QueryCommand({
        TableName: tableName(),
        IndexName: 'status-eventDate-index',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': filters.status || 'PUBLISHED',
        },
        ScanIndexForward: false,
      })
    );

    const items = (result.Items || []).filter((item) => {
      if (item.isDeleted) return false;
      if (filters.city && !String(item.city || '').toLowerCase().includes(String(filters.city).toLowerCase())) return false;
      if (filters.category && !String(item.category || '').toLowerCase().includes(String(filters.category).toLowerCase())) return false;
      if (filters.date) {
        const d1 = new Date(item.eventDate).toISOString().slice(0, 10);
        const d2 = new Date(filters.date).toISOString().slice(0, 10);
        if (d1 !== d2) return false;
      }
      return true;
    });

    const total = items.length;
    const start = pagination.skip || 0;
    const end = start + (pagination.limit || 10);
    return { items: items.slice(start, end), total };
  }

  async updateByEventId(eventId, payload) {
    const existing = await this.findById(eventId);
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
        Key: { eventId },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(eventId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes || null;
  }

  async softDelete(eventId) {
    return this.updateByEventId(eventId, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      status: 'CANCELLED',
      availableStatus: 'HIDDEN',
    });
  }

  async syncAvailability(eventId, availableTicketCount) {
    const availableStatus =
      availableTicketCount <= 0 ? 'SOLD_OUT' : availableTicketCount <= 20 ? 'LIMITED' : 'AVAILABLE';

    return EventModel.findOneAndUpdate(
      { eventId, ...this.activeFilter() },
      { $set: { availableTicketCount, availableStatus } },
      { new: true }
    );
  }
}

module.exports = { EventRepository };
