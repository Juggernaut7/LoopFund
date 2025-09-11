const TherapyGameScore = require('../models/TherapyGameScore');
const User = require('../models/User');

class TherapyGameService {
  // Save a game score
  async saveGameScore(userId, gameData) {
    try {
      const {
        gameId,
        gameTitle,
        score,
        totalPoints,
        accuracy,
        timeSpent,
        questionsAnswered,
        correctAnswers,
        difficulty,
        isPerfect,
        timeBonus
      } = gameData;

      const gameScore = new TherapyGameScore({
        user: userId,
        gameId,
        gameTitle,
        score,
        totalPoints,
        accuracy,
        timeSpent,
        questionsAnswered,
        correctAnswers,
        difficulty,
        isPerfect,
        timeBonus
      });

      await gameScore.save();
      return gameScore;
    } catch (error) {
      throw new Error(`Failed to save game score: ${error.message}`);
    }
  }

  // Get user's game history
  async getUserGameHistory(userId) {
    try {
      const gameHistory = await TherapyGameScore.find({ user: userId })
        .sort({ completedAt: -1 })
        .populate('user', 'firstName lastName email');

      return gameHistory;
    } catch (error) {
      throw new Error(`Failed to get user game history: ${error.message}`);
    }
  }

  // Get user's total score and stats
  async getUserStats(userId) {
    try {
      const stats = await TherapyGameScore.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalGames: { $sum: 1 },
            totalScore: { $sum: '$totalPoints' },
            totalTime: { $sum: '$timeSpent' },
            perfectGames: { $sum: { $cond: ['$isPerfect', 1, 0] } },
            averageAccuracy: { $avg: '$accuracy' },
            bestScore: { $max: '$totalPoints' },
            gamesPlayed: { $addToSet: '$gameId' }
          }
        },
        {
          $project: {
            totalGames: 1,
            totalScore: 1,
            totalTime: 1,
            perfectGames: 1,
            averageAccuracy: { $round: ['$averageAccuracy', 2] },
            bestScore: 1,
            uniqueGamesPlayed: { $size: '$gamesPlayed' }
          }
        }
      ]);

      return stats[0] || {
        totalGames: 0,
        totalScore: 0,
        totalTime: 0,
        perfectGames: 0,
        averageAccuracy: 0,
        bestScore: 0,
        uniqueGamesPlayed: 0
      };
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    try {
      // Get top users by total score
      const leaderboard = await TherapyGameScore.aggregate([
        {
          $group: {
            _id: '$user',
            totalScore: { $sum: '$totalPoints' },
            totalGames: { $sum: 1 },
            perfectGames: { $sum: { $cond: ['$isPerfect', 1, 0] } },
            averageAccuracy: { $avg: '$accuracy' },
            lastPlayed: { $max: '$completedAt' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $unwind: '$userInfo'
        },
        {
          $project: {
            userId: '$_id',
            name: {
              $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName']
            },
            totalScore: 1,
            totalGames: 1,
            perfectGames: 1,
            averageAccuracy: { $round: ['$averageAccuracy', 2] },
            lastPlayed: 1
          }
        },
        {
          $sort: { totalScore: -1, lastPlayed: -1 }
        },
        {
          $limit: limit
        }
      ]);

      // Add rank to each user
      const rankedLeaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }));

      return rankedLeaderboard;
    } catch (error) {
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  // Get user's rank
  async getUserRank(userId) {
    try {
      const userStats = await this.getUserStats(userId);
      
      if (userStats.totalScore === 0) {
        return null; // User hasn't played any games
      }

      const leaderboard = await this.getLeaderboard(1000); // Get more users to find rank
      const userRank = leaderboard.findIndex(user => user.userId.toString() === userId.toString());
      
      return userRank >= 0 ? userRank + 1 : null;
    } catch (error) {
      throw new Error(`Failed to get user rank: ${error.message}`);
    }
  }

  // Get game-specific leaderboard
  async getGameLeaderboard(gameId, limit = 10) {
    try {
      const gameLeaderboard = await TherapyGameScore.aggregate([
        { $match: { gameId } },
        {
          $group: {
            _id: '$user',
            bestScore: { $max: '$totalPoints' },
            totalAttempts: { $sum: 1 },
            bestAccuracy: { $max: '$accuracy' },
            bestTime: { $min: '$timeSpent' },
            lastPlayed: { $max: '$completedAt' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $unwind: '$userInfo'
        },
        {
          $project: {
            userId: '$_id',
            name: {
              $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName']
            },
            bestScore: 1,
            totalAttempts: 1,
            bestAccuracy: 1,
            bestTime: 1,
            lastPlayed: 1
          }
        },
        {
          $sort: { bestScore: -1, bestTime: 1 }
        },
        {
          $limit: limit
        }
      ]);

      return gameLeaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
    } catch (error) {
      throw new Error(`Failed to get game leaderboard: ${error.message}`);
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 20) {
    try {
      const recentActivity = await TherapyGameScore.find()
        .sort({ completedAt: -1 })
        .limit(limit)
        .populate('user', 'firstName lastName')
        .select('user gameTitle totalPoints accuracy completedAt isPerfect');

      return recentActivity;
    } catch (error) {
      throw new Error(`Failed to get recent activity: ${error.message}`);
    }
  }
}

module.exports = new TherapyGameService();
