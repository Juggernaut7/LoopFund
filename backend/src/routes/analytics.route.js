const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const analyticsController = require('../controllers/analytics.controller');

const router = Router();

// Get user analytics
router.get('/user', requireAuth, analyticsController.getUserAnalytics);

// Get analytics summary (quick data)
router.get('/user/summary', requireAuth, analyticsController.getAnalyticsSummary);

// Get group analytics
router.get('/group/:groupId', requireAuth, analyticsController.getGroupAnalytics);

// Get system analytics (admin only)
router.get('/system', requireAuth, analyticsController.getSystemAnalytics);

// Export analytics data
router.get('/export', requireAuth, analyticsController.exportAnalytics);

module.exports = router;