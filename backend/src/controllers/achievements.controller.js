
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
    const progress = await achievementsService.getAchievementProgress(userId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
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

module.exports = {
  getUserAchievements,
  getAchievementProgress,
  getAchievementDetails
}; 