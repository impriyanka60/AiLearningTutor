// server/models/StudySession.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: String,
  level: String,
  timestamp: { type: Date, default: Date.now },
  success: Boolean,    // e.g. quiz passed / code explained
});

module.exports = mongoose.model('StudySession', sessionSchema);
