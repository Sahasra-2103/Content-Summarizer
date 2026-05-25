const grokService = require('./grokService');

const summarizeContent = async (content, summaryType, summaryLength, customInstruction) => {
  const provider = process.env.AI_PROVIDER || 'grok';

  switch (provider.toLowerCase()) {
    case 'grok':
      return await grokService.summarizeContent(content, summaryType, summaryLength, customInstruction);
    case 'gemini':
      // To be implemented
      throw new Error('Gemini provider is not yet implemented.');
    case 'claude':
      // To be implemented
      throw new Error('Claude provider is not yet implemented.');
    default:
      return await grokService.summarizeContent(content, summaryType, summaryLength, customInstruction);
  }
};

module.exports = {
  summarizeContent
};
