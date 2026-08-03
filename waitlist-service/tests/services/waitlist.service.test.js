const { WaitlistService } = require('../../src/services/waitlist.service');

describe('WaitlistService', () => {
  let waitlistService;
  let mockWaitlistRepository;
  let mockInventoryClient;
  let mockNotificationClient;
  let mockEventClient;

  beforeEach(() => {
    mockWaitlistRepository = {
      findByEventAndUser: jest.fn(),
      countWaiting: jest.fn(),
      join: jest.fn(),
      nextWaiting: jest.fn(),
      updateStatus: jest.fn(),
      listByUser: jest.fn(),
      findByWaitlistId: jest.fn(),
      leave: jest.fn(),
    };
    mockInventoryClient = { reserveTickets: jest.fn() };
    mockNotificationClient = { createNotification: jest.fn() };
    mockEventClient = { getEventById: jest.fn(), syncAvailability: jest.fn() };

    waitlistService = new WaitlistService(
      mockWaitlistRepository,
      mockInventoryClient,
      mockNotificationClient,
      mockEventClient
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('joinWaitlist', () => {
    it('should add a user to the waitlist', async () => {
      const mockEntry = { waitlistId: 'w1', eventId: 'e1', userId: 'u1', quantity: 1, position: 1 };
      mockWaitlistRepository.findByEventAndUser.mockResolvedValue(null);
      mockWaitlistRepository.countWaiting.mockResolvedValue(0);
      mockWaitlistRepository.join.mockResolvedValue(mockEntry);

      const result = await waitlistService.joinWaitlist({ eventId: 'e1', userId: 'u1', quantity: 1 });

      expect(mockWaitlistRepository.join).toHaveBeenCalled();
      expect(result.waitlistId).toBe('w1');
    });

    it('should return existing entry if user already on waitlist', async () => {
      const existing = { waitlistId: 'w1', eventId: 'e1', userId: 'u1' };
      mockWaitlistRepository.findByEventAndUser.mockResolvedValue(existing);

      const result = await waitlistService.joinWaitlist({ eventId: 'e1', userId: 'u1', quantity: 1 });

      expect(mockWaitlistRepository.join).not.toHaveBeenCalled();
      expect(result).toEqual(existing);
    });
  });

  describe('processWaitlist', () => {
    it('should notify the next user in waitlist when tickets become available', async () => {
      const mockNext = { waitlistId: 'w1', userId: 'u1', quantity: 1 };
      const mockInventory = { availableTickets: 5 };
      const mockEvent = { eventId: 'e1', title: 'Concert' };

      mockWaitlistRepository.nextWaiting.mockResolvedValue(mockNext);
      mockInventoryClient.reserveTickets.mockResolvedValue(mockInventory);
      mockWaitlistRepository.updateStatus.mockResolvedValue({ ...mockNext, status: 'NOTIFIED' });
      mockEventClient.getEventById.mockResolvedValue(mockEvent);
      mockNotificationClient.createNotification.mockResolvedValue(true);
      mockEventClient.syncAvailability.mockResolvedValue(true);

      const result = await waitlistService.processWaitlist('e1');

      expect(mockInventoryClient.reserveTickets).toHaveBeenCalledWith('e1', 1);
      expect(mockNotificationClient.createNotification).toHaveBeenCalled();
      expect(result.status).toBe('NOTIFIED');
    });
  });
});
