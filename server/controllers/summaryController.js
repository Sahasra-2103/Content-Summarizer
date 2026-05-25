const SummaryHistory = require('../models/SummaryHistory');
const Analytics = require('../models/Analytics');
const aiProvider = require('../services/ai/aiProvider');

const summarize = async (req, res, next) => {
  try {
    console.log('Summarize endpoint called with body:', req.body);
    const { content, summaryType, summaryLength, customInstruction } = req.body;

    if (!content || !summaryType || !summaryLength) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Call AI Provider
    const summaryResult = await aiProvider.summarizeContent(content, summaryType, summaryLength, customInstruction);

    // Save to Database
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

    // Update Analytics
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
    const history = await SummaryHistory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await SummaryHistory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
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
