const { InventoryModel } = require('../models/inventory.model');

class InventoryRepository {
  async create(payload) {
    return InventoryModel.create(payload);
  }

  async findByEventId(eventId) {
    return InventoryModel.findOne({ eventId });
  }

  async findByInventoryId(inventoryId) {
    return InventoryModel.findOne({ inventoryId });
  }

  async reserve(eventId, quantity) {
    return InventoryModel.findOneAndUpdate(
      { eventId, availableTickets: { $gte: quantity } },
      { $inc: { availableTickets: -quantity, reservedTickets: quantity }, $set: { lastReservationAt: new Date() } },
      { new: true }
    );
  }

  async release(eventId, quantity) {
    return InventoryModel.findOneAndUpdate(
      { eventId, reservedTickets: { $gte: quantity } },
      { $inc: { availableTickets: quantity, reservedTickets: -quantity } },
      { new: true }
    );
  }

  async confirm(eventId, quantity) {
    return InventoryModel.findOneAndUpdate(
      { eventId, reservedTickets: { $gte: quantity } },
      { $inc: { reservedTickets: -quantity } },
      { new: true }
    );
  }

  async setTotals(eventId, totalTickets) {
    const availableTickets = Math.max(totalTickets, 0);
    return InventoryModel.findOneAndUpdate(
      { eventId },
      { $set: { totalTickets, availableTickets, reservedTickets: 0 } },
      { new: true, upsert: true }
    );
  }
}

module.exports = { InventoryRepository };
