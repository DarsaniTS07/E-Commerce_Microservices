const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true, default: uuidv4 },
    orderId: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], default: 'PENDING', index: true },
    providerReference: { type: String, unique: true, sparse: true, index: true },
    callbackProcessedAt: { type: Date, default: null },
    refundReference: { type: String, default: null },
  },
  { timestamps: true, collection: 'payments' }
);

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = { PaymentModel };
