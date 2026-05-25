const SummaryHistory = require('../models/SummaryHistory');
const Analytics = require('../models/Analytics');
const aiProvider = require('../services/ai/aiProvider');
const mongoose = require('mongoose');

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const saveSummaryMetadata = async (content, summaryType, summaryLength, customInstruction, summaryResult) => {
  if (!isDatabaseConnected()) {
    console.warn('MongoDB is not connected. Skipping summary history and analytics save.');
    return;
  }

  const newSummary = new SummaryHistory({
    originalContent: content,
    summaryType,
    summaryLength,
    customInstruction,
    generatedSummary: summaryResult.generatedSummary,
    keywords: summaryResult.keywords,
    sentiment: summaryResult.sentiment,
    contentCategory: summaryResult.category,
    readingTime: summaryResult.readingTime
  });

  await newSummary.save();

  let analytics = await Analytics.findOne();
  if (!analytics) {
    analytics = new Analytics();
  }

  analytics.totalSummaries += 1;
  analytics.averageContentLength =
    ((analytics.averageContentLength * (analytics.totalSummaries - 1)) + content.length) / analytics.totalSummaries;

  const currentTypeCount = analytics.summaryTypeUsage.get(summaryType) || 0;
  analytics.summaryTypeUsage.set(summaryType, currentTypeCount + 1);

  const currentCategoryCount = analytics.categoryDistribution.get(summaryResult.category) || 0;
  analytics.categoryDistribution.set(summaryResult.category, currentCategoryCount + 1);

  await analytics.save();
};

const summarize = async (req, res, next) => {
  try {
    console.log('Summarize endpoint called with body:', req.body);
    const { content, summaryType, summaryLength, customInstruction } = req.body;

    if (!content || !summaryType || !summaryLength) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Call AI Provider
    const summaryResult = await aiProvider.summarizeContent(content, summaryType, summaryLength, customInstruction);

    try {
      await saveSummaryMetadata(content, summaryType, summaryLength, customInstruction, summaryResult);
    } catch (metadataError) {
      console.error('Summary generated, but metadata save failed:', metadataError.message);
    }

    res.status(200).json({
      success: true,
      summary: summaryResult
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(200).json({ success: true, history: [] });
    }

    const history = await SummaryHistory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ success: false, message: 'Database is not connected' });
    }

    const { id } = req.params;
    await SummaryHistory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalSummaries: 0,
          averageContentLength: 0,
          summaryTypeUsage: {},
          categoryDistribution: {}
        }
      });
    }

    let analytics = await Analytics.findOne();
    if (!analytics) {
      analytics = {
        totalSummaries: 0,
        averageContentLength: 0,
        summaryTypeUsage: {},
        categoryDistribution: {}
      };
    }
    res.status(200).json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  summarize,
  getHistory,
  deleteHistory,
  getAnalytics
};
