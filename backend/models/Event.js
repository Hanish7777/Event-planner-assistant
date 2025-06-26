const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventType: String,
  selectedTheme: String,
  guestCount: Number,
  timeline: [{ milestone: String, daysBefore: Number }],
  budget: [{ category: String, amount: Number }],
  invitation: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
