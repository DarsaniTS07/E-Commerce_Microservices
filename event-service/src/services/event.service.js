const { AppError } = require('../../../E-Commerce/backend/src/utils/AppError');
const { parsePagination } = require('../../../E-Commerce/backend/src/utils/pagination');

class EventService {
  constructor(eventRepository, inventoryRepository) {
    this.eventRepository = eventRepository;
    this.inventoryRepository = inventoryRepository;
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

    return {
      items: result.items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    };
  }

  async getEventDetails(eventId) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const inventory = await this.inventoryRepository.findByEventId(eventId);
    return { ...event.toObject(), inventory: inventory ? inventory.toObject() : null };
  }

  async createEvent(payload) {
    const event = await this.eventRepository.create({
      ...payload,
      status: payload.status || 'PUBLISHED',
      availableStatus: 'HIDDEN',
      availableTicketCount: Number(payload.availableTicketCount || 0),
      createdBy: payload.createdBy || null,
    });

    return event;
  }

  async updateEvent(eventId, payload) {
    const updated = await this.eventRepository.updateByEventId(eventId, payload);
    if (!updated) {
      throw new AppError('Event not found', 404);
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
    const inventory = await this.inventoryRepository.findByEventId(eventId);
    if (!inventory) {
      return null;
    }

    return this.eventRepository.syncAvailability(eventId, inventory.availableTickets);
  }
}

module.exports = { EventService };
