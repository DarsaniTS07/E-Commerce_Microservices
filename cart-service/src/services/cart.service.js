const { AppError } = require('../utils/AppError');
const { minutesFromNow } = require('../utils/time');

class CartService {
  constructor(cartRepository, inventoryClient, waitlistClient) {
    this.cartRepository = cartRepository;
    this.inventoryClient = inventoryClient;
    this.waitlistClient = waitlistClient;
  }

  async addItem({ userId, eventId, quantity }) {
    const existing = await this.cartRepository.findActiveByUserEvent(userId, eventId);
    const reservationExpiry = minutesFromNow(15);

    if (existing) {
      const delta = quantity - existing.quantity;
      if (delta > 0) {
        await this.inventoryClient.reserveTickets(eventId, delta);
      } else if (delta < 0) {
        await this.inventoryClient.releaseTickets(eventId, Math.abs(delta));
      }

      return this.cartRepository.updateByCartId(existing.cartId, { quantity, reservationExpiry });
    }

    await this.inventoryClient.reserveTickets(eventId, quantity);
    return this.cartRepository.create({ userId, eventId, quantity, reservationExpiry, status: 'ACTIVE' });
  }

  async viewCart(userId) {
    await this.expireCarts();
    return this.cartRepository.findByUserId(userId);
  }

  async updateQuantity({ userId, cartId, quantity }) {
    const cart = await this.cartRepository.findByCartId(cartId);
    if (!cart || cart.userId !== userId || cart.status !== 'ACTIVE') {
      throw new AppError('Cart item not found', 404);
    }

    const delta = quantity - cart.quantity;
    if (delta > 0) {
      await this.inventoryClient.reserveTickets(cart.eventId, delta);
    } else if (delta < 0) {
      await this.inventoryClient.releaseTickets(cart.eventId, Math.abs(delta));
    }

    return this.cartRepository.updateByCartId(cartId, {
      quantity,
      reservationExpiry: minutesFromNow(15),
    });
  }

  async removeItem({ userId, cartId }) {
    const cart = await this.cartRepository.findByCartId(cartId);
    if (!cart || cart.userId !== userId || cart.status !== 'ACTIVE') {
      throw new AppError('Cart item not found', 404);
    }

    await this.inventoryClient.releaseTickets(cart.eventId, cart.quantity);
    const removed = await this.cartRepository.removeByCartId(cartId);
    await this.waitlistClient.processWaitlist(cart.eventId).catch(() => null);

    return removed;
  }

  async expireCarts() {
    const expiredCarts = await this.cartRepository.findExpired();

    for (const cart of expiredCarts) {
      await this.inventoryClient.releaseTickets(cart.eventId, cart.quantity).catch(() => null);
      await this.cartRepository.markExpired(cart.cartId);
      await this.waitlistClient.processWaitlist(cart.eventId).catch(() => null);
    }

    return expiredCarts.length;
  }

  async getCartItem(userId, cartId) {
    const cart = await this.cartRepository.findByCartId(cartId);
    if (!cart) {
      throw new AppError('Cart item not found', 404);
    }

    if (userId && cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }

    return cart;
  }

  async checkoutCart(cartId, orderId) {
    const cart = await this.cartRepository.findByCartId(cartId);
    if (!cart || cart.status !== 'ACTIVE') {
      throw new AppError('Cart item not found', 404);
    }

    return this.cartRepository.updateByCartId(cartId, {
      status: 'CHECKED_OUT',
      orderId,
    });
  }
}

module.exports = { CartService };
