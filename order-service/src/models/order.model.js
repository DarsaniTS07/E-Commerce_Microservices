const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, default: uuidv4 },
    cartId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'REFUNDED'], default: 'PENDING_PAYMENT', index: true },
    ticketCode: { type: String, default: null },
    cancellationReason: { type: String, default: null },
  },
  { timestamps: true, collection: 'orders' }
);

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = { OrderModel };
