const generateSystemPrompt = () => {
  return "You are an expert AI content summarization assistant. Analyze the provided content carefully and generate summaries according to the user's selected format and length. Maintain accuracy, preserve important information, avoid hallucinations, and return well-structured output. You MUST ALWAYS return ONLY a valid JSON object matching this schema: {\"generatedSummary\": \"The summarized text\", \"keywords\": [\"keyword1\", \"keyword2\"], \"sentiment\": \"Positive/Negative/Neutral\", \"category\": \"Technology/Business/Education/News/Health/Research/Finance/Entertainment\", \"readingTime\": \"Number representing minutes to read\"}. Do not output markdown code blocks or any other text.";
};

const generateUserPrompt = (content, summaryType, summaryLength, customInstruction) => {
  let prompt = `Please summarize the following content.\n\n`;
  prompt += `Content: ${content}\n\n`;
  prompt += `Format Required: ${summaryType}\n`;
  
  // Enforce specific formatting based on the type
  prompt += `IMPORTANT FORMATTING INSTRUCTIONS for ${summaryType}:\n`;
  if (summaryType.toLowerCase().includes('bullet points')) {
    prompt += `- Use bullet points (•) for each key item.\n- Keep each point concise.\n`;
  } else if (summaryType.toLowerCase().includes('action items')) {
    prompt += `- Provide a checklist format (e.g., "[ ] Task") or numbered list.\n- Focus only on actionable tasks.\n`;
  } else if (summaryType.toLowerCase().includes('study notes')) {
    prompt += `- Organize with clear headings, definitions, and key concepts.\n- Use dashes (-) for sub-points.\n`;
  } else if (summaryType.toLowerCase().includes('simplified')) {
    prompt += `- Explain it simply as if to a 10-year-old.\n- Use very simple language and short paragraphs.\n`;
  } else if (summaryType.toLowerCase().includes('detailed')) {
    prompt += `- Provide comprehensive coverage with paragraphs and headers if necessary.\n`;
  }
  
  prompt += `Length constraint: ${summaryLength}\n`;
  
  if (customInstruction) {
    prompt += `Custom Instructions: ${customInstruction}\n`;
  }

  prompt += `\nRemember to return ONLY a JSON object. Ensure the text inside 'generatedSummary' uses proper newline characters (\\n) for formatting.`;
  return prompt;
};

module.exports = {
  generateSystemPrompt,
  generateUserPrompt
};
