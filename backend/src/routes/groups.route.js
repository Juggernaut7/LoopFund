const { Router } = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const { createGroup: createGroupController, joinGroup: joinGroupController, listGroups: listGroupsController } = require('../controllers/groups.controller');
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
 *     summary: Join a group via invite link
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inviteLink]
 *             properties:
 *               inviteLink: { type: string }
 *     responses:
 *       200:
 *         description: Joined group
 */
router.post(
  '/join',
  requireAuth,
  [body('inviteLink').isString().isLength({ min: 10, max: 10 })],
  validateRequest,
  joinGroupController
);

module.exports = router;