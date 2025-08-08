// server/controllers/quizController.js
const askGPT = require('../services/gptService');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const mongoose = require('mongoose');


exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const prompt = `
Generate 5 multiple-choice questions on "${topic}" for ${difficulty} level.
IMPORTANT: Return ONLY a valid JSON array with no additional text or formatting.
The JSON should have exactly this structure:
[
  {
    "question": "Question text here?",
    "choices": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0
  }
]

Generate exactly 5 questions for the topic "${topic}" at ${difficulty} level.
    `.trim();

    const jsonString = await askGPT(prompt);
    console.log('Raw quiz response:', jsonString);
    
    // Check if it's an error message from the AI service
    if (jsonString.includes('Error connecting to the AI service') || 
        jsonString.includes('Sorry, I couldn\'t generate a response')) {
      throw new Error('AI service temporarily unavailable');
    }
    
    // Clean the response - remove any markdown formatting or extra text
    let cleanedJson = jsonString.trim();
    
    // Remove markdown code blocks if present
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to extract JSON if there's extra text
    const jsonMatch = cleanedJson.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[0];
    }
    
    console.log('Cleaned quiz JSON:', cleanedJson);
    
    const questions = JSON.parse(cleanedJson);
    
    // Validate the structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid quiz structure');
    }

    // Save to DB
    const quiz = await Quiz.create({ topic, questions });
    res.json({ quizId: quiz._id, questions });
  } catch (err) {
    console.error('Quiz generation error:', err);
    
    // Fallback with sample questions
    const fallbackQuestions = [
      {
        question: `What is a key concept in ${req.body.topic || 'this subject'}?`,
        choices: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0
      },
      {
        question: `Which statement about ${req.body.topic || 'this topic'} is correct?`,
        choices: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"],
        correctIndex: 1
      }
    ];
    
    try {
      const quiz = await Quiz.create({ topic: req.body.topic || 'General', questions: fallbackQuestions });
      res.json({ quizId: quiz._id, questions: fallbackQuestions });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { quizId, user, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });

    const attempt = await QuizAttempt.create({ quiz: quizId, user, answers, score });
    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    console.error('Quiz attempt error:', err);
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
};
