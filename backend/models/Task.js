const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  description: String,
  isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', taskSchema);
