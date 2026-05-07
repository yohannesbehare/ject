const Review = require('../models/Review');
const ContactRequest = require('../models/ContactRequest');
const WorkerProfile = require('../models/WorkerProfile');
const { catchAsync } = require('../middleware/errorHandler');

// POST /api/reviews — Customer submits review
exports.createReview = catchAsync(async (req, res) => {
  const { contactRequestId, rating, comment } = req.body;

  if (!contactRequestId || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Please provide contactRequestId, rating, and comment.' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
  }

  const contact = await ContactRequest.findById(contactRequestId);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact request not found.' });
  if (contact.customerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }
  if (contact.status !== 'completed') {
    return res.status(400).json({ success: false, message: 'Can only review completed jobs.' });
  }
  if (contact.reviewSubmitted) {
    return res.status(400).json({ success: false, message: 'You have already reviewed this job.' });
  }

  const review = await Review.create({
    customerId: req.user._id,
    workerId: contact.workerId,
    contactRequestId,
    rating: Number(rating),
    comment,
  });

  // Mark contact as reviewed
  contact.reviewSubmitted = true;
  await contact.save();

  // Recalculate worker average rating
  const allReviews = await Review.find({ workerId: contact.workerId });
  const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await WorkerProfile.findOneAndUpdate(
    { userId: contact.workerId },
    {
      averageRating: Math.round(average * 10) / 10,
      totalReviews: allReviews.length,
    }
  );

  res.status(201).json({ success: true, review });
});

// GET /api/reviews/worker/:workerId — Public
exports.getWorkerReviews = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const reviews = await Review.find({ workerId: req.params.workerId })
    .populate('customerId', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const total = await Review.countDocuments({ workerId: req.params.workerId });
  res.json({ success: true, reviews, total });
});

// GET /api/reviews/customer — Own reviews
exports.getCustomerReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ customerId: req.user._id })
    .populate('workerId', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, reviews });
});
