const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { catchAsync } = require('../middleware/errorHandler');
const { sendEmail, templates } = require('../utils/emailTemplates');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

const sendTokenResponse = (user, workerProfile, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city,
      profilePhoto: user.profilePhoto,
      ...(workerProfile && { workerProfile }),
    },
  });
};

exports.register = catchAsync(async (req, res) => {
  const { name, email, phone, password, role, city, profession, hourlyRate, experience, skills, bio } = req.body;

  // Validation
  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, phone, password and role.' });
  }
  if (!['customer', 'worker'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role must be customer or worker.' });
  }
  if (role === 'worker' && (!profession || !hourlyRate)) {
    return res.status(400).json({ success: false, message: 'Workers must provide profession and hourly rate.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ success: false, message: 'An account with this email already exists.' });

  const user = await User.create({ name, email, phone, password, role, city });

  let workerProfile = null;
  if (role === 'worker') {
    workerProfile = await WorkerProfile.create({
      userId: user._id,
      profession,
      hourlyRate: Number(hourlyRate),
      experience: experience ? Number(experience) : 0,
      skills: skills || [],
      bio: bio || '',
    });
    sendEmail(user.email, templates.welcomeWorker(user.name, profession)).catch(() => {});
  } else {
    sendEmail(user.email, templates.welcomeCustomer(user.name)).catch(() => {});
  }

  sendTokenResponse(user, workerProfile, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
  }

  let workerProfile = null;
  if (user.role === 'worker') {
    workerProfile = await WorkerProfile.findOne({ userId: user._id });
  }

  sendTokenResponse(user, workerProfile, 200, res);
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  let workerProfile = null;
  if (user.role === 'worker') {
    workerProfile = await WorkerProfile.findOne({ userId: user._id });
  }
  res.json({ success: true, user, workerProfile });
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, null, 200, res);
});
