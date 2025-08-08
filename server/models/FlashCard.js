// server/models/Flashcard.js
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  topic: String,
  date: { type: Date, default: Date.now },
  cards: [
    {
      question: String,
      answer: String,
    }
  ]
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
