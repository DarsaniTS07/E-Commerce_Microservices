const { AppError } = require('../../../E-Commerce/backend/src/utils/AppError');

class InventoryService {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async getAvailability(eventId) {
    const inventory = await this.inventoryRepository.findByEventId(eventId);
    if (!inventory) {
      throw new AppError('Inventory not found', 404);
    }

    return inventory;
  }

  async reserveTickets(eventId, quantity) {
    const inventory = await this.inventoryRepository.reserve(eventId, quantity);
    if (!inventory) {
      throw new AppError('Insufficient tickets available', 409);
    }

    return inventory;
  }

  async releaseTickets(eventId, quantity) {
    const inventory = await this.inventoryRepository.release(eventId, quantity);
    if (!inventory) {
      throw new AppError('Reservation release failed', 409);
    }

    return inventory;
  }

  async confirmTickets(eventId, quantity) {
    const inventory = await this.inventoryRepository.confirm(eventId, quantity);
    if (!inventory) {
      throw new AppError('Reservation confirmation failed', 409);
    }

    return inventory;
  }

  async initializeInventory(eventId, totalTickets) {
    return this.inventoryRepository.setTotals(eventId, totalTickets);
  }
}

module.exports = { InventoryService };
