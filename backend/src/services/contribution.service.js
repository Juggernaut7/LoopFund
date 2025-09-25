const Contribution = require('../models/Contribution');
const Goal = require('../models/Goal');
const Group = require('../models/Group');
const Wallet = require('../models/Wallet');

const addContribution = async (contributionData) => {
  try {
    const { userId, goalId, groupId, amount, method, description, type = 'individual', paymentMethod = 'wallet' } = contributionData;

    console.log('Contribution Data:', contributionData);
    console.log('User ID:', userId);

    let targetEntity = null;
    let contributionType = type;

    // Check if it's a goal contribution
    if (goalId) {
      const goal = await Goal.findById(goalId);
      console.log('Goal found:', goal);
      
      if (!goal) {
        throw new Error('Goal not found');
      }
      targetEntity = goal;
      contributionType = goal.type || 'individual';
    }
    // Check if it's a group contribution
    else if (groupId) {
      const group = await Group.findById(groupId);
      console.log('Group found:', group);
      
      if (!group) {
        throw new Error('Group not found');
      }
      targetEntity = group;
      contributionType = 'group';
    }
    else {
      throw new Error('Either goalId or groupId must be provided');
    }

    // Check if user can contribute
    let canContribute = false;

    if (goalId) {
      // For goal contributions
      console.log('Goal user:', targetEntity.user);
      console.log('Goal type:', targetEntity.type);

      if (contributionType === 'individual') {
        // For individual goals, only the goal owner can contribute
        if (targetEntity.user) {
          canContribute = targetEntity.user.toString() === userId;
          console.log('Individual goal check:', canContribute);
        } else {
          console.log('No user field in goal, allowing contribution');
          canContribute = true;
        }
      } else if (contributionType === 'group') {
        // For group goals, check if user is a member of the group
        if (targetEntity.group) {
          const group = await Group.findById(targetEntity.group);
          if (group) {
            canContribute = group.members.some(member => 
              member.user.toString() === userId || group.owner.toString() === userId
            );
            console.log('Group goal check:', canContribute);
          }
        }
      }
    } else if (groupId) {
      // For group contributions, check if user is a member of the group
      canContribute = targetEntity.members.some(member => 
        member.user.toString() === userId || targetEntity.owner.toString() === userId
      );
      console.log('Group contribution check:', canContribute);
    }

    console.log('Can contribute:', canContribute);

    if (!canContribute) {
      throw new Error('You are not authorized to contribute to this goal');
    }

    // Handle payment method
    if (paymentMethod === 'wallet') {
      // Get user's wallet
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        throw new Error('Wallet not found. Please add money to your wallet first.');
      }

      // Check if user has sufficient balance
      if (wallet.balance < amount) {
        throw new Error(`Insufficient wallet balance. Available: ₦${wallet.balance.toLocaleString()}, Required: ₦${amount.toLocaleString()}`);
      }

      // Deduct from wallet
      wallet.balance -= amount;
      
      // Add transaction record
      wallet.transactions.push({
        type: 'contribution',
        amount: -amount, // Negative for deduction
        description: description || `Contribution to ${targetEntity.name}`,
        goalId: goalId || null,
        groupId: groupId || null,
        contributorId: userId,
        status: 'completed'
      });

      await wallet.save();
      console.log('💰 Wallet updated after contribution:', wallet.balance);
    } else if (paymentMethod === 'paystack_direct') {
      // For direct Paystack payments, we'll handle this in the controller
      // This service will just create the contribution record
      console.log('💳 Direct Paystack payment - contribution will be processed via payment service');
    }

    // Create the contribution
    const contribution = new Contribution({
      user: userId,
      goal: goalId || null,
      group: groupId || (targetEntity.group || null),
      amount: amount,
      type: contributionType,
      method: paymentMethod === 'wallet' ? 'wallet' : (method || 'bank_transfer'),
      description: description || 'Contribution',
      status: 'completed',
      metadata: {
        targetName: targetEntity.name,
        targetType: contributionType,
        groupName: groupId ? targetEntity.name : (targetEntity.group ? (await Group.findById(targetEntity.group))?.name : null),
        paymentMethod: paymentMethod
      }
    });

    await contribution.save();

    // Update target progress
    if (goalId) {
      // Update goal progress
      targetEntity.currentAmount = (targetEntity.currentAmount || 0) + amount;
      targetEntity.lastContributionDate = new Date();
      
      // Check if goal is completed
      if (targetEntity.currentAmount >= targetEntity.targetAmount && targetEntity.status !== 'completed') {
        targetEntity.status = 'completed';
        targetEntity.completedAt = new Date();
        
        // Trigger fund release check for completed goal
        const fundReleaseService = require('./fundRelease.service');
        setTimeout(async () => {
          try {
            await fundReleaseService.checkAndReleaseGoalFunds(targetEntity._id);
          } catch (error) {
            console.error('Error auto-releasing goal funds:', error);
          }
        }, 1000); // Small delay to ensure goal is saved
      }
      
      await targetEntity.save();

      // If it's a group goal, update group total
      if (targetEntity.group) {
        const group = await Group.findById(targetEntity.group);
        if (group) {
          group.currentAmount = (group.currentAmount || 0) + amount;
          group.progress.totalContributions = (group.progress.totalContributions || 0) + 1;
          await group.save();
          console.log('📊 Group goal updated:', {
            groupId: group._id,
            newAmount: group.currentAmount
          });
        }
      }
    } else if (groupId) {
      // Update group total for direct group contributions
      targetEntity.currentAmount = (targetEntity.currentAmount || 0) + amount;
      targetEntity.lastContributionDate = new Date();
      
      // Update progress
      targetEntity.progress.totalContributions = (targetEntity.progress.totalContributions || 0) + 1;
      
      // Check if group target is reached
      if (targetEntity.targetAmount && targetEntity.currentAmount >= targetEntity.targetAmount && targetEntity.status !== 'completed') {
        targetEntity.status = 'completed';
        targetEntity.completedAt = new Date();

        // Trigger fund release to group creator's wallet upon completion
        const fundReleaseService = require('./fundRelease.service');
        setTimeout(async () => {
          try {
            await fundReleaseService.checkAndReleaseGroupFunds(targetEntity._id);
          } catch (error) {
            console.error('Error auto-releasing group funds:', error);
          }
        }, 1000); // Small delay to ensure group is saved
      }
      
      await targetEntity.save();
      console.log('📊 Group updated after contribution:', {
        groupId: targetEntity._id,
        newAmount: targetEntity.currentAmount,
        targetAmount: targetEntity.targetAmount
      });
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