const { AppError } = require("../utils/AppError");

class InventoryService {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  // ---------- CRUD ----------

  async listInventory(query) {
    return this.inventoryRepository.findAll(query);
  }

  async getInventory(eventId) {
    const inventory = await this.inventoryRepository.findById(eventId);

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  async createInventory(payload) {
    return this.inventoryRepository.create(payload);
  }

  async updateInventory(eventId, payload) {
    const inventory = await this.inventoryRepository.updateByEventId(
      eventId,
      payload
    );

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  async deleteInventory(eventId) {
    const inventory = await this.inventoryRepository.softDelete(eventId);

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  // ---------- Internal APIs ----------

  async getAvailability(eventId) {
    return this.getInventory(eventId);
  }

  async reserveTickets(eventId, quantity) {
    let inventory;
    try {
      inventory = await this.inventoryRepository.reserve(
        eventId,
        quantity
      );
    } catch (error) {
      if (error.name === 'ValidationException' || (error.message && error.message.includes('ValidationException'))) {
        // Inventory record doesn't exist (seeded directly in event-service). Auto-initialize.
        await this.initializeInventory(eventId, 500); // Default fallback
        inventory = await this.inventoryRepository.reserve(eventId, quantity);
      } else {
        throw error;
      }
    }

    if (!inventory) {
      throw new AppError("Insufficient tickets available", 409);
    }

    return inventory;
  }

  async releaseTickets(eventId, quantity) {
    const inventory = await this.inventoryRepository.release(
      eventId,
      quantity
    );

    if (!inventory) {
      throw new AppError("Reservation release failed", 409);
    }

    return inventory;
  }

  async confirmTickets(eventId, quantity) {
    const inventory = await this.inventoryRepository.confirm(
      eventId,
      quantity
    );

    if (!inventory) {
      throw new AppError("Reservation confirmation failed", 409);
    }

    return inventory;
  }

  async initializeInventory(eventId, totalTickets) {
    return this.inventoryRepository.setTotals(eventId, totalTickets);
  }
}

module.exports = { InventoryService };