const { CartModel } = require('../models/cart.model');

class CartRepository {
  async create(payload) {
    return CartModel.create(payload);
  }

  async findActiveByUserEvent(userId, eventId) {
    return CartModel.findOne({ userId, eventId, status: 'ACTIVE' });
  }

  async findByCartId(cartId) {
    return CartModel.findOne({ cartId });
  }

  async findByUserId(userId) {
    return CartModel.find({ userId }).sort({ createdAt: -1 });
  }

  async updateByCartId(cartId, payload) {
    return CartModel.findOneAndUpdate({ cartId }, { $set: payload }, { new: true });
  }

  async removeByCartId(cartId) {
    return CartModel.findOneAndUpdate({ cartId }, { $set: { status: 'REMOVED' } }, { new: true });
  }

  async markExpired(cartId) {
    return CartModel.findOneAndUpdate({ cartId }, { $set: { status: 'EXPIRED' } }, { new: true });
  }

  async findExpired(now = new Date()) {
    return CartModel.find({ status: 'ACTIVE', reservationExpiry: { $lte: now } });
  }
}

module.exports = { CartRepository };
