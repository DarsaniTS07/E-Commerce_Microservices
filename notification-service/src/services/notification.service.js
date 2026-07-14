const { AppError } = require("../utils/AppError");

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

  async markAsRead(notificationId, userId) {
    const notification =
      await this.notificationRepository.findByNotificationId(notificationId);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    // Prevent users from marking another user's notification as read.
    if (notification.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return this.notificationRepository.markAsRead(notificationId);
  }
}

module.exports = { NotificationService };