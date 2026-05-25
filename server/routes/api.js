const express = require('express');
const router = express.Router();
const { summarize, getHistory, deleteHistory, getAnalytics } = require('../controllers/summaryController');

router.post('/summarize', summarize);
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistory);
router.get('/analytics', getAnalytics);

module.exports = router;
