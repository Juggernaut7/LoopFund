// Dashboard service for fetching real data from backend
const API_BASE_URL = 'http://localhost:4000/api';

class DashboardService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    console.log('🔑 DashboardService: Getting auth headers');
    console.log('🔑 DashboardService: Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    console.log('🔑 DashboardService: Final headers:', headers);
    return headers;
  }

  // Fetch user profile
  async getUserProfile() {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Fetch user goals
  async getUserGoals() {
    try {
      const response = await fetch(`${this.baseURL}/goals`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user goals');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user goals:', error);
      throw error;
    }
  }

  // Fetch user groups
  async getUserGroups() {
    try {
      const response = await fetch(`${this.baseURL}/groups`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user groups');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  }

  // Fetch contributions for a specific goal
  async getGoalContributions(goalId) {
    try {
      const response = await fetch(`${this.baseURL}/contributions/${goalId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goal contributions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching goal contributions:', error);
      throw error;
    }
  }

  // Fetch all contributions for user
  async getAllContributions() {
    try {
      // Since we don't have a direct endpoint for all user contributions,
      // we'll fetch goals first, then get contributions for each goal
      const goals = await this.getUserGoals();
      const allContributions = [];

      for (const goal of goals.data || []) {
        try {
          const contributions = await this.getGoalContributions(goal._id);
          if (contributions.data) {
            allContributions.push(...contributions.data);
          }
        } catch (error) {
          console.warn(`Failed to fetch contributions for goal ${goal._id}:`, error);
        }
      }

      return { data: allContributions };
    } catch (error) {
      console.error('Error fetching all contributions:', error);
      throw error;
    }
  }

  // Calculate dashboard statistics
  async getDashboardStats() {
    try {
      const [goals, contributions, profile] = await Promise.all([
        this.getUserGoals(),
        this.getAllContributions(),
        this.getUserProfile()
      ]);

      // Calculate total saved from goals
      const totalSaved = (goals.data || []).reduce((sum, goal) => {
        return sum + (goal.currentAmount || 0);
      }, 0);

      // Calculate total target from goals
      const totalTarget = (goals.data || []).reduce((sum, goal) => {
        return sum + (goal.targetAmount || 0);
      }, 0);

      // Calculate individual vs group savings
      const individualGoals = (goals.data || []).filter(goal => goal.type === 'individual');
      const groupGoals = (goals.data || []).filter(goal => goal.type === 'group');

      const individualSavings = individualGoals.reduce((sum, goal) => {
        return sum + (goal.currentAmount || 0);
      }, 0);

      const groupSavings = groupGoals.reduce((sum, goal) => {
        return sum + (goal.currentAmount || 0);
      }, 0);

      // Calculate recent activity
      const recentContributions = (contributions.data || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return {
        stats: {
          totalSaved,
          totalTarget,
          activeGoals: goals.data?.length || 0,
          individualSavings,
          groupSavings,
          completionRate: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0
        },
        goals: goals.data || [],
        contributions: contributions.data || [],
        recentContributions,
        profile: profile.user || {}
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export default new DashboardService(); 