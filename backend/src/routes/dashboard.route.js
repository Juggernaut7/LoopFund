const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboard.controller');

const router = Router();

// Get dashboard statistics
router.get('/stats', requireAuth, getDashboardStats);

module.exports = router; 