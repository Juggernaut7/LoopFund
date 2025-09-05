const Invitation = require('../models/Invitation');
const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');
const crypto = require('crypto');

// Add this debug log to check if models are imported
console.log('🔍 Invitation model:', Invitation);
console.log('🔍 Group model:', Group);
console.log('🔍 User model:', User);

class InvitationService {
  // Create invitation
  async createInvitation(inviterId, inviteeEmail, groupId, message = '') {
    try {
      // Check if invitee exists
      const invitee = await User.findOne({ email: inviteeEmail });
      if (!invitee) {
        throw new Error('User not found with this email');
      }

      // Check if already invited
      const existingInvitation = await Invitation.findOne({
        inviter: inviterId,
        invitee: invitee._id,
        group: groupId,
        status: 'pending'
      });

      if (existingInvitation) {
        throw new Error('User already invited to this group');
      }

      // Check if user is already a member
      const group = await Group.findById(groupId);
      if (group.members.includes(invitee._id)) {
        throw new Error('User is already a member of this group');
      }

      // Create invitation
      const invitation = new Invitation({
        inviter: inviterId,
        invitee: invitee._id,
        group: groupId,
        message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      await invitation.save();

      // Send notification to invitee
      await this.sendInvitationNotification(invitation);

      return invitation;
    } catch (error) {
      throw error;
    }
  }

  // Generate public invite link
  async generatePublicInviteLink(groupId, inviterId) {
    try {
      console.log('🔍 Checking group:', groupId, 'for user:', inviterId);
      
      // Check if group exists and user is a member
      const group = await Group.findById(groupId);
      if (!group) {
        console.log('❌ Group not found:', groupId);
        return {
          success: false,
          error: 'Group not found',
          code: 'GROUP_NOT_FOUND'
        };
      }

      console.log('📋 Group members:', JSON.stringify(group.members, null, 2));
      console.log('👤 Inviter ID:', inviterId);
      console.log(' Inviter ID type:', typeof inviterId);

      // Fix: Check if user is a member of the group (handle the actual structure)
      let isMember = false;
      
      if (Array.isArray(group.members)) {
        // Check if members is an array of objects with user property
        isMember = group.members.some(member => {
          console.log(' Checking member:', JSON.stringify(member, null, 2));
          console.log('🔍 Member.user:', member.user);
          console.log('🔍 Member.user type:', typeof member.user);
          console.log('🔍 Member.user.toString():', member.user.toString());
          console.log(' InviterId.toString():', inviterId.toString());
          
          const memberUserId = member.user.toString();
          const inviterIdStr = inviterId.toString();
          
          const matches = memberUserId === inviterIdStr;
          console.log('🔍 Match result:', matches);
          
          return matches;
        });
      }

      console.log('✅ Is member:', isMember);
      
      if (!isMember) {
        return {
          success: false,
          error: 'You are not a member of this group',
          code: 'NOT_MEMBER'
        };
      }

      // Generate a unique invite code
      const inviteCode = crypto.randomBytes(16).toString('hex');
      
      // Create or update the invitation
      const invitation = await Invitation.findOneAndUpdate(
        { group: groupId, type: 'public' },
        {
          group: groupId,
          inviter: inviterId,
          type: 'public',
          inviteCode: inviteCode,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          status: 'active'
        },
        { upsert: true, new: true }
      );

      // Generate the public invite link
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/join-group/${inviteCode}`;
      
      console.log('🔗 Generated invite link:', inviteLink);
      
      return {
        success: true,
        data: {
          inviteLink: inviteLink,
          inviteCode: inviteCode,
          expiresAt: invitation.expiresAt
        }
      };
    } catch (error) {
      console.error('❌ Error generating public invite link:', error);
      return {
        success: false,
        error: 'Failed to generate invite link',
        code: 'GENERATION_ERROR'
      };
    }
  }

  // Join group with invite code
  async joinGroupWithCode(inviteCode, userId) {
    try {
      const invitation = await Invitation.findOne({ 
        inviteCode, 
        status: 'pending',
        expiresAt: { $gt: new Date() }
      }).populate('group');

      if (!invitation) {
        throw new Error('Invalid or expired invite code');
      }

      // Check if user is already a member
      if (invitation.group.members.includes(userId)) {
        throw new Error('You are already a member of this group');
      }

      // Add user to group
      await Group.findByIdAndUpdate(invitation.group._id, {
        $addToSet: { members: userId }
      });

      // Update invitation status
      invitation.status = 'accepted';
      invitation.invitee = userId;
      invitation.acceptedAt = new Date();
      await invitation.save();

      // Send notification to group admins
      await this.sendJoinNotification(invitation);

      return invitation.group;
    } catch (error) {
      throw error;
    }
  }

  // Accept invitation
  async acceptInvitation(invitationId, userId) {
    try {
      const invitation = await Invitation.findById(invitationId);
      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.invitee.toString() !== userId) {
        throw new Error('Unauthorized to accept this invitation');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Invitation is no longer valid');
      }

      if (invitation.isExpired()) {
        invitation.status = 'expired';
        await invitation.save();
        throw new Error('Invitation has expired');
      }

      // Add user to group
      await Group.findByIdAndUpdate(invitation.group, {
        $addToSet: { members: userId }
      });

      // Update invitation
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await invitation.save();

      // Send notification to inviter
      await this.sendAcceptanceNotification(invitation);

      return invitation;
    } catch (error) {
      throw error;
    }
  }

  // Decline invitation
  async declineInvitation(invitationId, userId) {
    try {
      const invitation = await Invitation.findById(invitationId);
      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.invitee.toString() !== userId) {
        throw new Error('Unauthorized to decline this invitation');
      }

      invitation.status = 'declined';
      invitation.declinedAt = new Date();
      await invitation.save();

      // Send notification to inviter
      await this.sendDeclineNotification(invitation);

      return invitation;
    } catch (error) {
      throw error;
    }
  }

  // Get user's invitations
  async getUserInvitations(userId) {
    try {
      const invitations = await Invitation.find({
        invitee: userId,
        status: 'pending'
      }).populate(['inviter', 'group']);

      return invitations;
    } catch (error) {
      throw error;
    }
  }

  // Get group's pending invitations
  async getGroupInvitations(groupId) {
    try {
      const invitations = await Invitation.find({
        group: groupId,
        status: 'pending'
      }).populate(['inviter', 'invitee']);

      return invitations;
    } catch (error) {
      throw error;
    }
  }

  // Helper methods
  generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async sendInvitationNotification(invitation) {
    try {
      await Notification.create({
        user: invitation.invitee,
        title: 'Group Invitation',
        message: `You've been invited to join a group`,
        type: 'invitation',
        data: {
          invitationId: invitation._id,
          groupId: invitation.group,
          inviterId: invitation.inviter
        }
      });
    } catch (error) {
      console.error('Failed to send invitation notification:', error);
    }
  }

  async sendJoinNotification(invitation) {
    try {
      const group = await Group.findById(invitation.group);
      const notifications = group.admins.map(adminId => ({
        user: adminId,
        title: 'New Group Member',
        message: `Someone joined your group using an invite link`,
        type: 'group_join',
        data: {
          groupId: invitation.group,
          newMemberId: invitation.invitee
        }
      }));

      await Notification.insertMany(notifications);
    } catch (error) {
      console.error('Failed to send join notification:', error);
    }
  }

  async sendAcceptanceNotification(invitation) {
    try {
      await Notification.create({
        user: invitation.inviter,
        title: 'Invitation Accepted',
        message: `Your group invitation was accepted`,
        type: 'invitation_accepted',
        data: {
          invitationId: invitation._id,
          groupId: invitation.group,
          inviteeId: invitation.invitee
        }
      });
    } catch (error) {
      console.error('Failed to send acceptance notification:', error);
    }
  }

  async sendDeclineNotification(invitation) {
    try {
      await Notification.create({
        user: invitation.inviter,
        title: 'Invitation Declined',
        message: `Your group invitation was declined`,
        type: 'invitation_declined',
        data: {
          invitationId: invitation._id,
          groupId: invitation.group,
          inviteeId: invitation.invitee
        }
      });
    } catch (error) {
      console.error('Failed to send decline notification:', error);
    }
  }
}

module.exports = new InvitationService();
