const Achievement = require('../models/Achievement');
const User = require('../models/User');

class AchievementsService {
  // Get user achievements
  async getUserAchievements(userId) {
    try {
      const achievements = await Achievement.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
      
      return achievements;
    } catch (error) {
      throw error;
    }
  }

  // Get achievement details
  async getAchievementDetails(achievementId) {
    try {
      const achievement = await Achievement.findById(achievementId)
        .populate('user', 'firstName lastName email')
        .lean();
      
      if (!achievement) {
        throw new Error('Achievement not found');
      }
      
      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Award achievement to user
  async awardAchievement(userId, achievementType, data = {}) {
    try {
      const achievement = new Achievement({
        user: userId,
        type: achievementType,
        title: this.getAchievementTitle(achievementType),
        description: this.getAchievementDescription(achievementType),
        data: data,
        awardedAt: new Date()
      });

      await achievement.save();
      return achievement;
    } catch (error) {
      throw error;
    }
  }

  // Helper methods for achievement titles and descriptions
  getAchievementTitle(type) {
    const titles = {
      'first_goal': 'First Goal Setter',
      'goal_completed': 'Goal Achiever',
      'first_contribution': 'First Contribution',
      'contribution_streak': 'Contribution Master',
      'group_creator': 'Group Creator',
      'group_member': 'Team Player',
      'savings_milestone': 'Savings Champion',
      'weekly_saver': 'Weekly Warrior',
      'monthly_saver': 'Monthly Master'
    };
    
    return titles[type] || 'Achievement Unlocked';
  }

  getAchievementDescription(type) {
    const descriptions = {
      'first_goal': 'You set your first savings goal!',
      'goal_completed': 'You successfully completed a savings goal!',
      'first_contribution': 'You made your first contribution!',
      'contribution_streak': 'You maintained a consistent contribution streak!',
      'group_creator': 'You created your first savings group!',
      'group_member': 'You joined your first savings group!',
      'savings_milestone': 'You reached a significant savings milestone!',
      'weekly_saver': 'You saved consistently for a week!',
      'monthly_saver': 'You saved consistently for a month!'
    };
    
    return descriptions[type] || 'Congratulations on your achievement!';
  }

  async getAchievementProgress(userId) {
    try {
      console.log('🔍 getAchievementProgress - Looking for achievements for user:', userId);
      
      // Get user achievements with progress data
      const achievements = await Achievement.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
      
      console.log('🔍 getAchievementProgress - Found achievements:', achievements.length);
      
      // Get user stats for progress calculation
      const userStats = await this.calculateUserStats(userId);
      console.log('🔍 getAchievementProgress - User stats:', userStats);
      
      // Transform achievements to include REAL progress data
      const progressData = achievements.map(achievement => {
        const progressInfo = this.calculateAchievementProgress(achievement, userStats);
        
        return {
          achievement: {
            id: achievement._id,
            name: achievement.title,
            description: achievement.description,
            type: achievement.type,
            category: this.mapTypeToCategory(achievement.type),
            icon: achievement.data?.icon || '🏆',
            color: achievement.data?.color || '#3B82F6',
            points: achievement.data?.points || 10,
            rarity: achievement.data?.rarity || 'common'
          },
          unlocked: progressInfo.unlocked,
          unlockedAt: progressInfo.unlocked ? achievement.awardedAt : null,
          progress: progressInfo.progress,
          criteria: progressInfo.criteria
        };
      });

      // Calculate real stats
      const unlockedAchievements = progressData.filter(a => a.unlocked).length;
      const totalAchievements = progressData.length;
      const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

      const stats = {
        totalAchievements: totalAchievements,
        unlockedAchievements: unlockedAchievements,
        completionRate: Math.round(completionRate),
        totalGoals: userStats.totalGoals,
        completedGoals: userStats.completedGoals,
        totalContributed: userStats.totalContributed,
        daysSinceJoining: userStats.daysSinceJoining
      };

      console.log('🔍 Final stats being returned:', stats);

      return {
        achievements: progressData,
        stats: stats
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate real achievement progress based on user stats
  calculateAchievementProgress(achievement, userStats) {
    const type = achievement.type;
    
    switch (type) {
      case 'first_goal':
        return {
          unlocked: userStats.totalGoals > 0,
          progress: Math.min((userStats.totalGoals / 1) * 100, 100),
          criteria: `Create 1 goal (${userStats.totalGoals}/1)`
        };
        
      case 'goal_completed':
        const goalTarget = achievement.data?.completed || 1;
        return {
          unlocked: userStats.completedGoals >= goalTarget,
          progress: Math.min((userStats.completedGoals / goalTarget) * 100, 100),
          criteria: `Complete ${goalTarget} goal${goalTarget > 1 ? 's' : ''} (${userStats.completedGoals}/${goalTarget})`
        };
        
      case 'first_contribution':
        return {
          unlocked: userStats.totalContributed > 0,
          progress: Math.min((userStats.totalContributed / 1) * 100, 100),
          criteria: `Make 1 contribution (${userStats.totalContributed > 0 ? '1' : '0'}/1)`
        };
        
      case 'savings_milestone':
        const milestoneTarget = achievement.data?.amount || 1000;
        return {
          unlocked: userStats.totalContributed >= milestoneTarget,
          progress: Math.min((userStats.totalContributed / milestoneTarget) * 100, 100),
          criteria: `Save $${milestoneTarget.toLocaleString()} ($${userStats.totalContributed.toLocaleString()}/$${milestoneTarget.toLocaleString()})`
        };
        
      case 'contribution_streak':
        const streakTarget = achievement.data?.days || 7;
        return {
          unlocked: userStats.daysSinceJoining >= streakTarget,
          progress: Math.min((userStats.daysSinceJoining / streakTarget) * 100, 100),
          criteria: `Contribute for ${streakTarget} days (${userStats.daysSinceJoining}/${streakTarget})`
        };
        
      case 'group_creator':
        const groupTarget = achievement.data?.groups || 1;
        return {
          unlocked: userStats.totalGroups >= groupTarget,
          progress: Math.min((userStats.totalGroups / groupTarget) * 100, 100),
          criteria: `Create ${groupTarget} group${groupTarget > 1 ? 's' : ''} (${userStats.totalGroups}/${groupTarget})`
        };
        
      case 'group_member':
        const memberTarget = achievement.data?.groups || 1;
        return {
          unlocked: userStats.totalGroups >= memberTarget,
          progress: Math.min((userStats.totalGroups / memberTarget) * 100, 100),
          criteria: `Join ${memberTarget} group${memberTarget > 1 ? 's' : ''} (${userStats.totalGroups}/${memberTarget})`
        };
        
      case 'weekly_saver':
        const weeklyTarget = achievement.data?.days || 7;
        return {
          unlocked: userStats.daysSinceJoining >= weeklyTarget,
          progress: Math.min((userStats.daysSinceJoining / weeklyTarget) * 100, 100),
          criteria: `Use app for ${weeklyTarget} days (${userStats.daysSinceJoining}/${weeklyTarget})`
        };
        
      case 'monthly_saver':
        const monthlyTarget = achievement.data?.days || 30;
        return {
          unlocked: userStats.daysSinceJoining >= monthlyTarget,
          progress: Math.min((userStats.daysSinceJoining / monthlyTarget) * 100, 100),
          criteria: `Use app for ${monthlyTarget} days (${userStats.daysSinceJoining}/${monthlyTarget})`
        };
        
      default:
        return {
          unlocked: false,
          progress: 0,
          criteria: 'Unknown criteria'
        };
    }
  }

  // Helper method to map achievement type to category
  mapTypeToCategory(type) {
    const categoryMap = {
      'first_goal': 'goals',
      'goal_completed': 'goals',
      'first_contribution': 'savings',
      'contribution_streak': 'savings',
      'savings_milestone': 'savings',
      'group_creator': 'social',
      'group_member': 'social',
      'weekly_saver': 'streaks',
      'monthly_saver': 'streaks'
    };
    
    return categoryMap[type] || 'goals';
  }

  // Check and unlock achievements for a user
  async checkAndUnlockAchievements(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const existingAchievements = await Achievement.find({ user: userId });
      const existingTypes = existingAchievements.map(a => a.type);
      
      let newlyUnlocked = 0;
      const unlockedAchievements = [];

      // Calculate user stats
      const userStats = await this.calculateUserStats(userId);

      // Check for first goal achievement
      if (!existingTypes.includes('first_goal') && userStats.totalGoals > 0) {
        const achievement = await this.awardAchievement(userId, 'first_goal');
        unlockedAchievements.push(achievement);
        newlyUnlocked++;
      }

      // Check for goal completion achievements
      if (!existingTypes.includes('goal_completed') && userStats.completedGoals > 0) {
        const achievement = await this.awardAchievement(userId, 'goal_completed', { completed: userStats.completedGoals });
        unlockedAchievements.push(achievement);
        newlyUnlocked++;
      }

      // Check for first contribution achievement
      if (!existingTypes.includes('first_contribution') && userStats.totalContributed > 0) {
        const achievement = await this.awardAchievement(userId, 'first_contribution');
        unlockedAchievements.push(achievement);
        newlyUnlocked++;
      }

      // Check for savings milestone achievements
      if (!existingTypes.includes('savings_milestone') && userStats.totalContributed >= 1000) {
        const achievement = await this.awardAchievement(userId, 'savings_milestone', { amount: userStats.totalContributed });
        unlockedAchievements.push(achievement);
        newlyUnlocked++;
      }

      // Check for account age achievements
      if (!existingTypes.includes('weekly_saver') && userStats.daysSinceJoining >= 7) {
        const achievement = await this.awardAchievement(userId, 'weekly_saver', { days: userStats.daysSinceJoining });
        unlockedAchievements.push(achievement);
        newlyUnlocked++;
      }

      if (!existingTypes.includes('monthly_saver') && userStats.daysSinceJoining >= 30) {
        const achievement = await this.awardAchievement(userId, 'monthly_saver', { days: userStats.daysSinceJoining });
        unlockedAchievements.push(achievement);
        newlyUnlocked++;
      }

      return {
        newlyUnlocked,
        unlockedAchievements,
        totalAchievements: existingAchievements.length + newlyUnlocked
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate user stats for achievements
  async calculateUserStats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          totalGoals: 0,
          completedGoals: 0,
          totalContributed: 0,
          daysSinceJoining: 0,
          totalGroups: 0
        };
      }

      // Calculate days since joining
      const daysSinceJoining = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

      // Get goals count
      const Goal = require('../models/Goal');
      const goals = await Goal.find({ user: userId });
      const completedGoals = goals.filter(goal => goal.status === 'completed').length;

      // Get total contributed (from user profile or calculate from contributions)
      const Contribution = require('../models/Contribution');
      const contributions = await Contribution.find({ user: userId });
      const totalContributed = contributions.reduce((sum, contrib) => sum + (contrib.amount || 0), 0);

      // Get groups count (created and joined)
      const Group = require('../models/Group');
      const PeerSupportGroup = require('../models/PeerSupportGroup');
      
      const createdGroups = await Group.find({ creator: userId });
      const joinedGroups = await Group.find({ members: userId });
      const createdSupportGroups = await PeerSupportGroup.find({ 'members.user': userId, 'members.role': 'creator' });
      const joinedSupportGroups = await PeerSupportGroup.find({ 'members.user': userId });
      
      const totalGroups = createdGroups.length + joinedGroups.length + createdSupportGroups.length + joinedSupportGroups.length;

      return {
        totalGoals: goals.length,
        completedGoals,
        totalContributed: user.totalContributed || totalContributed,
        daysSinceJoining,
        totalGroups
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {
        totalGoals: 0,
        completedGoals: 0,
        totalContributed: 0,
        daysSinceJoining: 0,
        totalGroups: 0
      };
    }
  }
}

module.exports = new AchievementsService(); 