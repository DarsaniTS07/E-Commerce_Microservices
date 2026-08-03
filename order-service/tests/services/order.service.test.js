const { OrderService } = require('../../src/services/order.service');

describe('OrderService', () => {
  let orderService;
  let mockOrderRepository;
  let mockInventoryClient;
  let mockEventClient;
  let mockWaitlistClient;
  let mockCartClient;
  let mockSnsClient;

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findByOrderId: jest.fn(),
      updateByOrderId: jest.fn(),
      findByUserId: jest.fn(),
    };
    mockInventoryClient = { confirmTickets: jest.fn(), releaseTickets: jest.fn() };
    mockEventClient = { getEventById: jest.fn() };
    mockWaitlistClient = { processWaitlist: jest.fn() };
    mockCartClient = { getCartById: jest.fn(), checkoutCart: jest.fn() };
    mockSnsClient = { publish: jest.fn().mockResolvedValue(true) };

    orderService = new OrderService(
      mockOrderRepository,
      mockInventoryClient,
      mockEventClient,
      mockWaitlistClient,
      mockCartClient,
      mockSnsClient
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFromCart', () => {
    it('should successfully create an order from a cart', async () => {
      const mockCart = { cartId: 'c1', userId: 'u1', eventId: 'e1', quantity: 2, status: 'ACTIVE' };
      const mockEvent = { eventId: 'e1', title: 'Concert', ticketPrice: 50 };
      const mockOrder = { orderId: 'o1', userId: 'u1', eventId: 'e1', quantity: 2, amount: 100 };

      mockEventClient.getEventById.mockResolvedValue(mockEvent);
      mockOrderRepository.create.mockResolvedValue(mockOrder);
      mockCartClient.checkoutCart.mockResolvedValue(true);

      const result = await orderService.createFromCart(mockCart);

      expect(mockOrderRepository.create).toHaveBeenCalled();
      expect(result.orderId).toBe('o1');
    });
  });
});
