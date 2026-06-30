const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true, unique: true, default: uuidv4 },
    userId: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    reservationExpiry: { type: Date, required: true },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'REMOVED', 'CHECKED_OUT'], default: 'ACTIVE', index: true },
    orderId: { type: String, default: null },
  },
  { timestamps: true, collection: 'carts' }
);

cartSchema.index({ userId: 1, eventId: 1, status: 1 });

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = { CartModel };
