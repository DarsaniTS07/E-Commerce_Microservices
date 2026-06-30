const { AppError } = require('../../utils/AppError');
const { minutesFromNow } = require('../../utils/time');

class WaitlistService {
  constructor(waitlistRepository, notificationService, inventoryService, productRepository) {
    this.waitlistRepository = waitlistRepository;
    this.notificationService = notificationService;
    this.inventoryService = inventoryService;
    this.productRepository = productRepository;
  }

  async joinWaitlist({ eventId, userId, quantity }) {
    const existing = await this.waitlistRepository.findByEventAndUser(eventId, userId);
    if (existing) {
      return existing;
    }

    const position = (await this.waitlistRepository.countWaiting(eventId)) + 1;
    return this.waitlistRepository.join({ eventId, userId, quantity, position, status: 'WAITING', joinedAt: new Date() });
  }

  async getPosition({ eventId, userId }) {
    const waitlist = await this.waitlistRepository.findByEventAndUser(eventId, userId);
    if (!waitlist) {
      throw new AppError('Waitlist entry not found', 404);
    }

    return waitlist;
  }

  async getUserWaitlists(userId) {
    return this.waitlistRepository.listByUser(userId);
  }

  async leaveWaitlist(waitlistId) {
    const waitlist = await this.waitlistRepository.findByWaitlistId(waitlistId);
    if (!waitlist) {
      throw new AppError('Waitlist entry not found', 404);
    }

    return this.waitlistRepository.leave(waitlistId);
  }

  async processWaitlist(eventId) {
    const next = await this.waitlistRepository.nextWaiting(eventId);
    if (!next) {
      return null;
    }

    const inventory = await this.inventoryService.reserveTickets(eventId, next.quantity).catch(() => null);
    if (!inventory) {
      return null;
    }

    const notified = await this.waitlistRepository.updateStatus(next.waitlistId, {
      status: 'NOTIFIED',
      notifiedAt: new Date(),
      expiresAt: minutesFromNow(15),
    });

    const product = await this.productRepository.findById(eventId);
    const message = product
      ? `Tickets are now available for Event ${product.title}. Complete booking within 15 minutes.`
      : 'Tickets are now available. Complete booking within 15 minutes.';

    await this.notificationService.createNotification({
      userId: next.userId,
      message,
      status: 'UNREAD',
    });

    await this.productRepository.syncAvailability(eventId, inventory.availableTickets);
    return notified;
  }
}

module.exports = { WaitlistService };
