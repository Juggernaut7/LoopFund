const { Contribution } = require('../models/Contribution');
const { Goal } = require('../models/Goal');

async function addContribution({ goalId, userId, amount }) {
  const goal = await Goal.findById(goalId);
  if (!goal) throw new Error('Goal not found');
  if (!goal.members.includes(userId)) throw new Error('Not a goal member');

  const contribution = await Contribution.create({ goal: goalId, user: userId, amount });
  goal.totalContributed += amount;

  // Update next due date based on frequency
  if (goal.contributionSchedule.frequency === 'daily') {
    goal.contributionSchedule.nextDueDate.setDate(goal.contributionSchedule.nextDueDate.getDate() + 1);
  } else if (goal.contributionSchedule.frequency === 'weekly') {
    goal.contributionSchedule.nextDueDate.setDate(goal.contributionSchedule.nextDueDate.getDate() + 7);
  } else if (goal.contributionSchedule.frequency === 'monthly') {
    goal.contributionSchedule.nextDueDate.setMonth(goal.contributionSchedule.nextDueDate.getMonth() + 1);
  } else if (goal.contributionSchedule.frequency === 'custom') {
    const nextDate = goal.contributionSchedule.customDates.find(date => new Date(date) > new Date());
    goal.contributionSchedule.nextDueDate = nextDate ? new Date(nextDate) : null;
  }

  await goal.save();
  return contribution;
}

async function listContributions(goalId, userId) {
  const goal = await Goal.findById(goalId);
  if (!goal) throw new Error('Goal not found');
  if (!goal.members.includes(userId) && goal.createdBy.toString() !== userId) {
    throw new Error('Not authorized');
  }
  return Contribution.find({ goal: goalId }).populate('user', 'firstName lastName email').lean();
}

module.exports = { addContribution, listContributions };