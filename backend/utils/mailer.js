// backend/utils/sendMail.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load env vars

// 🔐 Configure Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,             // SSL port for Gmail
  secure: true,          // Use TLS
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address
    pass: process.env.EMAIL_PASS,   // app password from Gmail
  },
  tls: {
    rejectUnauthorized: false // For self-signed certs (dev only)
  },
});

// ✅ Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter ready to send messages");
  }
});

// 📤 Email Sender Function
const sendMail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Event Assistant" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return { success: true, info };
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendMail;
