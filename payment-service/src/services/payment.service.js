const { AppError } = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor(paymentRepository, orderClient, inventoryClient) {
    this.paymentRepository = paymentRepository;
    this.orderClient = orderClient;
    this.inventoryClient = inventoryClient;
  }

  async initiatePayment({ orderId }) {
    const order = await this.orderClient.getOrder(orderId);
    if (order.status !== 'PENDING_PAYMENT') {
      throw new AppError('Payment can only be initiated for pending orders', 409);
    }

    const existing = await this.paymentRepository.findByOrderId(orderId);
    if (existing) {
      return existing;
    }

    return this.paymentRepository.create({
      orderId,
      amount: order.amount,
      paymentStatus: 'PENDING',
      providerReference: `PAY-${uuidv4()}`,
    });
  }

  async handleCallback(payload) {
    const providerReference = payload.providerReference || payload.paymentId;
    let payment = providerReference ? await this.paymentRepository.findByProviderReference(providerReference) : await this.paymentRepository.findByOrderId(payload.orderId);

    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    if (payment.paymentStatus === 'SUCCESS' || payment.paymentStatus === 'FAILED' || payment.paymentStatus === 'REFUNDED') {
      return payment;
    }

    if (payload.status === 'SUCCESS') {
      payment = await this.paymentRepository.updateByOrderId(payment.orderId, {
        paymentStatus: 'SUCCESS',
        callbackProcessedAt: new Date(),
      });
      const order = await this.orderClient.getOrder(payment.orderId);
      await this.inventoryClient.confirmTickets(order.eventId, order.quantity);
      await this.orderClient.confirmOrder(payment.orderId);
      return payment;
    }

    payment = await this.paymentRepository.updateByOrderId(payment.orderId, {
      paymentStatus: 'FAILED',
      callbackProcessedAt: new Date(),
    });
    await this.orderClient.cancelOrder(payment.orderId, 'Payment failed');
    return payment;
  }

  async getPaymentStatus(orderId) {
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    return payment;
  }

  async getRefunds() {
    return this.paymentRepository.listRefunds();
  }
}

module.exports = { PaymentService };
