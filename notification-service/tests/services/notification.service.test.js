const { NotificationService } = require('../../src/services/notification.service');

describe('NotificationService', () => {
  let notificationService;
  let mockNotificationRepository;

  beforeEach(() => {
    mockNotificationRepository = {
      create: jest.fn(),
      list: jest.fn(),
      listByUser: jest.fn(),
      findByNotificationId: jest.fn(),
      markAsRead: jest.fn(),
    };

    notificationService = new NotificationService(mockNotificationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should successfully create a notification', async () => {
      const mockPayload = { userId: 'u1', message: 'Your order is confirmed', status: 'UNREAD' };
      mockNotificationRepository.create.mockResolvedValue({ notificationId: 'n1', ...mockPayload });

      const result = await notificationService.createNotification(mockPayload);

      expect(mockNotificationRepository.create).toHaveBeenCalledWith(mockPayload);
      expect(result.notificationId).toBe('n1');
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const mockNotification = { notificationId: 'n1', userId: 'u1', status: 'UNREAD' };
      mockNotificationRepository.findByNotificationId.mockResolvedValue(mockNotification);
      mockNotificationRepository.markAsRead.mockResolvedValue({ ...mockNotification, status: 'READ' });

      const result = await notificationService.markAsRead('n1', 'u1');

      expect(mockNotificationRepository.markAsRead).toHaveBeenCalledWith('n1');
      expect(result.status).toBe('READ');
    });
  });
});
