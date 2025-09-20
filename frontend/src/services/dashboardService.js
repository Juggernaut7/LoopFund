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
    console.log('🔑 DashboardService: Token value:', token ? token.substring(0, 20) + '...' : 'null');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    console.log('🔑 DashboardService: Headers:', headers);
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
      console.log('🔄 Fetching user achievements from:', `${this.baseURL}/achievements`);
      const headers = this.getAuthHeaders();
      console.log('🔑 Using headers:', headers);
      
      const response = await fetch(`${this.baseURL}/achievements`, {
        headers: headers
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`Failed to fetch user achievements: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ User achievements data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching user achievements:', error);
      console.error('❌ Error details:', error.message);
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
      console.log('🔄 Fetching achievement progress from:', `${this.baseURL}/achievements/progress`);
      const headers = this.getAuthHeaders();
      console.log('🔑 Using headers:', headers);
      
      const response = await fetch(`${this.baseURL}/achievements/progress`, {
        headers: headers
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`Failed to fetch achievement progress: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Achievement progress data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching achievement progress:', error);
      console.error('❌ Error details:', error.message);
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

  // Get dashboard stats using the new analytics service
  async getDashboardStats() {
    try {
      console.log('🔑 Fetching dashboard stats from analytics service...');
      
      // Use the analytics service that includes Paystack contributions
      const analyticsResponse = await fetch(`${this.baseURL}/analytics/user`, {
        headers: this.getAuthHeaders()
      });

      console.log('📊 Analytics response status:', analyticsResponse.status);

      if (!analyticsResponse.ok) {
        const errorText = await analyticsResponse.text();
        console.error('❌ Analytics response error:', errorText);
        throw new Error(`Failed to fetch analytics data: ${analyticsResponse.status}`);
      }

      const analyticsData = await analyticsResponse.json();
      console.log('📊 Analytics data received:', analyticsData);

      if (!analyticsData.success) {
        console.error('❌ Analytics data not successful:', analyticsData.error);
        throw new Error(analyticsData.error || 'Failed to fetch analytics');
      }

      const { summary, goals, recentActivity } = analyticsData.data;

      // Get user profile
      const profileResponse = await this.getUserProfile();
      const user = profileResponse.data;

      const stats = {
        totalContributed: summary.totalSaved || 0,
        totalContributions: summary.totalContributions || 0,
        averageContribution: summary.averageContribution || 0,
        thisMonth: summary.thisMonth || 0,
        activeGoals: summary.activeGoals || 0,
        completionRate: summary.completionRate || 0,
        totalSaved: summary.totalSaved || 0,
        groupSavings: summary.groupContributions || 0,
        individualSavings: summary.soloSavings || 0
      };

      console.log('📈 Dashboard stats calculated:', stats);

      return {
        success: true,
        data: {
          stats,
          profile: user,
          goals: goals?.slice(0, 4) || [],
          recentContributions: recentActivity?.slice(0, 5) || []
        }
      };

    } catch (error) {
      console.error('❌ Dashboard service error:', error);
      
      // Fallback to basic stats if analytics fails
      console.log('🔄 Falling back to basic stats calculation...');
      try {
        const goalsResponse = await this.getUserGoals();
        const goals = goalsResponse.data || [];
        
        const stats = {
          totalContributed: 0,
          totalContributions: 0,
          averageContribution: 0,
          thisMonth: 0,
          activeGoals: goals.filter(g => g.isActive !== false).length,
          completionRate: 0,
          totalSaved: 0,
          groupSavings: 0,
          individualSavings: 0
        };

        const profileResponse = await this.getUserProfile();
        const user = profileResponse.data;

        return {
          success: true,
          data: {
            stats,
            profile: user,
            goals: goals.slice(0, 4),
            recentContributions: []
          }
        };
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw error; // Throw original error
      }
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