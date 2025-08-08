// server/routes/quizRoutes.js
const express = require('express');
const { generateQuiz, submitAttempt } = require('../controllers/quizController');
const router = express.Router();

router.post('/generate', generateQuiz);
router.post('/submit', submitAttempt);

module.exports = router;
