const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  totalSummaries: {
    type: Number,
    default: 0
  },
  averageContentLength: {
    type: Number,
    default: 0
  },
  summaryTypeUsage: {
    type: Map,
    of: Number,
    default: {}
  },
  categoryDistribution: {
    type: Map,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
