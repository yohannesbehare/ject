const ContactRequest = require('../models/ContactRequest');
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorHandler');
const { sendEmail, templates } = require('../utils/emailTemplates');

// POST /api/contacts — Customer sends request
exports.createContact = catchAsync(async (req, res) => {
  const { workerId, customerName, customerPhone, jobDescription, preferredDate, urgency } = req.body;

  if (!workerId || !customerName || !customerPhone || !jobDescription) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const worker = await User.findById(workerId);
  if (!worker || worker.role !== 'worker') {
    return res.status(404).json({ success: false, message: 'Worker not found.' });
  }

  const workerProfile = await WorkerProfile.findOne({ userId: workerId });
  if (!workerProfile?.isAvailable) {
    return res.status(400).json({ success: false, message: 'This worker is currently unavailable.' });
  }

  const contact = await ContactRequest.create({
    customerId: req.user._id,
    workerId,
    customerName,
    customerPhone,
    jobDescription,
    preferredDate,
    urgency: urgency || 'low',
  });

  // Increment worker contacts count
  await WorkerProfile.findOneAndUpdate({ userId: workerId }, { $inc: { totalContacts: 1 } });

  // Email worker
  sendEmail(worker.email, templates.newContactRequest(worker.name, { customerName, customerPhone, jobDescription, preferredDate, urgency })).catch(() => {});

  res.status(201).json({ success: true, contact });
});

// GET /api/contacts/customer — Customer's own requests
exports.getCustomerContacts = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { customerId: req.user._id };
  if (status) filter.status = status;

  const contacts = await ContactRequest.find(filter)
    .populate('workerId', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const total = await ContactRequest.countDocuments(filter);
  res.json({ success: true, contacts, total });
});

// GET /api/contacts/worker — Worker's received requests
exports.getWorkerContacts = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { workerId: req.user._id };
  if (status) filter.status = status;

  const contacts = await ContactRequest.find(filter)
    .populate('customerId', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const total = await ContactRequest.countDocuments(filter);
  res.json({ success: true, contacts, total });
});

// PATCH /api/contacts/:id — Worker updates status
exports.updateContactStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'declined', 'completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }

  const contact = await ContactRequest.findById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact request not found.' });
  if (contact.workerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  contact.status = status;
  await contact.save();

  // Notify customer
  const customer = await User.findById(contact.customerId);
  const worker = await User.findById(contact.workerId);
  if (customer && worker) {
    sendEmail(customer.email, templates.requestStatusUpdate(customer.name, worker.name, status)).catch(() => {});
    // If completed, ask for review
    if (status === 'completed') {
      sendEmail(customer.email, templates.leaveReview(customer.name, worker.name, contact._id)).catch(() => {});
    }
  }

  res.json({ success: true, contact });
});
