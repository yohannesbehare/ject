const ContactRequest = require('../models/ContactRequest');
const WorkerProfile = require('../models/WorkerProfile');
const SavedWorker = require('../models/SavedWorker');
const Review = require('../models/Review');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorHandler');

// GET /api/dashboard/customer
exports.getCustomerDashboard = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const [totalContacts, pendingContacts, completedContacts, savedWorkers, recentContacts] = await Promise.all([
    ContactRequest.countDocuments({ customerId: userId }),
    ContactRequest.countDocuments({ customerId: userId, status: 'pending' }),
    ContactRequest.countDocuments({ customerId: userId, status: 'completed' }),
    SavedWorker.countDocuments({ customerId: userId }),
    ContactRequest.find({ customerId: userId })
      .populate('workerId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  res.json({
    success: true,
    stats: { totalContacts, pendingContacts, completedContacts, savedWorkers },
    recentContacts,
  });
});

// GET /api/dashboard/worker
exports.getWorkerDashboard = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [profile, totalContacts, pendingContacts, weekContacts, recentRequests, recentReviews] = await Promise.all([
    WorkerProfile.findOne({ userId }),
    ContactRequest.countDocuments({ workerId: userId }),
    ContactRequest.countDocuments({ workerId: userId, status: 'pending' }),
    ContactRequest.countDocuments({ workerId: userId, createdAt: { $gte: oneWeekAgo } }),
    ContactRequest.find({ workerId: userId })
      .populate('customerId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Review.find({ workerId: userId })
      .populate('customerId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  res.json({
    success: true,
    stats: {
      totalViews: profile?.totalViews || 0,
      totalContacts,
      pendingContacts,
      weekContacts,
      averageRating: profile?.averageRating || 0,
      totalReviews: profile?.totalReviews || 0,
      isAvailable: profile?.isAvailable,
    },
    recentRequests,
    recentReviews,
    profile,
  });
});
