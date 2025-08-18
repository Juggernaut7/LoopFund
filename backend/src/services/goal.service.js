const { Goal } = require('../models/Goal');
const { Group } = require('../models/Group');

async function createGoal({ name, description, targetAmount, endDate, frequency, amount, customDates, userId, groupId }) {
  const isGroupGoal = !!groupId;
  let members = [{ user: userId, role: 'owner' }]; // Fix: Create proper member objects
  let nextDueDate = new Date();

  if (isGroupGoal) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) throw new Error('Not a group member');
    // Fix: Create proper member objects for group members
    members = group.members.map(memberId => ({ user: memberId, role: 'member' }));
  }

  if (frequency === 'daily') nextDueDate.setDate(nextDueDate.getDate() + 1);
  else if (frequency === 'weekly') nextDueDate.setDate(nextDueDate.getDate() + 7);
  else if (frequency === 'monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  else if (frequency === 'custom' && customDates.length) nextDueDate = new Date(customDates[0]);

  const goal = await Goal.create({
    name,
    description,
    targetAmount,
    endDate,
    isGroupGoal,
    group: groupId || null,
    createdBy: userId,
    members,
    contributionSchedule: { frequency, amount, customDates: customDates || [], nextDueDate },
  });
  return goal;
}

async function listGoals(userId) {
  return Goal.find({ 
    $or: [
      { createdBy: userId }, 
      { 'members.user': userId }  // Fix: Query nested user field
    ] 
  }).populate('group').lean();
}

async function getGoal(goalId, userId) {
  const goal = await Goal.findById(goalId).populate('group').lean();
  if (!goal) throw new Error('Goal not found');
  
  // Fix: Check nested member structure
  const isMember = goal.members.some(member => member.user.toString() === userId);
  const isCreator = goal.createdBy.toString() === userId;
  
  if (!isMember && !isCreator) {
    throw new Error('Not authorized');
  }
  return goal;
}

module.exports = { createGoal, listGoals, getGoal };