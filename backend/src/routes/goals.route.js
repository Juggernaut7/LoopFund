const { Router } = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const {
  createGoalController,
  getUserGoalsController,
  getGoalByIdController,
  updateGoalController,
  deleteGoalController
} = require('../controllers/goals.controller');
const { validateRequest } = require('../middleware/validateRequest');

const router = Router();

/**
 * @openapi
 * /api/goals:
 *   post:
 *     summary: Create a new savings goal
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, targetAmount, endDate, frequency, amount]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               targetAmount: { type: number }
 *               endDate: { type: string, format: date-time }
 *               groupId: { type: string }
 *               frequency: { type: string, enum: [daily, weekly, monthly, custom] }
 *               amount: { type: number }
 *               customDates: { type: array, items: { type: string, format: date-time } }
 *     responses:
 *       201:
 *         description: Goal created
 */
router.post(
  '/',
  requireAuth,
  [
    body('name').isString().isLength({ min: 2 }),
    body('description').optional().isString(),
    body('targetAmount').isFloat({ min: 0 }),
    body('endDate').isISO8601().toDate(),
    body('groupId').optional().isMongoId(),
    body('frequency').isIn(['daily', 'weekly', 'monthly', 'custom']),
    body('amount').isFloat({ min: 0 }),
    body('customDates').optional().isArray(),
    body('customDates.*').optional().isISO8601().toDate(),
  ],
  validateRequest,
  createGoalController
);

/**
 * @openapi
 * /api/goals:
 *   get:
 *     summary: List goals for current user
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get('/', requireAuth, getUserGoalsController);

/**
 * @openapi
 * /api/goals/{id}:
 *   get:
 *     summary: Get a specific goal
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal details
 */
router.get('/:goalId', requireAuth, getGoalByIdController);

/**
 * @openapi
 * /api/goals/{id}:
 *   put:
 *     summary: Update a specific goal
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               targetAmount: { type: number }
 *               endDate: { type: string, format: date-time }
 *               groupId: { type: string }
 *               frequency: { type: string, enum: [daily, weekly, monthly, custom] }
 *               amount: { type: number }
 *               customDates: { type: array, items: { type: string, format: date-time } }
 *     responses:
 *       200:
 *         description: Goal updated
 */
router.put('/:goalId', requireAuth, updateGoalController);

/**
 * @openapi
 * /api/goals/{id}:
 *   delete:
 *     summary: Delete a specific goal
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted
 */
router.delete('/:goalId', requireAuth, deleteGoalController);

module.exports = router;