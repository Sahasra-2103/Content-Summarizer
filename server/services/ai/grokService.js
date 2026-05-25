const axios = require('axios');
const { generateSystemPrompt, generateUserPrompt } = require('./promptService');

const summarizeContent = async (content, summaryType, summaryLength, customInstruction) => {
  try {
    const apiKey = process.env.GROK_API_KEY;
    
    // Auto-detect if user accidentally provided a Groq key instead of Grok (xAI)
    const isGroqKey = apiKey && apiKey.startsWith('gsk_');
    const apiUrl = isGroqKey ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
    const model = isGroqKey ? 'llama-3.3-70b-versatile' : (process.env.GROK_MODEL || 'grok-beta');

    if (!apiKey) {
      throw new Error('GROK_API_KEY is missing');
    }

    const systemPrompt = generateSystemPrompt();
    const userPrompt = generateUserPrompt(content, summaryType, summaryLength, customInstruction);

    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const messageContent = response.data.choices[0].message.content;
    let result;
    try {
      result = JSON.parse(messageContent);
    } catch (parseError) {
      console.error('Error parsing JSON from Grok API:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    return {
      generatedSummary: result.generatedSummary || 'Could not generate summary.',
      keywords: result.keywords || [],
      sentiment: result.sentiment || 'Neutral',
      category: result.category || 'Uncategorized',
      readingTime: result.readingTime || Math.ceil(result.generatedSummary?.split(' ').length / 200) || 1
    };

  } catch (error) {
    console.error('Error calling Grok API:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      apiUrl: apiUrl,
      model: model,
      hasApiKey: !!apiKey
    });
    throw new Error('Failed to generate summary with AI Provider');
  }
};

module.exports = {
  summarizeContent
};
