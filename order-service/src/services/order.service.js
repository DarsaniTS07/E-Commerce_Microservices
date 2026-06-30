const { AppError } = require('../../../E-Commerce/backend/src/utils/AppError');
const { v4: uuidv4 } = require('uuid');

class OrderService {
  constructor(orderRepository, inventoryService, productRepository, waitlistService, cartRepository = null) {
    this.orderRepository = orderRepository;
    this.inventoryService = inventoryService;
    this.productRepository = productRepository;
    this.waitlistService = waitlistService;
    this.cartRepository = cartRepository;
  }

  async createFromCart(cart) {
    if (!cart || cart.status !== 'ACTIVE') {
      throw new AppError('Cart reservation is not valid', 409);
    }

    const product = await this.productRepository.findById(cart.eventId);
    if (!product) {
      throw new AppError('Event not found', 404);
    }

    const amount = Number(product.ticketPrice) * Number(cart.quantity);
    const order = await this.orderRepository.create({
      cartId: cart.cartId,
      userId: cart.userId,
      eventId: cart.eventId,
      quantity: cart.quantity,
      amount,
      status: 'PENDING_PAYMENT',
      ticketCode: null,
    });

    if (this.cartRepository) {
      await this.cartRepository.updateByCartId(cart.cartId, { status: 'CHECKED_OUT', orderId: order.orderId });
    }

    return order;
  }

  async getOrder(orderId) {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async getUserOrders(userId) {
    return this.orderRepository.findByUserId(userId);
  }

  async confirmOrder(orderId) {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status === 'CONFIRMED') {
      return order;
    }

    return this.orderRepository.updateByOrderId(orderId, {
      status: 'CONFIRMED',
      ticketCode: `TKT-${uuidv4()}`,
    });
  }

  async cancelOrder(orderId, reason = 'Cancelled by system') {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.status === 'CANCELLED') {
      return order;
    }

    await this.inventoryService.releaseTickets(order.eventId, order.quantity).catch(() => null);
    await this.waitlistService.processWaitlist(order.eventId).catch(() => null);

    return this.orderRepository.updateByOrderId(orderId, {
      status: 'CANCELLED',
      cancellationReason: reason,
    });
  }

  async refundOrder(orderId) {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return this.orderRepository.updateByOrderId(orderId, { status: 'REFUNDED' });
  }

  async getTicket(orderId) {
    const order = await this.getOrder(orderId);
    if (order.status !== 'CONFIRMED') {
      throw new AppError('Ticket is only available for confirmed orders', 409);
    }

    return {
      orderId: order.orderId,
      ticketCode: order.ticketCode,
      eventId: order.eventId,
      quantity: order.quantity,
      status: order.status,
    };
  }
}

module.exports = { OrderService };
