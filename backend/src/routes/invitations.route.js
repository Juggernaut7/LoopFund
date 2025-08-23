const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const invitationController = require('../controllers/invitation.controller');

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Create invitation
router.post('/', invitationController.createInvitation);

// Generate public invite link
router.post('/group/:groupId/public-link', invitationController.generatePublicInviteLink);

// Join group with invite code
router.post('/join', invitationController.joinGroupWithCode);

// Accept invitation
router.put('/:invitationId/accept', invitationController.acceptInvitation);

// Decline invitation
router.put('/:invitationId/decline', invitationController.declineInvitation);

// Get user's invitations
router.get('/user', invitationController.getUserInvitations);

// Get group's invitations
router.get('/group/:groupId', invitationController.getGroupInvitations);

module.exports = router; 