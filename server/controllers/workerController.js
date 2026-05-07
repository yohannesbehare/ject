const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Review = require('../models/Review');
const { catchAsync } = require('../middleware/errorHandler');
const { uploadProfilePhoto, uploadWorkSample } = require('../utils/cloudinary');

// GET /api/workers — Public search & filter
exports.getWorkers = catchAsync(async (req, res) => {
  const { profession, city, minRating, maxRate, minRate, sortBy, available, page = 1, limit = 12 } = req.query;

  const profileFilter = { isApproved: true };
  if (profession) profileFilter.profession = profession;
  if (available === 'true') profileFilter.isAvailable = true;
  if (maxRate) profileFilter.hourlyRate = { ...profileFilter.hourlyRate, $lte: Number(maxRate) };
  if (minRate) profileFilter.hourlyRate = { ...profileFilter.hourlyRate, $gte: Number(minRate) };
  if (minRating) profileFilter.averageRating = { $gte: Number(minRating) };

  let sortOption = {};
  switch (sortBy) {
    case 'rate-low': sortOption = { hourlyRate: 1 }; break;
    case 'rate-high': sortOption = { hourlyRate: -1 }; break;
    case 'exp': sortOption = { experience: -1 }; break;
    case 'views': sortOption = { totalViews: -1 }; break;
    default: sortOption = { averageRating: -1, totalReviews: -1 };
  }

  const skip = (Number(page) - 1) * Number(limit);
  let profiles = await WorkerProfile.find(profileFilter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Filter by city if provided (on user model)
  const userIds = profiles.map((p) => p.userId);
  const userFilter = { _id: { $in: userIds } };
  if (city) userFilter.city = { $regex: city, $options: 'i' };

  const users = await User.find(userFilter).select('name email city profilePhoto').lean();
  const userMap = {};
  users.forEach((u) => { userMap[u._id.toString()] = u; });

  const results = profiles
    .filter((p) => userMap[p.userId.toString()])
    .map((p) => ({ ...p, user: userMap[p.userId.toString()] }));

  const total = await WorkerProfile.countDocuments(profileFilter);

  res.json({ success: true, results, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// GET /api/workers/:id — Public single profile
exports.getWorker = catchAsync(async (req, res) => {
  const profile = await WorkerProfile.findById(req.params.id).lean();
  if (!profile) return res.status(404).json({ success: false, message: 'Worker not found.' });

  const user = await User.findById(profile.userId).select('name email phone city profilePhoto createdAt').lean();
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  const reviews = await Review.find({ workerId: profile.userId })
    .populate('customerId', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  res.json({ success: true, worker: { ...profile, user }, reviews });
});

// POST /api/workers/:id/view — Increment view count
exports.incrementView = catchAsync(async (req, res) => {
  await WorkerProfile.findByIdAndUpdate(req.params.id, { $inc: { totalViews: 1 } });
  res.json({ success: true });
});

// PATCH /api/workers/profile — Protected: update own profile
exports.updateProfile = catchAsync(async (req, res) => {
  const { profession, hourlyRate, experience, skills, bio, name, phone, city } = req.body;

  // Update user fields
  const userUpdates = {};
  if (name) userUpdates.name = name;
  if (phone) userUpdates.phone = phone;
  if (city) userUpdates.city = city;
  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(req.user._id, userUpdates);
  }

  // Update worker profile
  const profileUpdates = {};
  if (profession) profileUpdates.profession = profession;
  if (hourlyRate !== undefined) profileUpdates.hourlyRate = Number(hourlyRate);
  if (experience !== undefined) profileUpdates.experience = Number(experience);
  if (skills) profileUpdates.skills = Array.isArray(skills) ? skills.slice(0, 10) : [];
  if (bio !== undefined) profileUpdates.bio = bio;

  const profile = await WorkerProfile.findOneAndUpdate(
    { userId: req.user._id },
    profileUpdates,
    { new: true, runValidators: true }
  );

  if (!profile) return res.status(404).json({ success: false, message: 'Worker profile not found.' });

  res.json({ success: true, profile });
});

// PATCH /api/workers/availability
exports.toggleAvailability = catchAsync(async (req, res) => {
  const { isAvailable } = req.body;
  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ success: false, message: 'isAvailable must be a boolean.' });
  }
  const profile = await WorkerProfile.findOneAndUpdate(
    { userId: req.user._id },
    { isAvailable },
    { new: true }
  );
  res.json({ success: true, isAvailable: profile.isAvailable });
});

// POST /api/workers/upload-photo
exports.uploadPhoto = catchAsync(async (req, res) => {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ success: false, message: 'No image data provided.' });

  const url = await uploadProfilePhoto(imageData, req.user._id.toString());
  await User.findByIdAndUpdate(req.user._id, { profilePhoto: url });
  res.json({ success: true, url });
});

// POST /api/workers/upload-sample
exports.uploadSample = catchAsync(async (req, res) => {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ success: false, message: 'No image data provided.' });

  const profile = await WorkerProfile.findOne({ userId: req.user._id });
  if (!profile) return res.status(404).json({ success: false, message: 'Worker profile not found.' });
  if (profile.workSamples.length >= 6) {
    return res.status(400).json({ success: false, message: 'Maximum 6 work samples allowed.' });
  }

  const index = profile.workSamples.length;
  const url = await uploadWorkSample(imageData, req.user._id.toString(), index);
  profile.workSamples.push(url);
  await profile.save();

  res.json({ success: true, workSamples: profile.workSamples });
});

// DELETE /api/workers/sample/:index
exports.deleteSample = catchAsync(async (req, res) => {
  const { index } = req.params;
  const profile = await WorkerProfile.findOne({ userId: req.user._id });
  if (!profile) return res.status(404).json({ success: false, message: 'Worker profile not found.' });

  profile.workSamples.splice(Number(index), 1);
  await profile.save();
  res.json({ success: true, workSamples: profile.workSamples });
});
