const { Achievement } = require('../models/Achievement');
const { User } = require('../models/User');

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
      // For now, return empty progress data
      // You can implement actual progress calculation later
      return [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AchievementsService(); 