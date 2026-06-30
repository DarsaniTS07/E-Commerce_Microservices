const { NotificationModel } = require('../models/notification.model');

class NotificationRepository {
  async create(payload) {
    return NotificationModel.create(payload);
  }

  async list() {
    return NotificationModel.find().sort({ createdAt: -1 });
  }

  async listByUser(userId) {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByNotificationId(notificationId) {
    return NotificationModel.findOne({ notificationId });
  }

  async markAsRead(notificationId) {
    return NotificationModel.findOneAndUpdate(
      { notificationId },
      { $set: { status: 'READ', readAt: new Date() } },
      { new: true }
    );
  }
}

module.exports = { NotificationRepository };
