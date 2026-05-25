const mongoose = require('mongoose');

const SummaryHistorySchema = new mongoose.Schema({
  originalContent: {
    type: String,
    required: true
  },
  summaryType: {
    type: String,
    required: true
  },
  summaryLength: {
    type: String,
    required: true
  },
  customInstruction: {
    type: String,
    default: ''
  },
  generatedSummary: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    default: []
  },
  sentiment: {
    type: String,
    default: 'Neutral'
  },
  contentCategory: {
    type: String,
    default: 'Uncategorized'
  },
  readingTime: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SummaryHistory', SummaryHistorySchema);
