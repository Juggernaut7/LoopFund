import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    signup: '/auth/signup',
    signin: '/auth/signin',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
  },
  
  // User
  user: {
    profile: '/auth/profile',
    updateProfile: '/auth/profile',
    preferences: '/user/preferences',
    notificationSettings: '/user/notifications',
  },
  
  // Goals
  goals: {
    list: '/goals',
    create: '/goals',
    update: (id) => `/goals/${id}`,
    delete: (id) => `/goals/${id}`,
    details: (id) => `/goals/${id}`,
    contributions: (id) => `/goals/${id}/contributions`,
    addContribution: (id) => `/goals/${id}/contributions`,
  },
  
  // Groups
  groups: {
    list: '/groups',
    create: '/groups',
    update: (id) => `/groups/${id}`,
    delete: (id) => `/groups/${id}`,
    details: (id) => `/groups/${id}`,
    join: (id) => `/groups/${id}/join`,
    leave: (id) => `/groups/${id}/leave`,
    invite: (id) => `/groups/${id}/invite`,
    members: (id) => `/groups/${id}/members`,
  },
  
  // Contributions
  contributions: {
    list: '/contributions',
    create: '/contributions',
    update: (id) => `/contributions/${id}`,
    delete: (id) => `/contributions/${id}`,
    history: '/contributions/history',
    scheduled: '/contributions/scheduled',
  },
  
  // Analytics
  analytics: {
    overview: '/analytics/overview',
    individual: '/analytics/individual',
    groups: '/analytics/groups',
    insights: '/analytics/insights',
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
  },
  
  // AI
  ai: {
    advice: '/ai/advice',
    predict: '/ai/predict',
    goals: '/ai/goals',
    behavior: '/ai/behavior',
    therapy: {
      session: '/ai/therapy/session',
      analyzeEmotion: '/ai/therapy/analyze-emotion',
      interventions: '/ai/therapy/interventions',
      progress: '/ai/therapy/progress',
    },
    predictive: {
      forecast: '/ai/predictive/forecast',
      crisisAlerts: '/ai/predictive/crisis-alerts',
      opportunityCosts: '/ai/predictive/opportunity-costs',
      lifeEvents: '/ai/predictive/life-events',
    },
    community: {
      analyzePost: '/ai/community/analyze-post',
      recommendations: '/ai/community/recommendations',
      successStories: '/ai/community/success-stories',
    },
    interventions: {
      trigger: '/ai/interventions/trigger',
      pause: '/ai/interventions/pause',
      habitStacking: '/ai/interventions/habit-stacking',
    },
    games: {
      anxietyReduction: '/ai/games/anxiety-reduction',
      triggerIdentification: '/ai/games/trigger-identification',
      mindsetTransformation: '/ai/games/mindset-transformation',
      confidenceBuilding: '/ai/games/confidence-building',
    },
  },
  
  // Health check
  health: '/health',
  test: '/test',
};

// API methods
export const apiService = {
  // Generic methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
  
  // Auth methods
  signup: (userData) => api.post(endpoints.auth.signup, userData),
  signin: (credentials) => api.post(endpoints.auth.signin, credentials),
  forgotPassword: (email) => api.post(endpoints.auth.forgotPassword, { email }),
  resetPassword: (token, password) => api.post(endpoints.auth.resetPassword, { token, password }),
  
  // User methods
  getUserProfile: () => api.get(endpoints.user.profile),
  updateUserProfile: (profileData) => api.put(endpoints.user.updateProfile, profileData),
  
  // Goals methods
  getGoals: (params) => api.get(endpoints.goals.list, { params }),
  createGoal: (goalData) => api.post(endpoints.goals.create, goalData),
  updateGoal: (id, goalData) => api.put(endpoints.goals.update(id), goalData),
  deleteGoal: (id) => api.delete(endpoints.goals.delete(id)),
  getGoalDetails: (id) => api.get(endpoints.goals.details(id)),
  
  // Groups methods
  getGroups: (params) => api.get(endpoints.groups.list, { params }),
  createGroup: (groupData) => api.post(endpoints.groups.create, groupData),
  updateGroup: (id, groupData) => api.put(endpoints.groups.update(id), groupData),
  deleteGroup: (id) => api.delete(endpoints.groups.delete(id)),
  getGroupDetails: (id) => api.get(endpoints.groups.details(id)),
  
  // AI methods
  getAIAdvice: (query, userProfile, context) => api.post(endpoints.ai.advice, { query, userProfile, context }),
  getAIPrediction: (data) => api.post(endpoints.ai.predict, data),
  getAIGoals: (data) => api.post(endpoints.ai.goals, data),
  analyzeBehavior: (data) => api.post(endpoints.ai.behavior, data),
  
  // Health check
  healthCheck: () => api.get(endpoints.health),
  testEndpoint: () => api.get(endpoints.test),
};

export default api; 