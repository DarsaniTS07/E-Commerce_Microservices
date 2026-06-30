const { AppError } = require('../../../E-Commerce/backend/src/utils/AppError');
const { minutesFromNow } = require('../../../E-Commerce/backend/src/utils/time');

class CartService {
  constructor(cartRepository, inventoryService, waitlistService) {
    this.cartRepository = cartRepository;
    this.inventoryService = inventoryService;
    this.waitlistService = waitlistService;
  }

  async addItem({ userId, eventId, quantity }) {
    const existing = await this.cartRepository.findActiveByUserEvent(userId, eventId);
    const reservationExpiry = minutesFromNow(15);

    if (existing) {
      const delta = quantity - existing.quantity;
      if (delta > 0) {
        await this.inventoryService.reserveTickets(eventId, delta);
      } else if (delta < 0) {
        await this.inventoryService.releaseTickets(eventId, Math.abs(delta));
      }

      return this.cartRepository.updateByCartId(existing.cartId, { quantity, reservationExpiry });
    }

    await this.inventoryService.reserveTickets(eventId, quantity);
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
      await this.inventoryService.reserveTickets(cart.eventId, delta);
    } else if (delta < 0) {
      await this.inventoryService.releaseTickets(cart.eventId, Math.abs(delta));
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

    await this.inventoryService.releaseTickets(cart.eventId, cart.quantity);
    const removed = await this.cartRepository.removeByCartId(cartId);
    await this.waitlistService.processWaitlist(cart.eventId);

    return removed;
  }

  async expireCarts() {
    const expiredCarts = await this.cartRepository.findExpired();

    for (const cart of expiredCarts) {
      await this.inventoryService.releaseTickets(cart.eventId, cart.quantity).catch(() => null);
      await this.cartRepository.markExpired(cart.cartId);
      await this.waitlistService.processWaitlist(cart.eventId).catch(() => null);
    }

    return expiredCarts.length;
  }

  async getCartItem(userId, cartId) {
    const cart = await this.cartRepository.findByCartId(cartId);
    if (!cart || cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }

    return cart;
  }
}

module.exports = { CartService };
