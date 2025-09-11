const { Router } = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { 
  createGroup: createGroupController, 
  joinGroup: joinGroupController, 
  listGroups: listGroupsController,
  deleteGroup: deleteGroupController,
  getGroupDetails: getGroupDetailsController,
  addGroupContribution: addGroupContributionController,
  getGroupContributions: getGroupContributionsController
} = require('../controllers/groups.controller');
const { validateRequest } = require('../middleware/validateRequest');

const router = Router();

/**
 * @openapi
 * /api/groups:
 *   get:
 *     summary: List groups for current user
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/', requireAuth, listGroupsController);

/**
 * @openapi
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               targetAmount: { type: number }
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  requireAuth,
  [
    body('name').isString().isLength({ min: 2 }),
    body('description').optional().isString(),
    body('targetAmount').optional().isFloat({ min: 0 }),
  ],
  validateRequest,
  createGroupController
);

/**
 * @openapi
 * /api/groups/join:
 *   post:
 *     summary: Join a group via invite code
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inviteCode]
 *             properties:
 *               inviteCode: { type: string }
 *     responses:
 *       200:
 *         description: Joined group
 */
router.post(
  '/join',
  requireAuth,
  [body('inviteCode').isString().isLength({ min: 10, max: 20 })],
  validateRequest,
  joinGroupController
);

/**
 * @openapi
 * /api/groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       403:
 *         description: Not authorized to delete group
 *       404:
 *         description: Group not found
 */
router.delete('/:groupId', requireAuth, deleteGroupController);

/**
 * @openapi
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get group details
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details retrieved successfully
 *       404:
 *         description: Group not found
 */
router.get('/:groupId', requireAuth, getGroupDetailsController);

/**
 * @openapi
 * /api/groups/{groupId}/contributions:
 *   get:
 *     summary: Get group contributions
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group contributions retrieved successfully
 *       404:
 *         description: Group not found
 */
router.get('/:groupId/contributions', requireAuth, getGroupContributionsController);

/**
 * @openapi
 * /api/groups/{groupId}/contributions:
 *   post:
 *     summary: Add contribution to group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number }
 *               method: { type: string, enum: ['bank_transfer', 'card_payment', 'cash', 'other'] }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Contribution added successfully
 *       400:
 *         description: Invalid contribution data
 *       403:
 *         description: Not authorized to contribute to this group
 *       404:
 *         description: Group not found
 */
router.post('/:groupId/contributions', requireAuth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('method').optional().isIn(['bank_transfer', 'card_payment', 'cash', 'other']).withMessage('Invalid payment method'),
  body('description').optional().isString().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], validateRequest, addGroupContributionController);

module.exports = router;