
const achievementsService = require('../services/achievements.service');

const getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const achievements = await achievementsService.getUserAchievements(userId);
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

const getAchievementProgress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log('🎯 getAchievementProgress - User ID:', userId);
    console.log('🎯 getAchievementProgress - User object:', req.user);
    
    const progress = await achievementsService.getAchievementProgress(userId);
    console.log('🎯 getAchievementProgress - Progress data:', progress);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('❌ getAchievementProgress error:', error);
    next(error);
  }
};

const getAchievementDetails = async (req, res, next) => {
  try {
    const { achievementId } = req.params;
    const achievement = await achievementsService.getAchievementDetails(achievementId);
    
    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

const checkAchievements = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await achievementsService.checkAndUnlockAchievements(userId);
    
    res.json({
      success: true,
      data: result,
      message: result.newlyUnlocked > 0 ? `Unlocked ${result.newlyUnlocked} new achievements!` : 'No new achievements unlocked'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserAchievements,
  getAchievementProgress,
  getAchievementDetails,
  checkAchievements
}; 