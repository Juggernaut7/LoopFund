// Dashboard service for fetching real data from backend
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = 'http://localhost:4000/api';

class DashboardService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from auth store
  getAuthToken() {
    const token = useAuthStore.getState().token;
    return token || localStorage.getItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getAuthToken();
    console.log('🔑 DashboardService: Getting auth headers');
    console.log('🔑 DashboardService: Token available:', !!token);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
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

  // Fetch user achievements
  async getUserAchievements() {
    try {
      const response = await fetch(`${this.baseURL}/achievements`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }

  // Check and unlock achievements
  async checkAchievements() {
    try {
      const response = await fetch(`${this.baseURL}/achievements/check`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to check achievements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Get achievement progress
  async getAchievementProgress() {
    try {
      const response = await fetch(`${this.baseURL}/achievements/progress`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch achievement progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching achievement progress:', error);
      throw error;
    }
  }

  // Fetch dashboard analytics
  async getDashboardAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/analytics/dashboard`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  // Fetch goal analytics
  async getGoalAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/analytics/goals`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goal analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching goal analytics:', error);
      throw error;
    }
  }

  // Fetch contribution analytics
  async getContributionAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/analytics/contributions`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contribution analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching contribution analytics:', error);
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

  // Replace the getDashboardStats method with this simpler version
  async getDashboardStats() {
    try {
      console.log('🔑 Fetching dashboard stats...');
      
      // Get user's goals first
      const goalsResponse = await this.getUserGoals();
      const goals = goalsResponse.data || [];
      console.log('🎯 Found goals:', goals.length);
      
      // Get all contributions by fetching from each goal
      const allContributions = [];
      
      for (const goal of goals) {
        try {
          console.log(`🔍 Fetching contributions for goal: ${goal.name}`);
          const contributionsResponse = await fetch(`${this.baseURL}/contributions/goal/${goal._id}`, {
            headers: this.getAuthHeaders()
          });
          
          if (contributionsResponse.ok) {
            const contributionsData = await contributionsResponse.json();
            const contributions = contributionsData.data || [];
            console.log(`💰 Found ${contributions.length} contributions for goal ${goal.name}`);
            allContributions.push(...contributions);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to fetch contributions for goal ${goal._id}:`, error);
        }
      }
      
      console.log('📊 Total contributions found:', allContributions.length);
      console.log('💰 Contribution amounts:', allContributions.map(c => c.amount));
      
      // Calculate stats
      const totalContributed = allContributions.reduce((sum, contrib) => sum + (contrib.amount || 0), 0);
      const totalContributions = allContributions.length;
      const averageContribution = totalContributions > 0 ? totalContributed / totalContributions : 0;
      
      // Get this month's contributions
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthContributions = allContributions.filter(contrib => 
        new Date(contrib.createdAt) >= startOfMonth
      );
      const thisMonthTotal = thisMonthContributions.reduce((sum, contrib) => sum + (contrib.amount || 0), 0);

      const activeGoals = goals.filter(goal => !goal.isCompleted).length;
      
      // Calculate overall progress
      const totalGoalAmount = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
      const totalCurrentAmount = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
      const completionRate = totalGoalAmount > 0 ? (totalCurrentAmount / totalGoalAmount) * 100 : 0;

      // Get user profile
      const profileResponse = await this.getUserProfile();
      const user = profileResponse.data;

      const stats = {
        totalContributed,
        totalContributions,
        averageContribution: Math.round(averageContribution * 100) / 100,
        thisMonth: thisMonthTotal,
        activeGoals,
        completionRate: Math.round(completionRate * 100) / 100,
        totalSaved: totalContributed,
        groupSavings: 0,
        individualSavings: totalContributed
      };

      console.log('📈 Calculated stats:', stats);

      return {
        success: true,
        data: {
          stats,
          profile: user,
          goals: goals.slice(0, 4),
          recentContributions: allContributions.slice(0, 5).map(contrib => ({
            _id: contrib._id,
            amount: contrib.amount,
            goalName: contrib.goalName || 'General Savings',
            goalType: contrib.goalType || 'individual',
            createdAt: contrib.createdAt
          }))
        }
      };

    } catch (error) {
      console.error('❌ Dashboard service error:', error);
      throw error;
    }
  }

  // Add method to fetch real contribution data
  async getContributionStats() {
    try {
      const response = await fetch(`${this.baseURL}/contributions/stats`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contribution stats');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Contribution stats error:', error);
      throw error;
    }
  }

  // Add method to fetch recent contributions
  async getRecentContributions() {
    try {
      const response = await fetch(`${this.baseURL}/contributions?limit=5`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent contributions');
      }

      const data = await response.json();
      return data.contributions || [];
    } catch (error) {
      console.error('Recent contributions error:', error);
      return [];
    }
  }
}

export default new DashboardService(); 