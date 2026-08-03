const { AppError } = require('../utils/AppError');
const { parsePagination } = require('../utils/pagination');

class EventService {
  constructor(eventRepository, inventoryClient) {
    this.eventRepository = eventRepository;
    this.inventoryClient = inventoryClient;
  }

  async listEvents(query) {
    const pagination = parsePagination(query);
    const filters = {
      city: query.city,
      category: query.category,
      date: query.date,
      status: query.status,
    };

    const result = await this.eventRepository.search(filters, pagination);

    const items = await Promise.all(result.items.map(async (item) => {
      try {
        const inventory = await this.inventoryClient.getAvailability(item.eventId);
        if (inventory) {
          item.availableTicketCount = inventory.availableTickets;
        }
      } catch (err) {
        // ignore missing inventory
      }
      return item;
    }));

    return {
      items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        totalPages: Math.max(1,Math.ceil(result.total / pagination.limit)),
      },
    };
  }

  async getEventDetails(eventId) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    let inventory = null;

    try {
      inventory = await this.inventoryClient.getAvailability(eventId);
    } catch (error) {
      console.warn(
        `Inventory service unavailable for event ${eventId}`
      );
    }
    return { ...event, inventory };
  }

  async createEvent(payload) {
    const totalTickets = Number(payload.totalTickets ?? payload.availableTicketCount ?? 0);
    const reservedTickets = Number(payload.reservedTickets ?? 0);
    const availableTickets = Math.max(0, totalTickets - reservedTickets);

    const event = await this.eventRepository.create({
      ...payload,
      status: payload.status || "PUBLISHED",
      availableStatus: availableTickets > 0 ? "AVAILABLE" : "SOLD_OUT",
      availableTicketCount: totalTickets,
      createdBy: payload.createdBy || null,
    });

    try {
      await this.inventoryClient.createInventory({
        eventId: event.eventId,
        totalTickets,
        reservedTickets,
        availableTickets,
      });
    } catch (err) {
    console.error("Failed to create inventory:", err.message);
  }

  return event;
}

  async updateEvent(eventId, payload) {
    const updated = await this.eventRepository.updateByEventId(eventId, payload);
    if (!updated) {
      throw new AppError('Event not found', 404);
    }

    if (payload.totalTickets !== undefined || payload.availableTicketCount !== undefined || payload.reservedTickets !== undefined) {
      try {
        const currentInventory = await this.inventoryClient.getAvailability(eventId).catch(() => null);
        if (currentInventory) {
          const totalTickets = Number(payload.totalTickets ?? payload.availableTicketCount ?? currentInventory.totalTickets);
          const reservedTickets = payload.reservedTickets !== undefined ? Number(payload.reservedTickets) : currentInventory.reservedTickets;
          const availableTickets = Math.max(0, totalTickets - reservedTickets);
          
          await this.inventoryClient.updateInventory(eventId, {
            totalTickets,
            reservedTickets,
            availableTickets
          });

          if (availableTickets <= 0 && updated.availableStatus !== "SOLD_OUT") {
            await this.eventRepository.updateByEventId(eventId, { availableStatus: "SOLD_OUT" });
          } else if (availableTickets > 0 && updated.availableStatus === "SOLD_OUT") {
            await this.eventRepository.updateByEventId(eventId, { availableStatus: "AVAILABLE" });
          }
        }
      } catch (err) {
        console.error("Failed to update inventory", err);
      }
    }

    return updated;
  }

  async deleteEvent(eventId) {
    const deleted = await this.eventRepository.softDelete(eventId);
    if (!deleted) {
      throw new AppError('Event not found', 404);
    }

    return deleted;
  }

  async refreshAvailability(eventId) {
    const inventory = await this.inventoryClient.getAvailability(eventId).catch(() => null);
    if (!inventory) {
      return null;
    }

    return this.eventRepository.syncAvailability(eventId, inventory.availableTickets);
  }
}

module.exports = { EventService };
