const Group = require('../models/Group');

async function createGroup({ name, description, targetAmount, maxMembers = 10, durationMonths = 1, userId }) {
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

module.exports = { createGroup, joinGroup, listGroups, deleteGroup };