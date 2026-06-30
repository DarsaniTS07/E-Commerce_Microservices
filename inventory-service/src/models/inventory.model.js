const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const inventorySchema = new mongoose.Schema(
  {
    inventoryId: { type: String, required: true, unique: true, default: uuidv4 },
    eventId: { type: String, required: true, unique: true, index: true },
    totalTickets: { type: Number, required: true, min: 0 },
    availableTickets: { type: Number, required: true, min: 0 },
    reservedTickets: { type: Number, required: true, min: 0 },
    lastReservationAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'inventories' }
);

const InventoryModel = mongoose.model('Inventory', inventorySchema);

module.exports = { InventoryModel };
