const Invitation = require('../models/Invitation');
const Group = require('../models/Group');
const User = require('../models/User');
const Notification = require('../models/Notification');
const emailService = require('./emailService');
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

      // Create invitation (don't set inviteCode for direct invitations)
      const invitation = new Invitation({
        inviter: inviterId,
        invitee: invitee._id,
        group: groupId,
        message,
        type: 'direct',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        // inviteCode is intentionally not set for direct invitations
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
      // Look for both pending and active invitations
      const invitation = await Invitation.findOne({ 
        inviteCode, 
        status: { $in: ['pending', 'active'] },
        expiresAt: { $gt: new Date() }
      }).populate('group');

      if (!invitation) {
        throw new Error('Invalid or expired invite code');
      }

      // Check if user is already a member using the nested structure
      const isAlreadyMember = invitation.group.members.some(member => 
        member.user && member.user.toString() === userId
      );
      
      if (isAlreadyMember) {
        throw new Error('You are already a member of this group');
      }

      // Check if group is full
      if (invitation.group.members.length >= invitation.group.maxMembers) {
        throw new Error('This group is full');
      }

      // Add user to group with proper structure
      const updatedGroup = await Group.findByIdAndUpdate(invitation.group._id, {
        $push: {
          members: {
            user: userId,
            role: 'member',
            joinedAt: new Date(),
            isActive: true,
            totalContributed: 0
          }
        }
      }, { new: true });

      // Update invitation status
      invitation.status = 'accepted';
      invitation.invitee = userId;
      invitation.acceptedAt = new Date();
      await invitation.save();

      // Send notification to group admins
      await this.sendJoinNotification(invitation);

      // Send notification to all group members about new member
      await this.sendNewMemberNotification(invitation, userId);

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

  async sendNewMemberNotification(invitation, userId) {
    try {
      const User = require('../models/User');
      const newMember = await User.findById(userId);
      const group = await Group.findById(invitation.group)
        .populate('members.user', 'firstName lastName');

      if (!newMember || !group) return;

      const newMemberName = `${newMember.firstName} ${newMember.lastName}`;

      // Notify all existing group members about the new member
      const notifications = group.members
        .filter(member => member.user && member.user._id.toString() !== userId)
        .map(member => ({
          user: member.user._id,
          title: 'New Group Member',
          message: `${newMemberName} joined ${group.name}`,
          type: 'group_member_joined',
          relatedId: invitation.group,
          relatedType: 'group',
          data: {
            groupId: invitation.group,
            newMemberId: userId,
            newMemberName: newMemberName,
            groupName: group.name
          }
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (error) {
      console.error('Failed to send new member notification:', error);
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

  // Create email invitation (for ANY user - registered or not)
  async createEmailInvitation(inviterId, inviteeEmail, groupId, message = '') {
    try {
      // Check if already invited via email (allow multiple invitations for reminders)
      const existingInvitation = await Invitation.findOne({
        inviter: inviterId,
        inviteeEmail: inviteeEmail,
        group: groupId,
        status: 'pending',
        type: 'email'
      });

      if (existingInvitation) {
        // Update the existing invitation instead of creating a new one
        existingInvitation.invitationToken = crypto.randomBytes(32).toString('hex');
        existingInvitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        existingInvitation.message = message;
        await existingInvitation.save();

        // Send email invitation
        const inviterName = `${inviter.firstName} ${inviter.lastName}`;
        const emailResult = await emailService.sendGroupInvitationEmail(
          inviteeEmail,
          inviterName,
          group.name,
          existingInvitation.invitationToken
        );

        if (!emailResult.success) {
          throw new Error(`Failed to send invitation email: ${emailResult.error}`);
        }

        return {
          success: true,
          invitation: existingInvitation,
          message: 'Email invitation resent successfully'
        };
      }

      // Get inviter and group details
      const inviter = await User.findById(inviterId);
      const group = await Group.findById(groupId);

      if (!inviter || !group) {
        throw new Error('Invalid inviter or group');
      }

      // Generate invitation token
      const invitationToken = crypto.randomBytes(32).toString('hex');

      // Create invitation record (don't set inviteCode for email invitations)
      const invitation = new Invitation({
        inviter: inviterId,
        inviteeEmail: inviteeEmail,
        group: groupId,
        message: message,
        invitationToken: invitationToken,
        type: 'email',
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        // inviteCode is intentionally not set for email invitations
      });

      await invitation.save();

      // Send email invitation
      const inviterName = `${inviter.firstName} ${inviter.lastName}`;
      const emailResult = await emailService.sendGroupInvitationEmail(
        inviteeEmail,
        inviterName,
        group.name,
        invitationToken
      );

      if (!emailResult.success) {
        // If email fails, delete the invitation
        await Invitation.findByIdAndDelete(invitation._id);
        throw new Error(`Failed to send invitation email: ${emailResult.error}`);
      }

      // Create notification for inviter
      await this.sendInvitationSentNotification(inviterId, groupId, inviteeEmail);

      return {
        success: true,
        invitation: invitation,
        message: 'Email invitation sent successfully'
      };

    } catch (error) {
      console.error('Failed to create email invitation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Accept email invitation (for new users)
  async acceptEmailInvitation(invitationToken, userData) {
    try {
      // Find invitation by token
      const invitation = await Invitation.findOne({
        invitationToken: invitationToken,
        status: 'pending',
        type: 'email',
        expiresAt: { $gt: new Date() }
      }).populate('group inviter');

      if (!invitation) {
        throw new Error('Invalid or expired invitation');
      }

      // Check if user already exists with this email
      let user = await User.findOne({ email: invitation.inviteeEmail });
      
      if (!user) {
        // Create new user
        user = new User({
          email: invitation.inviteeEmail,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
          isVerified: true, // Auto-verify email invitations
          joinedViaInvitation: true
        });

        await user.save();
      }

      // Add user to group
      const group = invitation.group;
      if (!group.members.includes(user._id)) {
        group.members.push(user._id);
        await group.save();
      }

      // Update invitation status
      invitation.status = 'accepted';
      invitation.invitee = user._id;
      await invitation.save();

      // Send notifications
      await this.sendInvitationAcceptedNotification(invitation.inviter._id, group._id, user._id);
      await this.sendWelcomeToGroupNotification(user._id, group._id);

      return {
        success: true,
        user: user,
        group: group,
        message: 'Successfully joined group via email invitation'
      };

    } catch (error) {
      console.error('Failed to accept email invitation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send invitation sent notification
  async sendInvitationSentNotification(inviterId, groupId, inviteeEmail) {
    try {
      const notification = new Notification({
        user: inviterId,
        type: 'invitation_sent',
        title: 'Invitation Sent',
        message: `Group invitation sent to ${inviteeEmail}`,
        data: {
          groupId: groupId,
          inviteeEmail: inviteeEmail
        }
      });

      await notification.save();
    } catch (error) {
      console.error('Failed to send invitation sent notification:', error);
    }
  }

  // Send welcome to group notification
  async sendWelcomeToGroupNotification(userId, groupId) {
    try {
      const notification = new Notification({
        user: userId,
        type: 'group_joined',
        title: 'Welcome to the Group!',
        message: 'You have successfully joined the group via email invitation',
        data: {
          groupId: groupId
        }
      });

      await notification.save();
    } catch (error) {
      console.error('Failed to send welcome notification:', error);
    }
  }
}

module.exports = new InvitationService();
