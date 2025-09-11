const therapyGameService = require('../services/therapyGame.service');

// Save game score
const saveGameScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    const gameData = req.body;

    const savedScore = await therapyGameService.saveGameScore(userId, gameData);

    res.status(201).json({
      success: true,
      message: 'Game score saved successfully',
      data: savedScore
    });
  } catch (error) {
    console.error('Error saving game score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save game score',
      error: error.message
    });
  }
};

// Get user's game history
const getUserGameHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const gameHistory = await therapyGameService.getUserGameHistory(userId);

    res.json({
      success: true,
      data: gameHistory
    });
  } catch (error) {
    console.error('Error getting user game history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get game history',
      error: error.message
    });
  }
};

// Get user's stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await therapyGameService.getUserStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats',
      error: error.message
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await therapyGameService.getLeaderboard(parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error.message
    });
  }
};

// Get user's rank
const getUserRank = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rank = await therapyGameService.getUserRank(userId);

    res.json({
      success: true,
      data: { rank }
    });
  } catch (error) {
    console.error('Error getting user rank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user rank',
      error: error.message
    });
  }
};

// Get game-specific leaderboard
const getGameLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10 } = req.query;
    const leaderboard = await therapyGameService.getGameLeaderboard(gameId, parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error getting game leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get game leaderboard',
      error: error.message
    });
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const recentActivity = await therapyGameService.getRecentActivity(parseInt(limit));

    res.json({
      success: true,
      data: recentActivity
    });
  } catch (error) {
    console.error('Error getting recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent activity',
      error: error.message
    });
  }
};

module.exports = {
  saveGameScore,
  getUserGameHistory,
  getUserStats,
  getLeaderboard,
  getUserRank,
  getGameLeaderboard,
  getRecentActivity
};
