const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { Achievement, UserAchievement } = require('../models/Achievement');
const { User } = require('../models/User');
const { Goal } = require('../models/Goal');

const router = Router();

/**
 * @openapi
 * /api/achievements:
 *   get:
 *     summary: Get all achievements for the current user
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user achievements
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ user: req.user.userId })
      .populate('achievement')
      .sort({ unlockedAt: -1 });

    res.json({
      success: true,
      data: userAchievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/achievements/check:
 *   post:
 *     summary: Check and unlock achievements for the current user
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Achievements checked and unlocked
 */
router.post('/check', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's goals and profile
    const [user, goals] = await Promise.all([
      User.findById(userId),
      Goal.find({ 
        $or: [
          { createdBy: userId }, 
          { 'members.user': userId }
        ] 
      })
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate user stats
    const stats = {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      totalContributed: goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0),
      groupGoals: goals.filter(g => g.isGroupGoal).length,
      daysSinceJoining: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
    };

    // Get all available achievements
    const allAchievements = await Achievement.find({ isActive: true });
    
    // Get user's existing achievements
    const existingAchievements = await UserAchievement.find({ user: userId });
    const existingAchievementIds = existingAchievements.map(ua => ua.achievement.toString());

    const newlyUnlocked = [];

    // Check each achievement
    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (existingAchievementIds.includes(achievement._id.toString())) {
        continue;
      }

      let shouldUnlock = false;
      let progress = 0;

      // Check achievement criteria
      switch (achievement.type) {
        case 'first_goal':
          shouldUnlock = stats.totalGoals >= 1;
          progress = Math.min((stats.totalGoals / 1) * 100, 100);
          break;

        case 'goal_completed':
          shouldUnlock = stats.completedGoals >= achievement.criteria.goalsCompleted;
          progress = Math.min((stats.completedGoals / achievement.criteria.goalsCompleted) * 100, 100);
          break;

        case 'contribution_milestone':
          shouldUnlock = stats.totalContributed >= achievement.criteria.totalContributed;
          progress = Math.min((stats.totalContributed / achievement.criteria.totalContributed) * 100, 100);
          break;

        case 'streak_milestone':
          shouldUnlock = stats.daysSinceJoining >= achievement.criteria.streakDays;
          progress = Math.min((stats.daysSinceJoining / achievement.criteria.streakDays) * 100, 100);
          break;

        case 'team_player':
          shouldUnlock = stats.groupGoals >= achievement.criteria.groupMembers;
          progress = Math.min((stats.groupGoals / achievement.criteria.groupMembers) * 100, 100);
          break;

        default:
          shouldUnlock = false;
          progress = 0;
      }

      if (shouldUnlock) {
        // Create user achievement record
        const userAchievement = new UserAchievement({
          user: userId,
          achievement: achievement._id,
          unlockedAt: new Date(),
          progress: 100,
          isUnlocked: true
        });

        await userAchievement.save();
        newlyUnlocked.push(achievement);
      } else if (progress > 0) {
        // Create or update progress record
        await UserAchievement.findOneAndUpdate(
          { user: userId, achievement: achievement._id },
          { progress, isUnlocked: false },
          { upsert: true, new: true }
        );
      }
    }

    // Get updated user achievements
    const updatedAchievements = await UserAchievement.find({ user: userId })
      .populate('achievement')
      .sort({ unlockedAt: -1 });

    res.json({
      success: true,
      data: updatedAchievements,
      newlyUnlocked: newlyUnlocked.length,
      message: newlyUnlocked.length > 0 ? `Unlocked ${newlyUnlocked.length} new achievements!` : 'No new achievements unlocked'
    });

  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/achievements/progress:
 *   get:
 *     summary: Get achievement progress for the current user
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Achievement progress data
 */
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's goals
    const goals = await Goal.find({ 
      $or: [
        { createdBy: userId }, 
        { 'members.user': userId }
      ] 
    });

    // Calculate stats
    const stats = {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      totalContributed: goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0),
      groupGoals: goals.filter(g => g.isGroupGoal).length
    };

    // Get all achievements with user progress
    const allAchievements = await Achievement.find({ isActive: true });
    const userAchievements = await UserAchievement.find({ user: userId });
    
    const progressData = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => 
        ua.achievement.toString() === achievement._id.toString()
      );

      let progress = 0;
      let isUnlocked = false;

      if (userAchievement) {
        progress = userAchievement.progress;
        isUnlocked = userAchievement.isUnlocked;
      } else {
        // Calculate progress based on current stats
        switch (achievement.type) {
          case 'first_goal':
            progress = Math.min((stats.totalGoals / 1) * 100, 100);
            break;
          case 'goal_completed':
            progress = Math.min((stats.completedGoals / achievement.criteria.goalsCompleted) * 100, 100);
            break;
          case 'contribution_milestone':
            progress = Math.min((stats.totalContributed / achievement.criteria.totalContributed) * 100, 100);
            break;
          case 'team_player':
            progress = Math.min((stats.groupGoals / achievement.criteria.groupMembers) * 100, 100);
            break;
        }
      }

      return {
        achievement,
        progress,
        isUnlocked,
        unlockedAt: userAchievement?.unlockedAt
      };
    });

    res.json({
      success: true,
      data: progressData,
      stats
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 