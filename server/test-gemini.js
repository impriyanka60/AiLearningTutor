// Quick test script to verify Gemini API integration
const askGPT = require('./services/gptService');

async function testGemini() {
  console.log('Testing Gemini API integration...');
  
  try {
    const response = await askGPT('Hello! Can you tell me what 2+2 equals?');
    console.log('✅ Gemini API Response:', response);
    console.log('✅ Test successful! Gemini is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGemini();
