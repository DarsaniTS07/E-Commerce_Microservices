const { CartService } = require('../../src/services/cart.service');

describe('CartService', () => {
  let cartService;
  let mockCartRepository;
  let mockInventoryClient;
  let mockWaitlistClient;

  beforeEach(() => {
    mockCartRepository = {
      findActiveByUserEvent: jest.fn(),
      create: jest.fn(),
      updateByCartId: jest.fn(),
      findByUserId: jest.fn(),
      findExpired: jest.fn(),
    };

    mockInventoryClient = {
      reserveTickets: jest.fn(),
      releaseTickets: jest.fn(),
    };

    mockWaitlistClient = {
      processWaitlist: jest.fn(),
    };

    cartService = new CartService(mockCartRepository, mockInventoryClient, mockWaitlistClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    it('should add item and reserve tickets in inventory', async () => {
      const mockCart = { userId: 'u1', eventId: 'e1', quantity: 2 };
      mockCartRepository.findActiveByUserEvent.mockResolvedValue(null);
      mockInventoryClient.reserveTickets.mockResolvedValue(true);
      mockCartRepository.create.mockResolvedValue(mockCart);

      const result = await cartService.addItem({ userId: 'u1', eventId: 'e1', quantity: 2 });

      expect(mockInventoryClient.reserveTickets).toHaveBeenCalledWith('e1', 2);
      expect(mockCartRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should fail if inventory reservation fails', async () => {
      mockCartRepository.findActiveByUserEvent.mockResolvedValue(null);
      mockInventoryClient.reserveTickets.mockRejectedValue(new Error('Insufficient tickets'));

      await expect(cartService.addItem({ userId: 'u1', eventId: 'e1', quantity: 2 }))
        .rejects.toThrow('Insufficient tickets');
      expect(mockCartRepository.create).not.toHaveBeenCalled();
    });
  });
});
