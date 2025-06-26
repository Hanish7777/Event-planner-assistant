const express = require('express');
const router = express.Router();
require('dotenv').config();

const sendMail = require('../utils/mailer');
const Guest = require('../models/Guest'); // ✅ import your Guest model

// POST /api/mail/send
router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing fields: to, subject, or text' });
  }

  console.log(`📧 Sending email to ${to}...`);
  const result = await sendMail({ to, subject, text });

  if (result.success) {
    res.json({ message: 'Email sent successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

router.post('/send-invitations', async (req, res) => {
  const { subject, text } = req.body;

  try {
    // ✅ Get guest emails from DB
    const guests = await Guest.find({ email: { $ne: null } });

    if (guests.length === 0) {
      return res.status(200).json({ message: 'No guests found to send invitations.' });
    }

    let successCount = 0;

    for (const guest of guests) {
      const to = guest.email;
      const personalizedText = text.replace('[Name]', guest.name || 'Guest');

      const result = await sendMail({ to, subject, text: personalizedText });
      if (result.success) successCount++;
    }

    res.json({ message: `Invitations sent to ${successCount} guest(s).` });
  } catch (error) {
    console.error('Error sending to all guests:', error);
    res.status(500).json({ error: 'Failed to send invitations to guests.' });
  }
});


module.exports = router;
