import api from './api';

const therapyGameService = {
  // Save game score
  async saveGameScore(gameData) {
    return api.post('/therapy-games/score', gameData);
  },

  // Get user's game history
  async getUserGameHistory() {
    return api.get('/therapy-games/history');
  },

  // Get user's stats
  async getUserStats() {
    return api.get('/therapy-games/stats');
  },

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    return api.get(`/therapy-games/leaderboard?limit=${limit}`);
  },

  // Get user's rank
  async getUserRank() {
    return api.get('/therapy-games/rank');
  },

  // Get game-specific leaderboard
  async getGameLeaderboard(gameId, limit = 10) {
    return api.get(`/therapy-games/leaderboard/${gameId}?limit=${limit}`);
  },

  // Get recent activity
  async getRecentActivity(limit = 20) {
    return api.get(`/therapy-games/recent-activity?limit=${limit}`);
  }
};

export default therapyGameService;
