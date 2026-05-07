const mongoose = require('mongoose');

const savedWorkerSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

savedWorkerSchema.index({ customerId: 1 });
savedWorkerSchema.index({ customerId: 1, workerId: 1 }, { unique: true });

module.exports = mongoose.model('SavedWorker', savedWorkerSchema);
