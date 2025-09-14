const invitationService = require('../services/invitation.service');
const Invitation = require('../models/Invitation');

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

// Get group details by invite code (public route)
const getGroupByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    
    console.log('🔍 Fetching group details for invite code:', inviteCode);

    const invitation = await Invitation.findOne({ 
      inviteCode, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).populate('group', 'name description targetAmount currentAmount members maxMembers durationMonths createdAt');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired invite code'
      });
    }

    const group = invitation.group;
    
    // Calculate group stats
    const memberCount = group.members ? group.members.length : 0;
    const progress = group.targetAmount > 0 ? Math.round((group.currentAmount / group.targetAmount) * 100) : 0;
    
    const groupData = {
      _id: group._id,
      name: group.name,
      description: group.description,
      targetAmount: group.targetAmount,
      currentAmount: group.currentAmount || 0,
      memberCount,
      maxMembers: group.maxMembers,
      durationMonths: group.durationMonths,
      progress,
      createdAt: group.createdAt,
      inviteCode: inviteCode
    };

    res.json({
      success: true,
      data: groupData
    });
  } catch (error) {
    console.error('❌ Error fetching group by invite code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch group details'
    });
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
    console.error('❌ joinGroupWithCode controller error:', error);
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

// Create email invitation
const createEmailInvitation = async (req, res) => {
  try {
    const { inviteeEmail, groupId, message } = req.body;
    const inviterId = req.user.userId;

    const result = await invitationService.createEmailInvitation(
      inviterId,
      inviteeEmail,
      groupId,
      message
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.invitation,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Accept email invitation (for new users)
const acceptEmailInvitation = async (req, res) => {
  try {
    const { invitationToken, userData } = req.body;

    const result = await invitationService.acceptEmailInvitation(
      invitationToken,
      userData
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: {
        user: result.user,
        group: result.group
      },
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get email invitation details (for landing page)
const getEmailInvitationDetails = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({
      invitationToken: token,
      status: 'pending',
      type: 'email',
      expiresAt: { $gt: new Date() }
    }).populate('group inviter', 'name firstName lastName email');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired invitation'
      });
    }

    res.json({
      success: true,
      data: {
        group: invitation.group,
        inviter: invitation.inviter,
        message: invitation.message,
        expiresAt: invitation.expiresAt
      }
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
  getGroupByInviteCode,
  joinGroupWithCode,
  acceptInvitation,
  declineInvitation,
  getUserInvitations,
  getGroupInvitations,
  createEmailInvitation,
  acceptEmailInvitation,
  getEmailInvitationDetails
}; 