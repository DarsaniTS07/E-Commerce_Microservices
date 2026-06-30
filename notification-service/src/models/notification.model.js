const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, required: true, unique: true, default: uuidv4 },
    userId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['UNREAD', 'READ'], default: 'UNREAD', index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'notifications' }
);

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = { NotificationModel };
