const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const waitlistSchema = new mongoose.Schema(
  {
    waitlistId: { type: String, required: true, unique: true, default: uuidv4 },
    eventId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    position: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['WAITING', 'NOTIFIED', 'EXPIRED', 'BOOKED'], default: 'WAITING', index: true },
    joinedAt: { type: Date, default: Date.now },
    notifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'waitlists' }
);

waitlistSchema.index({ eventId: 1, status: 1, joinedAt: 1 });

const WaitlistModel = mongoose.model('Waitlist', waitlistSchema);

module.exports = { WaitlistModel };
