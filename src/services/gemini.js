const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const getAIReview = async (code, language) => {
  try {
    const prompt = `Please review this ${language} code submission and provide:
    1. Code quality assessment
    2. Potential improvements
    3. Best practices followed
    4. Areas for improvement
    5. Overall rating out of 5
    
    Here's the code:
    ${JSON.stringify(code, null, 2)}
    
    Please format your response in a clear, structured way.`;

    console.log('GEMINI_API_KEY', GEMINI_API_KEY);
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting AI review:', error);
    throw new Error('Failed to get AI review');
  }
}; 