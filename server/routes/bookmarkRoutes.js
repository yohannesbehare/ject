const express = require('express');
const router = express.Router();
const SavedWorker = require('../models/SavedWorker');
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');

// POST /api/bookmarks/:workerId — Toggle save
router.post('/:workerId', protect, restrictTo('customer'), catchAsync(async (req, res) => {
  const { workerId } = req.params;
  const existing = await SavedWorker.findOne({ customerId: req.user._id, workerId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, saved: false, message: 'Worker removed from bookmarks.' });
  }
  await SavedWorker.create({ customerId: req.user._id, workerId });
  res.json({ success: true, saved: true, message: 'Worker saved to bookmarks.' });
}));

// GET /api/bookmarks — Get all saved workers
router.get('/', protect, restrictTo('customer'), catchAsync(async (req, res) => {
  const saved = await SavedWorker.find({ customerId: req.user._id }).lean();
  const workerIds = saved.map((s) => s.workerId);

  const profiles = await WorkerProfile.find({ userId: { $in: workerIds } }).lean();
  const users = await User.find({ _id: { $in: workerIds } }).select('name profilePhoto city').lean();
  const userMap = {};
  users.forEach((u) => { userMap[u._id.toString()] = u; });

  const workers = profiles.map((p) => ({ ...p, user: userMap[p.userId.toString()] }));
  res.json({ success: true, workers });
}));

module.exports = router;
