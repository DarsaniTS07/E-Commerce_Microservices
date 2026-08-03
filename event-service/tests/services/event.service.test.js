const { EventService } = require('../../src/services/event.service');

describe('EventService', () => {
  let eventService;
  let mockEventRepository;
  let mockInventoryClient;

  beforeEach(() => {
    mockEventRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateByEventId: jest.fn(),
      softDelete: jest.fn(),
      search: jest.fn(),
    };

    mockInventoryClient = {
      createInventory: jest.fn(),
      getAvailability: jest.fn(),
      updateInventory: jest.fn(),
    };

    eventService = new EventService(mockEventRepository, mockInventoryClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event and initialize its inventory', async () => {
      const mockPayload = {
        title: 'Concert',
        eventDate: '2027-01-01',
        totalTickets: 100,
        reservedTickets: 10,
        ticketPrice: 50,
      };

      const mockCreatedEvent = { eventId: 'evt-123', ...mockPayload };
      mockEventRepository.create.mockResolvedValue(mockCreatedEvent);
      mockInventoryClient.createInventory.mockResolvedValue(true);

      const result = await eventService.createEvent(mockPayload);

      expect(mockEventRepository.create).toHaveBeenCalledWith(expect.objectContaining(mockPayload));
      expect(mockInventoryClient.createInventory).toHaveBeenCalledWith({
        eventId: 'evt-123',
        totalTickets: 100,
        availableTickets: 90,
        reservedTickets: 10
      });
      expect(result).toEqual(mockCreatedEvent);
    });
  });

  describe('getEventDetails', () => {
    it('should return event details merged with live inventory data', async () => {
      const mockEvent = { eventId: 'evt-123', title: 'Concert' };
      const mockInventory = { availableTickets: 90, reservedTickets: 10 };

      mockEventRepository.findById.mockResolvedValue(mockEvent);
      mockInventoryClient.getAvailability.mockResolvedValue(mockInventory);

      const result = await eventService.getEventDetails('evt-123');

      expect(mockEventRepository.findById).toHaveBeenCalledWith('evt-123');
      expect(mockInventoryClient.getAvailability).toHaveBeenCalledWith('evt-123');
      expect(result).toEqual({ ...mockEvent, inventory: mockInventory });
    });

    it('should throw an error if event does not exist', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      await expect(eventService.getEventDetails('non-existent')).rejects.toThrow('Event not found');
    });
  });
});
