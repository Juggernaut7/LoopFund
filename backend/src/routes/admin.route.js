const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { getAllGoals, getAllContributions, getAllUsers } = require('../controllers/admin.controller');

const router = Router();

/**
 * @openapi
 * /api/admin/goals:
 *   get:
 *     summary: Get all goals (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all goals
 */
router.get('/goals', requireAuth, requireAdmin, getAllGoals);

/**
 * @openapi
 * /api/admin/contributions:
 *   get:
 *     summary: Get all contributions (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all contributions
 */
router.get('/contributions', requireAuth, requireAdmin, getAllContributions);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', requireAuth, requireAdmin, getAllUsers);

module.exports = router; 