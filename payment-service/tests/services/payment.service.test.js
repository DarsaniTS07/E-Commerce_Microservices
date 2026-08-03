const { PaymentService } = require('../../src/services/payment.service');

describe('PaymentService', () => {
  let paymentService;
  let mockPaymentRepository;
  let mockOrderClient;
  let mockInventoryClient;
  let mockSnsClient;

  beforeEach(() => {
    mockPaymentRepository = {
      findByOrderId: jest.fn(),
      create: jest.fn(),
      findByProviderReference: jest.fn(),
      updateByOrderId: jest.fn(),
    };
    mockOrderClient = {
      getOrder: jest.fn(),
      confirmOrder: jest.fn(),
      cancelOrder: jest.fn(),
    };
    mockInventoryClient = { confirmTickets: jest.fn() };
    mockSnsClient = { publish: jest.fn().mockResolvedValue(true) };

    paymentService = new PaymentService(mockPaymentRepository, mockOrderClient, mockInventoryClient, mockSnsClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initiatePayment', () => {
    it('should initiate payment for a pending order', async () => {
      const mockOrder = { orderId: 'o1', status: 'PENDING_PAYMENT', amount: 100 };
      const mockPayment = { paymentId: 'p1', orderId: 'o1', paymentStatus: 'PENDING' };

      mockOrderClient.getOrder.mockResolvedValue(mockOrder);
      mockPaymentRepository.findByOrderId.mockResolvedValue(null);
      mockPaymentRepository.create.mockResolvedValue(mockPayment);

      const result = await paymentService.initiatePayment({ orderId: 'o1' });

      expect(mockOrderClient.getOrder).toHaveBeenCalledWith('o1');
      expect(mockPaymentRepository.create).toHaveBeenCalled();
      expect(result.paymentStatus).toBe('PENDING');
    });
  });
});
