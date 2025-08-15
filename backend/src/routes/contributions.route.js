const { Router } = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { addContribution, listContributions } = require('../controllers/contributions.controller');
const { validateRequest } = require('../middleware/validateRequest');

const router = Router();

/**
 * @openapi
 * /api/contributions:
 *   post:
 *     summary: Add a contribution to a goal
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [goalId, amount]
 *             properties:
 *               goalId: { type: string }
 *               amount: { type: number }
 *     responses:
 *       201:
 *         description: Contribution added
 */
router.post(
  '/',
  requireAuth,
  [
    body('goalId').isMongoId(),
    body('amount').isFloat({ min: 0 }),
  ],
  validateRequest,
  addContribution
);

/**
 * @openapi
 * /api/contributions/{goalId}:
 *   get:
 *     summary: List contributions for a goal
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of contributions
 */
router.get('/:goalId', requireAuth, listContributions);

module.exports = router;