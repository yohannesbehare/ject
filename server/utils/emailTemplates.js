const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f8f5; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #1a3faa, #3b5fd6); padding: 28px 32px; }
    .logo { color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .logo span { color: #fbbf24; }
    .body { padding: 32px; }
    .body h2 { font-size: 20px; color: #111827; margin: 0 0 12px; }
    .body p { font-size: 14px; color: #4b5563; line-height: 1.7; margin: 0 0 12px; }
    .btn { display: inline-block; background: #1a3faa; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 16px 0; }
    .info-box { background: #f0f5ff; border: 1px solid #c7d7f9; border-radius: 10px; padding: 16px 20px; margin: 16px 0; font-size: 13px; color: #1e40af; }
    .info-row { display: flex; margin-bottom: 6px; }
    .info-label { font-weight: 600; min-width: 120px; }
    .urgency-high { color: #dc2626; font-weight: 600; }
    .urgency-medium { color: #d97706; font-weight: 600; }
    .urgency-low { color: #059669; font-weight: 600; }
    .footer { background: #f3f4f6; padding: 20px 32px; font-size: 12px; color: #9ca3af; text-align: center; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Task<span>R</span></div>
      <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px">Ethiopia's Skilled Worker Marketplace</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} TaskR. All rights reserved.</p>
      <p>This email was sent because of activity on your TaskR account.</p>
    </div>
  </div>
</body>
</html>`;

const templates = {
  newContactRequest: (workerName, contactData) => ({
    subject: `New Job Request from ${contactData.customerName} — TaskR`,
    html: baseTemplate(`
      <h2>You have a new job request! 🎉</h2>
      <p>Hi <strong>${workerName}</strong>, someone wants to hire you on TaskR.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Customer:</span> ${contactData.customerName}</div>
        <div class="info-row"><span class="info-label">Phone:</span> ${contactData.customerPhone}</div>
        <div class="info-row"><span class="info-label">Job:</span> ${contactData.jobDescription}</div>
        <div class="info-row"><span class="info-label">Preferred Date:</span> ${contactData.preferredDate || 'Flexible'}</div>
        <div class="info-row"><span class="info-label">Urgency:</span> <span class="urgency-${contactData.urgency}">${contactData.urgency.toUpperCase()}</span></div>
      </div>
      <p>Log in to your TaskR dashboard to accept or decline this request.</p>
      <a href="${process.env.CLIENT_URL}/worker/dashboard" class="btn">View Request →</a>
    `),
  }),

  requestStatusUpdate: (customerName, workerName, status) => ({
    subject: `Your request to ${workerName} has been ${status} — TaskR`,
    html: baseTemplate(`
      <h2>Request ${status === 'accepted' ? 'Accepted ✅' : 'Update 📬'}</h2>
      <p>Hi <strong>${customerName}</strong>,</p>
      <p>Your job request to <strong>${workerName}</strong> has been <strong>${status}</strong>.</p>
      ${status === 'accepted' ? `<p>Great news! The worker will contact you shortly to discuss the details. You can also reach them directly through your dashboard.</p>` : `<p>Don't worry — there are hundreds of other skilled workers on TaskR. Browse and find another professional.</p>`}
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">View Dashboard →</a>
    `),
  }),

  leaveReview: (customerName, workerName, contactRequestId) => ({
    subject: `How was your experience with ${workerName}? — TaskR`,
    html: baseTemplate(`
      <h2>Job Completed! How did it go? ⭐</h2>
      <p>Hi <strong>${customerName}</strong>,</p>
      <p>Your job with <strong>${workerName}</strong> has been marked as completed. We'd love to hear about your experience!</p>
      <p>Your review helps other customers make informed decisions and rewards great workers for their hard work.</p>
      <a href="${process.env.CLIENT_URL}/review/${contactRequestId}" class="btn">Leave a Review →</a>
      <hr class="divider" />
      <p style="font-size:12px;color:#9ca3af;">This link will expire in 30 days. You only need to review once.</p>
    `),
  }),

  welcomeCustomer: (name) => ({
    subject: `Welcome to TaskR, ${name}! 👋`,
    html: baseTemplate(`
      <h2>Welcome to TaskR! 🎉</h2>
      <p>Hi <strong>${name}</strong>, your account is ready.</p>
      <p>You can now browse hundreds of verified skilled workers — plumbers, electricians, painters, carpenters, drivers and more — all across Ethiopia.</p>
      <a href="${process.env.CLIENT_URL}/search" class="btn">Find a Worker Now →</a>
    `),
  }),

  welcomeWorker: (name, profession) => ({
    subject: `Welcome to TaskR, ${name}! Start getting clients today 🔧`,
    html: baseTemplate(`
      <h2>Your TaskR Profile is Live! 🚀</h2>
      <p>Hi <strong>${name}</strong>, welcome to TaskR!</p>
      <p>Your profile as a <strong>${profession}</strong> is now active and visible to customers across Ethiopia.</p>
      <p><strong>Tips to get more clients:</strong></p>
      <ul style="font-size:14px;color:#4b5563;line-height:1.9;padding-left:20px;">
        <li>Add a professional profile photo</li>
        <li>Upload photos of your best work (up to 6)</li>
        <li>Write a detailed bio describing your experience</li>
        <li>Keep your availability status up to date</li>
        <li>Respond to requests quickly</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/worker/dashboard" class="btn">Complete Your Profile →</a>
    `),
  }),
};

const sendEmail = async (to, template) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

module.exports = { sendEmail, templates };
