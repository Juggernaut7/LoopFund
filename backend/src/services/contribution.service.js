const Contribution = require('../models/Contribution');
const Goal = require('../models/Goal');
const Group = require('../models/Group');

const addContribution = async (contributionData) => {
  try {
    const { userId, goalId, amount, method, description, type = 'individual' } = contributionData;

    console.log('Contribution Data:', contributionData);
    console.log('User ID:', userId);

    // First, get the goal to check if it exists and get its type
    const goal = await Goal.findById(goalId);
    console.log('Goal found:', goal);
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Check if user can contribute to this goal
    let canContribute = false;

    console.log('Goal user:', goal.user);
    console.log('Goal type:', goal.type);

    if (type === 'individual' || goal.type === 'individual') {
      // For individual goals, only the goal owner can contribute
      if (goal.user) {
        canContribute = goal.user.toString() === userId;
        console.log('Individual goal check:', canContribute);
      } else {
        console.log('No user field in goal, allowing contribution');
        canContribute = true;
      }
    } else if (type === 'group' || goal.type === 'group') {
      // For group goals, check if user is a member of the group
      if (goal.group) {
        const group = await Group.findById(goal.group);
        if (group) {
          canContribute = group.members.some(member => 
            member.user.toString() === userId || group.owner.toString() === userId
          );
          console.log('Group goal check:', canContribute);
        }
      }
    }

    console.log('Can contribute:', canContribute);

    if (!canContribute) {
      throw new Error('You are not authorized to contribute to this goal');
    }

    // Create the contribution
    const contribution = new Contribution({
      user: userId,
      goal: goalId,
      group: goal.group || null,
      amount: amount,
      type: type,
      method: method || 'bank_transfer',
      description: description || 'Contribution',
      status: 'completed',
      metadata: {
        goalName: goal.name,
        goalType: goal.type,
        groupName: goal.group ? (await Group.findById(goal.group))?.name : null
      }
    });

    await contribution.save();

    // Update goal progress
    goal.currentAmount = (goal.currentAmount || 0) + amount;
    goal.lastContributionDate = new Date();
    await goal.save();

    // If it's a group goal, update group total
    if (goal.group) {
      const group = await Group.findById(goal.group);
      if (group) {
        group.totalSavings = (group.totalSavings || 0) + amount;
        await group.save();
      }
    }

    return contribution;
  } catch (error) {
    console.error('Error in addContribution:', error);
    throw error;
  }
};

const getUserContributions = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, goalId, groupId, type } = options;
    const skip = (page - 1) * limit;

    let query = { user: userId };

    if (goalId) query.goal = goalId;
    if (groupId) query.group = groupId;
    if (type) query.type = type;

    const contributions = await Contribution.find(query)
      .populate('goal', 'name type targetAmount currentAmount')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contribution.countDocuments(query);

    return {
      contributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getUserContributions:', error);
    throw error;
  }
};

const getGoalContributions = async (goalId, options = {}) => {
  try {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const contributions = await Contribution.find({ goal: goalId })
      .populate('user', 'firstName lastName email')
      .populate('goal', 'name type targetAmount currentAmount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contribution.countDocuments({ goal: goalId });

    return {
      contributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getGoalContributions:', error);
    throw error;
  }
};

const getContributionStats = async (userId) => {
  try {
    const stats = await Contribution.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalContributed: { $sum: '$amount' },
          totalContributions: { $count: {} },
          averageContribution: { $avg: '$amount' }
        }
      }
    ]);

    const monthlyStats = await Contribution.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $count: {} }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    return {
      totalContributed: stats[0]?.totalContributed || 0,
      totalContributions: stats[0]?.totalContributions || 0,
      averageContribution: stats[0]?.averageContribution || 0,
      monthlyStats
    };
  } catch (error) {
    console.error('Error in getContributionStats:', error);
    throw error;
  }
};

module.exports = {
  addContribution,
  getUserContributions,
  getGoalContributions,
  getContributionStats
};