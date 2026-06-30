const { PaymentModel } = require('../models/payment.model');

class PaymentRepository {
  async create(payload) {
    return PaymentModel.create(payload);
  }

  async findByPaymentId(paymentId) {
    return PaymentModel.findOne({ paymentId });
  }

  async findByOrderId(orderId) {
    return PaymentModel.findOne({ orderId });
  }

  async findByProviderReference(providerReference) {
    return PaymentModel.findOne({ providerReference });
  }

  async updateByOrderId(orderId, payload) {
    return PaymentModel.findOneAndUpdate({ orderId }, { $set: payload }, { new: true });
  }

  async list() {
    return PaymentModel.find().sort({ createdAt: -1 });
  }

  async listRefunds() {
    return PaymentModel.find({ paymentStatus: 'REFUNDED' }).sort({ createdAt: -1 });
  }
}

module.exports = { PaymentRepository };
