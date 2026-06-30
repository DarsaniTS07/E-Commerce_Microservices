const { WaitlistModel } = require('./model');

class WaitlistRepository {
  async join(payload) {
    return WaitlistModel.create(payload);
  }

  async listByEvent(eventId) {
    return WaitlistModel.find({ eventId }).sort({ position: 1, joinedAt: 1 });
  }

  async listByUser(userId) {
    return WaitlistModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByWaitlistId(waitlistId) {
    return WaitlistModel.findOne({ waitlistId });
  }

  async findByEventAndUser(eventId, userId) {
    return WaitlistModel.findOne({ eventId, userId, status: 'WAITING' });
  }

  async nextWaiting(eventId) {
    return WaitlistModel.findOne({ eventId, status: 'WAITING' }).sort({ position: 1, joinedAt: 1 });
  }

  async countWaiting(eventId) {
    return WaitlistModel.countDocuments({ eventId, status: 'WAITING' });
  }

  async updateStatus(waitlistId, payload) {
    return WaitlistModel.findOneAndUpdate({ waitlistId }, { $set: payload }, { new: true });
  }

  async leave(waitlistId) {
    return WaitlistModel.findOneAndUpdate({ waitlistId }, { $set: { status: 'EXPIRED' } }, { new: true });
  }
}

module.exports = { WaitlistRepository };
