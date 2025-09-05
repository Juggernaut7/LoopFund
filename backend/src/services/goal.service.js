const Goal = require('../models/Goal');
const Group = require('../models/Group');

const createGoal = async (goalData) => {
  try {
    console.log('Creating goal with data:', goalData);

    // Ensure user field is present
    if (!goalData.user) {
      throw new Error('User ID is required');
    }

    // Create the goal
    const goal = new Goal({
      user: goalData.user,
      name: goalData.name,
      description: goalData.description || '',
      targetAmount: goalData.targetAmount,
      currentAmount: goalData.currentAmount || 0,
      type: goalData.type || 'individual',
      group: goalData.group || null,
      category: goalData.category || 'personal',
      deadline: goalData.deadline || null,
      isActive: goalData.isActive !== false,
      lastContributionDate: null
    });

    console.log('Goal object to save:', goal);

    const savedGoal = await goal.save();
    console.log('Goal saved successfully:', savedGoal);

    return savedGoal;
  } catch (error) {
    console.error('Error in createGoal:', error);
    throw error;
  }
};

const getUserGoals = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 20, type, category, isActive = true } = options;
    const skip = (page - 1) * limit;

    let query = { user: userId };

    if (type) query.type = type;
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive;

    const goals = await Goal.find(query)
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Goal.countDocuments(query);

    return {
      goals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getUserGoals:', error);
    throw error;
  }
};

const getGoalById = async (goalId, userId) => {
  try {
    const goal = await Goal.findOne({ _id: goalId, user: userId })
      .populate('group', 'name members');

    return goal;
  } catch (error) {
    console.error('Error in getGoalById:', error);
    throw error;
  }
};

const updateGoal = async (goalId, userId, updateData) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!goal) {
      throw new Error('Goal not found or not authorized');
    }

    return goal;
  } catch (error) {
    console.error('Error in updateGoal:', error);
    throw error;
  }
};

const deleteGoal = async (goalId, userId) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!goal) {
      throw new Error('Goal not found or not authorized');
    }

    return goal;
  } catch (error) {
    console.error('Error in deleteGoal:', error);
    throw error;
  }
};

module.exports = {
  createGoal,
  getUserGoals,
  getGoalById,
  updateGoal,
  deleteGoal
};