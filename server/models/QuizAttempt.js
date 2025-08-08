// server/models/QuizAttempt.js
const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  user: String,          // or ObjectId if you have User model
  answers: [Number],     // indices of chosen answers
  score: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', attemptSchema);
