const { Group } = require('../models/Group');

async function createGroup({ name, description, targetAmount, userId }) {
  const inviteLink = Math.random().toString(36).substring(2, 12);
  
  // Fix: Create proper member objects that match the schema
  const members = [{
    user: userId,
    role: 'owner',
    joinedAt: new Date(),
    isActive: true,
    totalContributed: 0
  }];
  
  const group = await Group.create({ 
    name, 
    description, 
    targetAmount, 
    createdBy: userId, 
    members, 
    inviteLink 
  });
  return group;
}

async function joinGroup({ inviteLink, userId }) {
  const group = await Group.findOne({ inviteLink });
  if (!group) throw new Error('Invalid invite link');
  
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

module.exports = { createGroup, joinGroup, listGroups };