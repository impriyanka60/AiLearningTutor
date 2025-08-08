const express = require('express');
const router = express.Router();

const { askQuestion, processImage, explainCode, generateConceptMap, } = require('../controllers/tutorController');

router.post('/ask', askQuestion);
router.post('/ocr', processImage);
router.post('/code-explain', explainCode);
router.post('/concept-map', generateConceptMap);

module.exports = router;
