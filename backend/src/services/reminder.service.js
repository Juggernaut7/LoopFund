const cron = require('node-cron');
const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const User = require('../models/User');

function startReminderCron() {
  // Run every minute to check for due contributions
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const goals = await Goal.find({
        'contributionSchedule.nextDueDate': { $lte: now },
        $expr: { $lt: ['$totalContributed', '$targetAmount'] },
      }).populate('members', 'firstName lastName email');

      for (const goal of goals) {
        for (const member of goal.members) {
          console.log(`Reminder: ${member.firstName} ${member.lastName} (${member.email}) needs to contribute ${goal.contributionSchedule.amount} to goal "${goal.name}" (ID: ${goal._id})`);
        }

        // Update next due date
        if (goal.contributionSchedule.frequency === 'daily') {
          goal.contributionSchedule.nextDueDate.setDate(goal.contributionSchedule.nextDueDate.getDate() + 1);
        } else if (goal.contributionSchedule.frequency === 'weekly') {
          goal.contributionSchedule.nextDueDate.setDate(goal.contributionSchedule.nextDueDate.getDate() + 7);
        } else if (goal.contributionSchedule.frequency === 'monthly') {
          goal.contributionSchedule.nextDueDate.setMonth(goal.contributionSchedule.nextDueDate.getMonth() + 1);
        } else if (goal.contributionSchedule.frequency === 'custom') {
          const nextDate = goal.contributionSchedule.customDates.find(date => new Date(date) > now);
          goal.contributionSchedule.nextDueDate = nextDate ? new Date(nextDate) : null;
        }

        await goal.save();
      }
    } catch (error) {
      console.error('Reminder cron error:', error);
    }
  });
}

module.exports = { startReminderCron };