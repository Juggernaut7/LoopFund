const invitationService = require('../services/invitation.service');

// Create invitation
const createInvitation = async (req, res) => {
  try {
    const { inviteeEmail, groupId, message } = req.body;
    const inviterId = req.user.userId;

    const invitation = await invitationService.createInvitation(
      inviterId,
      inviteeEmail,
      groupId,
      message
    );

    res.json({
      success: true,
      data: invitation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Generate public invite link
const generatePublicInviteLink = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    console.log('🎯 Generating public invite link for group:', groupId, 'by user:', userId);

    const result = await invitationService.generatePublicInviteLink(groupId, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('❌ Controller error:', error);
    next(error);
  }
};

// Join group with invite code
const joinGroupWithCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.userId;

    const group = await invitationService.joinGroupWithCode(inviteCode, userId);

    res.json({
      success: true,
      data: group,
      message: 'Successfully joined the group!'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Accept invitation
const acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.userId;

    const invitation = await invitationService.acceptInvitation(invitationId, userId);

    res.json({
      success: true,
      data: invitation,
      message: 'Invitation accepted successfully!'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Decline invitation
const declineInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const userId = req.user.userId;

    const invitation = await invitationService.declineInvitation(invitationId, userId);

    res.json({
      success: true,
      data: invitation,
      message: 'Invitation declined'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's invitations
const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invitations = await invitationService.getUserInvitations(userId);

    res.json({
      success: true,
      data: invitations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get group's invitations
const getGroupInvitations = async (req, res) => {
  try {
    const { groupId } = req.params;
    const invitations = await invitationService.getGroupInvitations(groupId);

    res.json({
      success: true,
      data: invitations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createInvitation,
  generatePublicInviteLink,
  joinGroupWithCode,
  acceptInvitation,
  declineInvitation,
  getUserInvitations,
  getGroupInvitations
}; 