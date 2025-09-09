import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class CommunityService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // AI Financial Therapist Methods
  async initializeFinancialTherapist() {
    try {
      const response = await this.api.post('/enhanced-community/therapist/initialize');
      return response.data;
    } catch (error) {
      console.error('Error initializing financial therapist:', error);
      throw error;
    }
  }

  async analyzeEmotionalSpending(spendingData) {
    try {
      const response = await this.api.post('/enhanced-community/therapist/analyze-spending', spendingData);
      return response.data;
    } catch (error) {
      console.error('Error analyzing emotional spending:', error);
      throw error;
    }
  }

  async startTherapySession(sessionType) {
    try {
      const response = await this.api.post('/enhanced-community/therapist/session', { sessionType });
      return response.data;
    } catch (error) {
      console.error('Error starting therapy session:', error);
      throw error;
    }
  }

  async getPredictiveInsights() {
    try {
      const response = await this.api.get('/enhanced-community/therapist/insights');
      return response.data;
    } catch (error) {
      console.error('Error getting predictive insights:', error);
      throw error;
    }
  }

  // Community Posts
  async getPosts(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      const response = await this.api.get(`/community?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async createPost(postData) {
    try {
      const response = await this.api.post('/community', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async likePost(postId) {
    try {
      const response = await this.api.post(`/community/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async addComment(postId, commentData) {
    try {
      const response = await this.api.post(`/community/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Community Challenges
  async getChallenges(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      const response = await this.api.get(`/enhanced-community/challenges?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  }

  async createChallenge(challengeData) {
    try {
      const response = await this.api.post('/enhanced-community/challenges', challengeData);
      return response.data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  async joinChallenge(challengeId) {
    try {
      const response = await this.api.post(`/enhanced-community/challenges/${challengeId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  async leaveChallenge(challengeId) {
    try {
      const response = await this.api.post(`/enhanced-community/challenges/${challengeId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving challenge:', error);
      throw error;
    }
  }

  async updateChallengeProgress(challengeId, progress, milestone) {
    try {
      const response = await this.api.put(`/enhanced-community/challenges/${challengeId}/progress`, {
        progress,
        milestone
      });
      return response.data;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }

  async addChallengeCheckIn(challengeId, checkInData) {
    try {
      const response = await this.api.post(`/enhanced-community/challenges/${challengeId}/checkin`, checkInData);
      return response.data;
    } catch (error) {
      console.error('Error adding challenge check-in:', error);
      throw error;
    }
  }

  // Peer Support Groups
  async getGroups(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      const response = await this.api.get(`/enhanced-community/groups?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }

  async createGroup(groupData) {
    try {
      console.log('API: Creating group with data:', groupData);
      const response = await this.api.post('/enhanced-community/groups', groupData);
      console.log('API: Group creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }

  // Group Discussions
  async getGroupDiscussions(groupId, page = 1, limit = 20) {
    try {
      const response = await this.api.get(`/enhanced-community/groups/${groupId}/discussions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group discussions:', error);
      throw error;
    }
  }

  async addGroupDiscussion(groupId, discussionData) {
    try {
      const response = await this.api.post(`/enhanced-community/groups/${groupId}/discussions`, discussionData);
      return response.data;
    } catch (error) {
      console.error('Error adding group discussion:', error);
      throw error;
    }
  }

  async addDiscussionReply(groupId, discussionId, content) {
    try {
      const response = await this.api.post(`/enhanced-community/groups/${groupId}/discussions/${discussionId}/replies`, { content });
      return response.data;
    } catch (error) {
      console.error('Error adding discussion reply:', error);
      throw error;
    }
  }

  async joinGroup(groupId) {
    try {
      const response = await this.api.post(`/enhanced-community/groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }

  async leaveGroup(groupId) {
    try {
      const response = await this.api.post(`/enhanced-community/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  async addGroupResource(groupId, resourceData) {
    try {
      const response = await this.api.post(`/enhanced-community/groups/${groupId}/resources`, resourceData);
      return response.data;
    } catch (error) {
      console.error('Error adding group resource:', error);
      throw error;
    }
  }

  async addGroupEvent(groupId, eventData) {
    try {
      const response = await this.api.post(`/enhanced-community/groups/${groupId}/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error adding group event:', error);
      throw error;
    }
  }

  // Enhanced Features
  async getPersonalizedFeed(page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      const response = await this.api.get(`/enhanced-community/feed/personalized?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personalized feed:', error);
      throw error;
    }
  }

  async getRecommendations() {
    try {
      const response = await this.api.get('/enhanced-community/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  // Advanced Search
  async advancedSearch(searchParams) {
    try {
      const params = new URLSearchParams({
        q: searchParams.q,
        type: searchParams.type,
        page: searchParams.page.toString(),
        limit: searchParams.limit.toString(),
        ...searchParams.filters
      });
      const response = await this.api.get(`/enhanced-community/search/advanced?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw error;
    }
  }

  // Analytics
  async getEngagementAnalytics(period = '30d') {
    try {
      const response = await this.api.get(`/enhanced-community/analytics/engagement?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching engagement analytics:', error);
      throw error;
    }
  }

  async getEmotionalTrends(period = '30d') {
    try {
      const response = await this.api.get(`/enhanced-community/analytics/emotional-trends?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching emotional trends:', error);
      throw error;
    }
  }

  async getCommunityHealthMetrics() {
    try {
      const response = await this.api.get('/enhanced-community/analytics/community-health');
      return response.data;
    } catch (error) {
      console.error('Error fetching community health metrics:', error);
      throw error;
    }
  }

  // Trending and Discovery
  async getTrendingPosts(limit = 5) {
    try {
      const response = await this.api.get(`/enhanced-community/trending/ai-powered?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }
  }

  async findCompatibleUsers(limit = 5) {
    try {
      const response = await this.api.get(`/enhanced-community/matching/users?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error finding compatible users:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async searchPosts(query, limit = 10) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      });
      const response = await this.api.get(`/community/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  async getCommunityStats() {
    try {
      const response = await this.api.get('/community/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching community stats:', error);
      throw error;
    }
  }

  // Utility methods for components
  formatPostDate(date) {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  getCategoryColor(category) {
    const colors = {
      'success_story': 'text-green-600',
      'struggle_share': 'text-red-600',
      'tips_advice': 'text-blue-600',
      'goal_update': 'text-purple-600',
      'emotional_support': 'text-pink-600',
      'financial_education': 'text-indigo-600',
      'habit_tracking': 'text-yellow-600',
      'celebration': 'text-orange-600',
      'question': 'text-gray-600',
      'motivation': 'text-teal-600'
    };
    return colors[category] || 'text-gray-600';
  }

  getMoodIcon(mood) {
    const icons = {
      'excited': '😃',
      'hopeful': '🤗',
      'stressed': '😰',
      'frustrated': '😤',
      'proud': '😌',
      'anxious': '😟',
      'grateful': '🙏',
      'determined': '💪'
    };
    return icons[mood] || '😊';
  }

  getMoodColor(mood) {
    const colors = {
      'excited': 'text-green-600',
      'hopeful': 'text-blue-600',
      'stressed': 'text-red-600',
      'frustrated': 'text-orange-600',
      'proud': 'text-purple-600',
      'anxious': 'text-yellow-600',
      'grateful': 'text-teal-600',
      'determined': 'text-indigo-600'
    };
    return colors[mood] || 'text-gray-600';
  }

  // Socket methods for real-time features
  initializeSocket(token, onConnect, onDisconnect) {
    // This would be implemented with a real WebSocket library
    console.log('Socket initialization would happen here');
    return null;
  }

  setupSocketHandlers(socket, handlers) {
    // This would set up socket event handlers
    console.log('Socket handlers would be set up here');
  }

  emitCreatePost(socket, postData) {
    // This would emit a create post event
    console.log('Create post event would be emitted here');
  }

  emitToggleLike(socket, postId) {
    // This would emit a toggle like event
    console.log('Toggle like event would be emitted here');
  }
}

const communityService = new CommunityService();
export default communityService; 