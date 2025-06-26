const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
  const newEvent = await Event.create({ ...req.body, userId: req.user.id });
  res.json(newEvent);
});

router.get('/', auth, async (req, res) => {
  const events = await Event.find({ userId: req.user.id });
  res.json(events);
});

module.exports = router;
