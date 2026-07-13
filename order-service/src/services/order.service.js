const { AppError } = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

class OrderService {
  constructor(
    orderRepository,
    inventoryClient,
    eventClient,
    waitlistClient,
    cartClient,
    snsClient
  ) {
    this.orderRepository = orderRepository;
    this.inventoryClient = inventoryClient;
    this.eventClient = eventClient;
    this.waitlistClient = waitlistClient;
    this.cartClient = cartClient;
    this.snsClient = snsClient;
  }

  async createFromCartId(cartId) {
    const cart = await this.cartClient.getCartById(cartId);
    return this.createFromCart(cart);
  }

  async createFromCart(cart) {
    if (!cart || cart.status !== 'ACTIVE') {
      throw new AppError('Cart reservation is not valid', 409);
    }

    const event = await this.eventClient.getEventById(cart.eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const amount = Number(event.ticketPrice) * Number(cart.quantity);
    const order = await this.orderRepository.create({
      cartId: cart.cartId,
      userId: cart.userId,
      eventId: cart.eventId,
      quantity: cart.quantity,
      amount,
      status: 'PENDING_PAYMENT',
      ticketCode: null,
    });

    await this.cartClient.checkoutCart(cart.cartId, order.orderId).catch(() => null);

    await this.snsClient.publish({
      eventType: "OrderCreated",
      orderId: order.orderId,
      userId: order.userId,
      eventId: order.eventId,
      quantity: order.quantity,
      amount: order.amount,
      message: "Your order has been created successfully."
    }).catch((err) => {
      console.error("Failed to publish OrderCreated event:", err);
    });

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

    await this.inventoryClient.releaseTickets(order.eventId, order.quantity).catch(() => null);
    await this.waitlistClient.processWaitlist(order.eventId).catch(() => null);

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
