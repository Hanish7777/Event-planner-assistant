const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

router.get('/accept/:token', async (req, res) => {
  const guest = await Guest.findOne({ token: req.params.token });
  if (guest) {
    guest.rsvp = 'Accepted';
    await guest.save();
    return res.send("Thank you for accepting!");
  }
  res.status(404).send("Invalid token.");
});

router.get('/decline/:token', async (req, res) => {
  const guest = await Guest.findOne({ token: req.params.token });
  if (guest) {
    guest.rsvp = 'Declined';
    await guest.save();
    return res.send("Sorry to hear you can't make it.");
  }
  res.status(404).send("Invalid token.");
});

module.exports = router;
