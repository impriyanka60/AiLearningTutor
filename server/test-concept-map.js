// Test what Gemini returns for concept map generation
const askGPT = require('./services/gptService');

async function testConceptMap() {
  console.log('Testing concept map generation...');
  
  const prompt = `
Generate a concept map for the topic "JavaScript". 
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

Generate at least 5-8 nodes with appropriate connections for the topic "JavaScript".
`;

  try {
    const response = await askGPT(prompt);
    console.log('Raw response:');
    console.log('='.repeat(50));
    console.log(response);
    console.log('='.repeat(50));
    
    // Try to parse it
    try {
      const parsed = JSON.parse(response);
      console.log('✅ Successfully parsed JSON:', parsed);
    } catch (parseError) {
      console.log('❌ JSON Parse Error:', parseError.message);
      console.log('Attempting to clean...');
      
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
        console.log('Cleaned JSON:', cleaned);
        try {
          const parsed = JSON.parse(cleaned);
          console.log('✅ Successfully parsed cleaned JSON:', parsed);
        } catch (cleanedError) {
          console.log('❌ Still failed to parse cleaned JSON:', cleanedError.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
}

testConceptMap();
