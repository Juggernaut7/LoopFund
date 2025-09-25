const Goal = require('../models/Goal');
const Group = require('../models/Group');
const Wallet = require('../models/Wallet');
const User = require('../models/User');

class FundReleaseService {
  // Check and release funds for completed goals
  async checkAndReleaseGoalFunds(goalId) {
    try {
      const goal = await Goal.findById(goalId);
      if (!goal) {
        throw new Error('Goal not found');
      }

      // Check if goal is completed and funds not yet released
      // Handle both new status field and legacy completion check
      const isCompleted = goal.status === 'completed' || 
                         (goal.currentAmount >= goal.targetAmount && goal.status !== 'cancelled');
      
      if (isCompleted && !goal.fundsReleased) {
        console.log(`🎯 Releasing funds for completed goal: ${goal.name}`);
        
        // Get goal owner's wallet
        let ownerWallet = await Wallet.findOne({ user: goal.user });
        
        if (!ownerWallet) {
          // Create wallet if it doesn't exist
          ownerWallet = new Wallet({
            user: goal.user,
            balance: 0,
            transactions: []
          });
        }
        
        // Add funds to owner's wallet
        ownerWallet.balance += goal.currentAmount;
        
        // Add transaction record
        ownerWallet.transactions.push({
          type: 'goal_release',
          amount: goal.currentAmount,
          description: `Goal completion funds: ${goal.name}`,
          goalId: goalId,
          status: 'completed'
        });
        
        await ownerWallet.save();
        
        // Mark goal as funds released and update status
        goal.fundsReleased = true;
        goal.fundsReleasedAt = new Date();
        goal.status = 'completed';
        if (!goal.completedAt) {
          goal.completedAt = new Date();
        }
        await goal.save();
        
        console.log(`✅ Released ₦${goal.currentAmount.toLocaleString()} to goal owner's wallet`);
        
        return {
          success: true,
          amount: goal.currentAmount,
          wallet: ownerWallet
        };
      }
      
      return { success: false, message: 'Goal not completed or funds already released' };
    } catch (error) {
      console.error('Error releasing goal funds:', error);
      throw error;
    }
  }

  // Check and release funds for completed groups
  async checkAndReleaseGroupFunds(groupId) {
    try {
      const group = await Group.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      // Check if group is completed and funds not yet released
      // Handle both new status field and legacy completion check
      const isCompleted = group.status === 'completed' || 
                         (group.currentAmount >= group.targetAmount && group.status !== 'cancelled');
      
      if (isCompleted && !group.fundsReleased) {
        console.log(`👥 Releasing funds for completed group: ${group.name}`);
        
        // Get group creator's wallet
        let creatorWallet = await Wallet.findOne({ user: group.createdBy });
        
        if (!creatorWallet) {
          // Create wallet if it doesn't exist
          creatorWallet = new Wallet({
            user: group.createdBy,
            balance: 0,
            transactions: []
          });
        }
        
        // Add funds to creator's wallet
        creatorWallet.balance += group.currentAmount;
        
        // Add transaction record
        creatorWallet.transactions.push({
          type: 'group_release',
          amount: group.currentAmount,
          description: `Group completion funds: ${group.name}`,
          groupId: groupId,
          status: 'completed'
        });
        
        await creatorWallet.save();
        
        // Mark group as funds released and update status
        group.fundsReleased = true;
        group.fundsReleasedAt = new Date();
        group.status = 'completed';
        if (!group.completedAt) {
          group.completedAt = new Date();
        }
        await group.save();
        
        console.log(`✅ Released ₦${group.currentAmount.toLocaleString()} to group creator's wallet`);
        
        return {
          success: true,
          amount: group.currentAmount,
          wallet: creatorWallet
        };
      }
      
      return { success: false, message: 'Group not completed or funds already released' };
    } catch (error) {
      console.error('Error releasing group funds:', error);
      throw error;
    }
  }

  // Check all completed goals and groups for fund release
  async checkAllCompletedFunds() {
    try {
      console.log('🔍 Checking for completed goals and groups to release funds...');
      
      // Find completed goals that haven't had funds released
      const completedGoals = await Goal.find({
        status: 'completed',
        fundsReleased: { $ne: true },
        currentAmount: { $gt: 0 }
      });

      // Find completed groups that haven't had funds released
      const completedGroups = await Group.find({
        status: 'completed',
        fundsReleased: { $ne: true },
        currentAmount: { $gt: 0 }
      });

      const results = {
        goals: [],
        groups: [],
        totalReleased: 0
      };

      // Release funds for completed goals
      for (const goal of completedGoals) {
        try {
          const result = await this.checkAndReleaseGoalFunds(goal._id);
          if (result.success) {
            results.goals.push({
              goalId: goal._id,
              goalName: goal.name,
              amount: result.amount
            });
            results.totalReleased += result.amount;
          }
        } catch (error) {
          console.error(`Error releasing funds for goal ${goal._id}:`, error);
        }
      }

      // Release funds for completed groups
      for (const group of completedGroups) {
        try {
          const result = await this.checkAndReleaseGroupFunds(group._id);
          if (result.success) {
            results.groups.push({
              groupId: group._id,
              groupName: group.name,
              amount: result.amount
            });
            results.totalReleased += result.amount;
          }
        } catch (error) {
          console.error(`Error releasing funds for group ${group._id}:`, error);
        }
      }

      console.log(`💰 Fund release check completed. Released ₦${results.totalReleased.toLocaleString()} total`);
      console.log(`Goals: ${results.goals.length}, Groups: ${results.groups.length}`);
      
      return results;
    } catch (error) {
      console.error('Error checking completed funds:', error);
      throw error;
    }
  }

  // Manual fund release for specific goal
  async manualReleaseGoalFunds(goalId) {
    return await this.checkAndReleaseGoalFunds(goalId);
  }

  // Manual fund release for specific group
  async manualReleaseGroupFunds(groupId) {
    return await this.checkAndReleaseGroupFunds(groupId);
  }
}

module.exports = new FundReleaseService();
