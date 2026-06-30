const { EventModel } = require('../model/event.model');

class EventRepository {
  activeFilter() {
    return { isDeleted: { $ne: true } };
  }

  async create(payload) {
    return EventModel.create(payload);
  }

  async findById(eventId) {
    return EventModel.findOne({ eventId, ...this.activeFilter() });
  }

  async findByIdIncludingDeleted(eventId) {
    return EventModel.findOne({ eventId });
  }

  async search(filters, pagination) {
    const query = { ...this.activeFilter() };

    if (filters.city) query.city = new RegExp(filters.city, 'i');
    if (filters.category) query.category = new RegExp(filters.category, 'i');
    if (filters.status) query.status = filters.status;
    if (filters.date) {
      const date = new Date(filters.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.eventDate = { $gte: date, $lt: nextDay };
    }

    const [items, total] = await Promise.all([
      EventModel.find(query).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      EventModel.countDocuments(query),
    ]);

    return { items, total };
  }

  async updateByEventId(eventId, payload) {
    return EventModel.findOneAndUpdate(
      { eventId, ...this.activeFilter() },
      { $set: payload },
      { new: true }
    );
  }

  async softDelete(eventId) {
    return EventModel.findOneAndUpdate(
      { eventId, ...this.activeFilter() },
      { $set: { isDeleted: true, deletedAt: new Date(), status: 'CANCELLED', availableStatus: 'HIDDEN' } },
      { new: true }
    );
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
