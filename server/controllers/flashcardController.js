// server/controllers/flashcardController.js
const askGPT = require('../services/gptService');
const Flashcard = require('../models/FlashCard');
const mongoose = require('mongoose');


exports.generateFlashcards = async (req, res) => {
  try {
    const { notes, topic } = req.body;
    console.log('Flashcard request received:', { notes: !!notes, topic: !!topic, notesLength: notes?.length, topicLength: topic?.length });
    console.log('Raw notes:', JSON.stringify(notes));
    console.log('Raw topic:', JSON.stringify(topic));
    
    if (!notes && !topic) {
      console.log('❌ Validation failed: both notes and topic are empty');
      return res.status(400).json({ error: 'Please provide either notes or a topic' });
    }
    
    console.log('✅ Validation passed, generating flashcards...');

    let prompt = '';
    
    if (notes && topic) {
      // Both notes and topic provided
      prompt = `
You are an AI that creates study flashcards. Given the following notes about "${topic}", generate 5 flashcards.
IMPORTANT: Return ONLY a valid JSON array with no additional text or formatting.
The JSON should have exactly this structure:
[
  {"question": "Question text here?", "answer": "Answer text here"},
  {"question": "Another question?", "answer": "Another answer"}
]

Topic: ${topic}
Notes: ${notes}
Generate exactly 5 flashcards based on these notes about ${topic}.
`;
    } else if (notes) {
      // Only notes provided
      prompt = `
You are an AI that creates study flashcards. Given the following notes, generate 5 flashcards.
IMPORTANT: Return ONLY a valid JSON array with no additional text or formatting.
The JSON should have exactly this structure:
[
  {"question": "Question text here?", "answer": "Answer text here"},
  {"question": "Another question?", "answer": "Another answer"}
]

Generate exactly 5 flashcards based on these notes:
${notes}
`;
    } else if (topic) {
      // Only topic provided
      prompt = `
You are an AI that creates study flashcards. Generate 5 educational flashcards about "${topic}".
IMPORTANT: Return ONLY a valid JSON array with no additional text or formatting.
The JSON should have exactly this structure:
[
  {"question": "Question text here?", "answer": "Answer text here"},
  {"question": "Another question?", "answer": "Another answer"}
]

Generate exactly 5 flashcards covering key concepts, definitions, and important facts about: ${topic}
`;
    }

    const jsonString = await askGPT(prompt);
    console.log('Raw flashcard response:', jsonString);
    
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
    
    console.log('Cleaned flashcard JSON:', cleanedJson);
    
    const cards = JSON.parse(cleanedJson);
    
    // Validate the structure
    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('Invalid flashcard structure');
    }

    // Optionally save to DB
    const doc = await Flashcard.create({ topic, cards });
    res.json({ flashcardId: doc._id, cards });
  } catch (err) {
    console.error('Flashcard generation error:', err.message);
    console.error('Error details:', err);
    
    // Check if it's a Gemini API issue
    if (err.message.includes('AI service temporarily unavailable')) {
      console.log('🔄 Gemini API temporarily unavailable, using enhanced fallback');
    } else {
      console.log('🔄 Other error occurred, using enhanced fallback');
    }
    
    // Fallback with sample flashcards
    const fallbackCards = [
      {
        question: `What is ${req.body.topic || 'this subject'}?`,
        answer: `${req.body.topic || 'This subject'} is a programming language/concept that...`
      },
      {
        question: `What are the key features of ${req.body.topic || 'this topic'}?`,
        answer: `Key features include...`
      },
      {
        question: `How is ${req.body.topic || 'this topic'} used in practice?`,
        answer: `It is commonly used for...`
      },
      {
        question: `What should beginners know about ${req.body.topic || 'this topic'}?`,
        answer: `Beginners should start by understanding...`
      },
      {
        question: `What are common applications of ${req.body.topic || 'this topic'}?`,
        answer: `Common applications include...`
      }
    ];
    
    try {
      const doc = await Flashcard.create({ topic: req.body.topic || 'General', cards: fallbackCards });
      res.json({ flashcardId: doc._id, cards: fallbackCards });
    } catch (dbError) {
      res.status(500).json({ error: 'Failed to generate flashcards' });
    }
  }
};
