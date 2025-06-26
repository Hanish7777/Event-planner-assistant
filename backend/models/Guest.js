const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  rsvp: { type: String, enum: ['Yes', 'No', 'Maybe'], default: 'Maybe' }
});

module.exports = mongoose.model('Guest', guestSchema);
