const askGPT = require('../services/gptService');
const runOCR = require('../services/ocrService');

exports.askQuestion = async (req, res) => {
  try {
    const { question, level } = req.body;
    const prompt = `You are a helpful tutor. Explain this to a ${level} student:\n${question}`;
    const answer = await askGPT(prompt);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get answer from GPT' });
  }
};
exports.processImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const image = req.files.image;
    const text = await runOCR(image);
    const answer = await askGPT("Solve this: " + text);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Image processing failed' });
  }
};
exports.explainCode = async (req, res) => {
  try {
    const { code, level } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const prompt = `Explain this ${level || 'beginner'}-level code step by step:\n\n${code}`;
    const explanation = await askGPT(prompt);
    res.json({ explanation });
  } catch (err) {
    console.error('Code explain error:', err);
    res.status(500).json({ error: 'Failed to explain code' });
  }
};
exports.generateConceptMap = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Missing topic' });

    // Improved prompt for Gemini to ensure proper JSON format
    const prompt = `
Generate a concept map for the topic "${topic}". 
IMPORTANT: Return ONLY a valid JSON object with no additional text or formatting.
The JSON should have exactly this structure:
{
  "nodes": [
    {"id": "1", "label": "Main Concept"},
    {"id": "2", "label": "Sub Concept 1"},
    {"id": "3", "label": "Sub Concept 2"}
  ],
  "links": [
    {"source": "1", "target": "2"},
    {"source": "1", "target": "3"}
  ]
}

Generate at least 5-8 nodes with appropriate connections for the topic "${topic}".
`;

    const jsonString = await askGPT(prompt);
    console.log('Raw Gemini response:', jsonString);
    
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
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[0];
    }
    
    console.log('Cleaned JSON:', cleanedJson);
    
    // Try to parse the JSON output
    const conceptMap = JSON.parse(cleanedJson);
    
    // Validate the structure
    if (!conceptMap.nodes || !conceptMap.links || !Array.isArray(conceptMap.nodes) || !Array.isArray(conceptMap.links)) {
      throw new Error('Invalid concept map structure');
    }
    
    res.json(conceptMap);
  } catch (err) {
    console.error('Concept map error:', err.message);
    console.error('Full error:', err);
    
    // Fallback response with a basic concept map
    const fallbackMap = {
      nodes: [
        { id: "1", label: topic || "Main Topic" },
        { id: "2", label: "Definition" },
        { id: "3", label: "Examples" },
        { id: "4", label: "Applications" }
      ],
      links: [
        { source: "1", target: "2" },
        { source: "1", target: "3" },
        { source: "1", target: "4" }
      ]
    };
    
    res.json(fallbackMap);
  }
};