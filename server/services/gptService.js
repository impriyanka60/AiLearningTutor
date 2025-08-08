const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askGPT = async (prompt) => {
  try {
    // Get the generative model (using gemini-1.5-flash for better availability)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
      return text;
    } else {
      console.error("Empty response from Gemini API");
      return "Sorry, I couldn't generate a response.";
    }
  } catch (error) {
    console.error("Error in askGPT (Gemini):", error.message);
    return "Error connecting to the AI service.";
  }
};

module.exports = askGPT; // Updated to use Google Gemini API