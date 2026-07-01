const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, default: uuidv4 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    venue: { type: String, required: true, trim: true },
    city: { type: String, required: true, index: true },
    eventDate: { type: Date, required: true, index: true },
    eventTime: { type: String, required: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CANCELLED'], default: 'DRAFT', index: true },
    availableStatus: { type: String, enum: ['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'HIDDEN'], default: 'HIDDEN' },
    availableTicketCount: { type: Number, default: 0, min: 0 },
    ticketPrice: { type: Number, required: true, min: 0 },
    createdBy: { type: String, default: null, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'events' }
);

productSchema.index({ title: 'text', description: 'text', category: 'text', city: 'text', venue: 'text' });

const EventModel = mongoose.model('Event', productSchema);

module.exports = { EventModel };
