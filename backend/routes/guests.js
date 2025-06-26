const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

// ✅ POST /api/guests/add — Add new guest
router.post('/add', async (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const guest = new Guest({ name, email });
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    console.error('❌ Error saving guest:', err);
    res.status(500).json({ error: 'Failed to save guest' });
  }
});

module.exports = router;
