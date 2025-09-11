const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const invitationController = require('../controllers/invitation.controller');

const router = Router();

// Get group details by invite code (public route - no auth required)
router.get('/group/:inviteCode', invitationController.getGroupByInviteCode);

// Create invitation
router.post('/', requireAuth, invitationController.createInvitation);

// Generate public invite link
router.post('/group/:groupId/public-link', requireAuth, invitationController.generatePublicInviteLink);

// Join group with invite code
router.post('/join', requireAuth, invitationController.joinGroupWithCode);

// Accept invitation
router.put('/:invitationId/accept', requireAuth, invitationController.acceptInvitation);

// Decline invitation
router.put('/:invitationId/decline', requireAuth, invitationController.declineInvitation);

// Get user's invitations
router.get('/user', requireAuth, invitationController.getUserInvitations);

// Get group's invitations
router.get('/group/:groupId', requireAuth, invitationController.getGroupInvitations);

module.exports = router; 