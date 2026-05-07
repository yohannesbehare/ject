const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    profession: {
      type: String,
      enum: ['plumber', 'electrician', 'driver', 'painter', 'carpenter', 'laborer'],
      required: [true, 'Profession is required'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative'],
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
      max: 60,
    },
    skills: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Maximum 10 skills allowed',
      },
      default: [],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    workSamples: {
      type: [String], // Cloudinary URLs
      validate: {
        validator: (v) => v.length <= 6,
        message: 'Maximum 6 work samples allowed',
      },
      default: [],
    },
    isAvailable: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalContacts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for search
workerProfileSchema.index({ profession: 1, isAvailable: 1, isApproved: 1 });
workerProfileSchema.index({ averageRating: -1 });
workerProfileSchema.index({ hourlyRate: 1 });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
