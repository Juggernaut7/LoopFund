const Group = require('../models/Group');
const Contribution = require('../models/Contribution');
const User = require('../models/User');

async function createGroup({ name, description, targetAmount, maxMembers = 10, durationMonths = 1, userId, accountInfo = {} }) {
  // Generate unique invite code
  const inviteCode = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  
  // Create proper member objects that match the schema
  const members = [{
    user: userId,
    role: 'owner',
    joinedAt: new Date(),
    isActive: true,
    totalContributed: 0
  }];
  
  // Calculate end date based on duration
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);
  
  const group = await Group.create({ 
    name, 
    description, 
    targetAmount, 
    createdBy: userId, 
    members,
    inviteCode,
    inviteLink: inviteCode, // Set inviteLink for backward compatibility
    accountInfo,
    settings: {
      maxMembers: maxMembers
    },
    endDate: endDate
  });
  return group;
}

async function joinGroup({ inviteCode, userId }) {
  // Try to find group by inviteCode first, then by inviteLink for backward compatibility
  let group = await Group.findOne({ inviteCode });
  if (!group) {
    group = await Group.findOne({ inviteLink: inviteCode });
  }
  if (!group) throw new Error('Invalid invite code');
  
  // Fix: Check if user is already a member using the nested structure
  const isAlreadyMember = group.members.some(member => member.user.toString() === userId);
  if (isAlreadyMember) throw new Error('Already a member');

  // Fix: Add new member with proper structure
  group.members.push({
    user: userId,
    role: 'member',
    joinedAt: new Date(),
    isActive: true,
    totalContributed: 0
  });
  
  await group.save();
  return group;
}

async function listGroups(userId) {
  // Fix: Query the nested user field in members array
  return Group.find({ 
    $or: [
      { createdBy: userId }, 
      { 'members.user': userId }  // Query nested user field
    ] 
  }).lean();
}

const deleteGroup = async (groupId, userId) => {
  try {
    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is the owner
    const isOwner = group.members.some(member => 
      member.user.toString() === userId.toString() && member.role === 'owner'
    );

    if (!isOwner) {
      throw new Error('Only group owner can delete the group');
    }

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    // Also delete related invitations
    const Invitation = require('../models/Invitation');
    if (Invitation) {
      await Invitation.deleteMany({ group: groupId });
    }

    return true;
  } catch (error) {
    throw error;
  }
};

async function getGroupDetails(groupId, userId) {
  try {
    const group = await Group.findById(groupId)
      .populate('createdBy', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email');

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user && member.user._id.toString() === userId
    ) || group.createdBy._id.toString() === userId;

    if (!isMember) {
      throw new Error('You are not a member of this group');
    }

    // Calculate progress
    const progress = group.targetAmount > 0 
      ? Math.min((group.currentAmount / group.targetAmount) * 100, 100)
      : 0;

    // Calculate days remaining
    const now = new Date();
    const endDate = group.endDate || new Date(now.getTime() + (group.durationMonths * 30 * 24 * 60 * 60 * 1000));
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

    // Update group with calculated values
    group.progress = {
      percentage: Math.round(progress),
      daysRemaining: daysRemaining,
      activeMembers: group.members.filter(m => m.isActive).length,
      totalContributions: group.members.reduce((sum, m) => sum + (m.totalContributed || 0), 0)
    };

    return group;
  } catch (error) {
    console.error('❌ Get group details error:', error);
    throw error;
  }
}

async function addGroupContribution(groupId, userId, contributionData) {
  try {
    const { amount, method = 'bank_transfer', description = 'Group contribution' } = contributionData;

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Get group and check if user is a member
    const group = await Group.findById(groupId)
      .populate('createdBy', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email');

    if (!group) {
      throw new Error('Group not found');
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(member => 
      member.user && member.user._id.toString() === userId
    );

    if (memberIndex === -1 && group.createdBy._id.toString() !== userId) {
      throw new Error('You are not a member of this group');
    }

    // Create contribution record
    const contribution = new Contribution({
      user: userId,
      group: groupId,
      amount: parseFloat(amount),
      type: 'group',
      method: method,
      description: description,
      status: 'completed',
      metadata: {
        groupName: group.name,
        groupType: 'group'
      }
    });

    await contribution.save();

    // Update group current amount
    group.currentAmount = (group.currentAmount || 0) + parseFloat(amount);

    // Update member's total contribution
    if (memberIndex !== -1) {
      group.members[memberIndex].totalContributed = (group.members[memberIndex].totalContributed || 0) + parseFloat(amount);
      group.members[memberIndex].lastContributionDate = new Date();
    } else if (group.createdBy._id.toString() === userId) {
      // If it's the owner contributing, add them to members if not already there
      const ownerMemberIndex = group.members.findIndex(member => 
        member.user && member.user._id.toString() === userId
      );
      if (ownerMemberIndex === -1) {
        group.members.push({
          user: userId,
          role: 'owner',
          joinedAt: new Date(),
          isActive: true,
          totalContributed: parseFloat(amount),
          lastContributionDate: new Date()
        });
      } else {
        group.members[ownerMemberIndex].totalContributed = (group.members[ownerMemberIndex].totalContributed || 0) + parseFloat(amount);
        group.members[ownerMemberIndex].lastContributionDate = new Date();
      }
    }

    // Update progress
    const progress = group.targetAmount > 0 
      ? Math.min((group.currentAmount / group.targetAmount) * 100, 100)
      : 0;

    group.progress = {
      percentage: Math.round(progress),
      activeMembers: group.members.filter(m => m.isActive).length,
      totalContributions: group.members.reduce((sum, m) => sum + (m.totalContributed || 0), 0)
    };

    await group.save();

    // Populate the contribution with user details
    await contribution.populate('user', 'firstName lastName email');

    // Send chat message about the contribution
    try {
      const chatService = require('./chat.service');
      await chatService.sendContributionMessage(
        groupId,
        userId,
        parseFloat(amount),
        method
      );
    } catch (chatError) {
      console.error('Failed to send contribution chat message:', chatError);
      // Don't fail the contribution if chat fails
    }

    return {
      contribution,
      group
    };
  } catch (error) {
    console.error('❌ Add group contribution error:', error);
    throw error;
  }
}

async function getGroupContributions(groupId, userId) {
  try {
    // Check if user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const isMember = group.members.some(member => 
      member.user && member.user.toString() === userId
    ) || group.createdBy.toString() === userId;

    if (!isMember) {
      throw new Error('You are not a member of this group');
    }

    // Get contributions for this group
    const contributions = await Contribution.find({ group: groupId })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();

    return contributions;
  } catch (error) {
    console.error('❌ Get group contributions error:', error);
    throw error;
  }
}

module.exports = { 
  createGroup, 
  joinGroup, 
  listGroups, 
  deleteGroup,
  getGroupDetails,
  addGroupContribution,
  getGroupContributions
};