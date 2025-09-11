const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const chatController = require('../controllers/chat.controller');
const { validateRequest } = require('../middleware/validateRequest');

// Send message to group
router.post('/groups/:groupId/messages', 
  requireAuth,
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    body('type')
      .optional()
      .isIn(['text', 'system', 'contribution', 'join', 'leave'])
      .withMessage('Invalid message type')
  ], 
  validateRequest, 
  chatController.sendMessage
);

// Get group messages
router.get('/groups/:groupId/messages', 
  requireAuth,
  chatController.getGroupMessages
);

// Edit message
router.put('/messages/:messageId', 
  requireAuth,
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters')
  ], 
  validateRequest, 
  chatController.editMessage
);

// Delete message
router.delete('/messages/:messageId', 
  requireAuth,
  chatController.deleteMessage
);

module.exports = router;
