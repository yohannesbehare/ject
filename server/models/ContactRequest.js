const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [1000, 'Description too long'],
    },
    preferredDate: { type: String },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
    },
    reviewSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactRequestSchema.index({ customerId: 1, createdAt: -1 });
contactRequestSchema.index({ workerId: 1, createdAt: -1 });
contactRequestSchema.index({ status: 1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
