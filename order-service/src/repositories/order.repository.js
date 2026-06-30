const { OrderModel } = require('../models/order.model');

class OrderRepository {
  async create(payload) {
    return OrderModel.create(payload);
  }

  async findByOrderId(orderId) {
    return OrderModel.findOne({ orderId });
  }

  async findByCartId(cartId) {
    return OrderModel.findOne({ cartId });
  }

  async findByUserId(userId) {
    return OrderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async updateByOrderId(orderId, payload) {
    return OrderModel.findOneAndUpdate({ orderId }, { $set: payload }, { new: true });
  }
}

module.exports = { OrderRepository };
