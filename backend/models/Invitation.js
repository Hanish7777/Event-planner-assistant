const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  host: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  template: {
    type: String,
    default: 'Formal',
  },
  eventType: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },

  // ✅ Guest details and status
  guestName: {
    type: String,
  },
  guestEmail: {
    type: String,
  },
  guestStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending',
  }

}, { timestamps: true });

module.exports = mongoose.model('Invitation', invitationSchema);
