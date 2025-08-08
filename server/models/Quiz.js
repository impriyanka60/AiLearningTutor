// server/models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  topic: String,
  date: { type: Date, default: Date.now },
  questions: [
    {
      question: String,
      choices: [String],
      correctIndex: Number
    }
  ]
});

module.exports = mongoose.model('Quiz', quizSchema);
