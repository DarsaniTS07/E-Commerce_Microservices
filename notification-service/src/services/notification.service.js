const { AppError } = require('../../utils/AppError');

class NotificationService {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async createNotification(payload) {
    return this.notificationRepository.create(payload);
  }

  async getNotifications(userId) {
    if (userId) {
      return this.notificationRepository.listByUser(userId);
    }

    return this.notificationRepository.list();
  }

  async markAsRead(notificationId) {
    const notification = await this.notificationRepository.markAsRead(notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    return notification;
  }
}

module.exports = { NotificationService };
