const { Group } = require('../models/Group');

async function createGroup({ name, description, targetAmount, userId }) {
  const inviteLink = Math.random().toString(36).substring(2, 12);
  const group = await Group.create({ name, description, targetAmount, createdBy: userId, members: [userId], inviteLink });
  return group;
}

async function joinGroup({ inviteLink, userId }) {
  const group = await Group.findOne({ inviteLink });
  if (!group) throw new Error('Invalid invite link');
  if (group.members.includes(userId)) throw new Error('Already a member');

  group.members.push(userId);
  await group.save();
  return group;
}

async function listGroups(userId) {
  return Group.find({ $or: [{ createdBy: userId }, { members: userId }] }).lean();
}

module.exports = { createGroup, joinGroup, listGroups };