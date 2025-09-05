const { Router } = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { 
  getAllGoals: getAllGoalsController, 
  getAllContributions: getAllContributionsController, 
  getAllUsers: getAllUsersController,
  getAdminDashboardStats: getAdminDashboardStatsController,
  getUserById: getUserByIdController,
  updateUser: updateUserController,
  deleteUser: deleteUserController,
  suspendUser: suspendUserController,
  activateUser: activateUserController,
  getUsersWithFilters: getUsersWithFiltersController,
  getRevenueAnalytics: getRevenueAnalyticsController,
  getSystemHealth: getSystemHealthController,
  getRevenueStats,
  getTransactions,
  getTransactionDetails
} = require('../controllers/admin.controller');

const router = Router();

/**
 * @openapi
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics
 */
router.get('/dashboard', requireAuth, requireAdmin, getAdminDashboardStatsController);

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
router.get('/goals', requireAuth, requireAdmin, getAllGoalsController);

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
router.get('/contributions', requireAuth, requireAdmin, getAllContributionsController);

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
router.get('/users', requireAuth, requireAdmin, getAllUsersController);

/**
 * @openapi
 * /api/admin/users/filter:
 *   get:
 *     summary: Get users with filters (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by user status
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Filtered list of users
 */
router.get('/users/filter', requireAuth, requireAdmin, getUsersWithFiltersController);

/**
 * @openapi
 * /api/admin/users/:userId:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/users/:userId', requireAuth, requireAdmin, getUserByIdController);

/**
 * @openapi
 * /api/admin/users/:userId:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *               role:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:userId', requireAuth, requireAdmin, updateUserController);

/**
 * @openapi
 * /api/admin/users/:userId:
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete user with existing data
 *       404:
 *         description: User not found
 */
router.delete('/users/:userId', requireAuth, requireAdmin, deleteUserController);

/**
 * @openapi
 * /api/admin/users/:userId/suspend:
 *   post:
 *     summary: Suspend user (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 */
router.post('/users/:userId/suspend', requireAuth, requireAdmin, suspendUserController);

/**
 * @openapi
 * /api/admin/users/:userId/activate:
 *   post:
 *     summary: Activate user (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated successfully
 *       404:
 *         description: User not found
 */
router.post('/users/:userId/activate', requireAuth, requireAdmin, activateUserController);

/**
 * @openapi
 * /api/admin/revenue:
 *   get:
 *     summary: Get revenue analytics (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *         description: Revenue period
 *     responses:
 *       200:
 *         description: Revenue analytics data
 */
router.get('/revenue', requireAuth, requireAdmin, getRevenueAnalyticsController);

/**
 * @openapi
 * /api/admin/system/health:
 *   get:
 *     summary: Get system health (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System health status
 */
router.get('/system/health', requireAuth, requireAdmin, getSystemHealthController);

/**
 * @openapi
 * /api/admin/revenue:
 *   get:
 *     summary: Get revenue statistics (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: string
 *         description: Number of days to look back (7, 30, 90, all)
 *     responses:
 *       200:
 *         description: Revenue statistics
 */
router.get('/revenue', requireAuth, requireAdmin, getRevenueStats);

/**
 * @openapi
 * /api/admin/transactions:
 *   get:
 *     summary: Get payment transactions (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: string
 *         description: Number of days to look back
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by payment type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', requireAuth, requireAdmin, getTransactions);

/**
 * @openapi
 * /api/admin/transactions/{id}:
 *   get:
 *     summary: Get transaction details (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 */
router.get('/transactions/:id', requireAuth, requireAdmin, getTransactionDetails);

module.exports = router; 