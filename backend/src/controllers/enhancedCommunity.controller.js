const enhancedCommunityService = require('../services/enhancedCommunity.service');

// AI Financial Therapist Controllers
const initializeFinancialTherapist = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await enhancedCommunityService.initializeFinancialTherapist(userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in initializeFinancialTherapist controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const analyzeEmotionalSpending = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const spendingData = req.body;
    
    const result = await enhancedCommunityService.analyzeEmotionalSpending(userId, spendingData);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in analyzeEmotionalSpending controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const startTherapySession = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { sessionType } = req.body;
    
    const result = await enhancedCommunityService.startTherapySession(userId, sessionType);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in startTherapySession controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getPredictiveInsights = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await enhancedCommunityService.getPredictiveInsights(userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getPredictiveInsights controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getTherapistProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await enhancedCommunityService.getTherapistProfile(userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getTherapistProfile controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const updateWellnessMetrics = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const metrics = req.body;
    
    const result = await enhancedCommunityService.updateWellnessMetrics(userId, metrics);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in updateWellnessMetrics controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Enhanced Community Controllers
const getPersonalizedCommunityFeed = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await enhancedCommunityService.getPersonalizedCommunityFeed(userId, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getPersonalizedCommunityFeed controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getCommunityRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const result = await enhancedCommunityService.getCommunityRecommendations(userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getCommunityRecommendations controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const createEnhancedPost = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const postData = req.body;
    
    const result = await enhancedCommunityService.createEnhancedPost(postData, userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createEnhancedPost controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Community Challenges Controllers
const createCommunityChallenge = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const challengeData = req.body;
    
    const result = await enhancedCommunityService.createCommunityChallenge(challengeData, userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createCommunityChallenge controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getCommunityChallenges = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const filters = { category, status };
    
    const result = await enhancedCommunityService.getCommunityChallenges(filters, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getCommunityChallenges controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const result = await enhancedCommunityService.getChallengeById(challengeId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in getChallengeById controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const joinCommunityChallenge = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId } = req.params;
    
    const result = await enhancedCommunityService.joinCommunityChallenge(challengeId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in joinCommunityChallenge controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const leaveCommunityChallenge = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId } = req.params;
    
    const result = await enhancedCommunityService.leaveCommunityChallenge(challengeId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in leaveCommunityChallenge controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const updateChallengeProgress = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId } = req.params;
    const { progress, milestone } = req.body;
    
    const result = await enhancedCommunityService.updateChallengeProgress(challengeId, userId, progress, milestone);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in updateChallengeProgress controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const addChallengeCheckIn = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId } = req.params;
    const checkInData = req.body;
    
    const result = await enhancedCommunityService.addChallengeCheckIn(challengeId, userId, checkInData);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addChallengeCheckIn controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Peer Support Groups Controllers
const createPeerSupportGroup = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const groupData = req.body;
    
    console.log('Creating group with data:', groupData);
    console.log('User ID:', userId);
    console.log('User object:', req.user);
    
    const result = await enhancedCommunityService.createPeerSupportGroup(groupData, userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      console.log('Group creation failed:', result.error);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createPeerSupportGroup controller:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getPeerSupportGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, privacy } = req.query;
    const filters = { category, privacy };
    
    const result = await enhancedCommunityService.getPeerSupportGroups(filters, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getPeerSupportGroups controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const result = await enhancedCommunityService.getGroupById(groupId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in getGroupById controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const joinPeerSupportGroup = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId } = req.params;
    
    const result = await enhancedCommunityService.joinPeerSupportGroup(groupId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in joinPeerSupportGroup controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const leavePeerSupportGroup = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId } = req.params;
    
    const result = await enhancedCommunityService.leavePeerSupportGroup(groupId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in leavePeerSupportGroup controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getGroupDiscussions = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await enhancedCommunityService.getGroupDiscussions(groupId, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getGroupDiscussions controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const addGroupDiscussion = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId } = req.params;
    const discussionData = req.body;
    
    console.log('Controller: Adding discussion to group:', groupId, 'by user:', userId);
    console.log('Controller: User object:', req.user);
    console.log('Controller: Discussion data:', discussionData);
    
    if (!userId) {
      console.log('Controller: No user ID found');
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    const result = await enhancedCommunityService.addGroupDiscussion(groupId, userId, discussionData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      console.log('Controller: Discussion creation failed:', result.error);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addGroupDiscussion controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const addDiscussionReply = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId, discussionId } = req.params;
    const { content } = req.body;
    
    console.log('Adding reply to discussion:', discussionId, 'in group:', groupId, 'by user:', userId);
    
    const result = await enhancedCommunityService.addDiscussionReply(groupId, discussionId, userId, content);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addDiscussionReply controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Challenge Admin Controllers
const addChallengeTask = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId } = req.params;
    const taskData = req.body;
    
    const result = await enhancedCommunityService.addChallengeTask(challengeId, userId, taskData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addChallengeTask controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const promoteChallengeParticipant = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId, participantId } = req.params;
    const { role } = req.body;
    
    const result = await enhancedCommunityService.promoteChallengeParticipant(challengeId, userId, participantId, role);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in promoteChallengeParticipant controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const removeChallengeParticipant = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { challengeId, participantId } = req.params;
    
    const result = await enhancedCommunityService.removeChallengeParticipant(challengeId, userId, participantId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in removeChallengeParticipant controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Group Admin Controllers
const promoteGroupMember = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId, memberId } = req.params;
    const { role } = req.body;
    
    const result = await enhancedCommunityService.promoteGroupMember(groupId, userId, memberId, role);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in promoteGroupMember controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const removeGroupMember = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId, memberId } = req.params;
    
    const result = await enhancedCommunityService.removeGroupMember(groupId, userId, memberId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in removeGroupMember controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const banGroupMember = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId, memberId } = req.params;
    const { reason } = req.body;
    
    const result = await enhancedCommunityService.banGroupMember(groupId, userId, memberId, reason);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in banGroupMember controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const addGroupResource = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId } = req.params;
    const resourceData = req.body;
    
    const result = await enhancedCommunityService.addGroupResource(groupId, userId, resourceData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addGroupResource controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const addGroupEvent = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { groupId } = req.params;
    const eventData = req.body;
    
    const result = await enhancedCommunityService.addGroupEvent(groupId, userId, eventData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addGroupEvent controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Advanced Search and Discovery Controllers
const advancedSearch = async (req, res) => {
  try {
    const { q, type, filters } = req.query;
    const result = await enhancedCommunityService.advancedSearch(q, type, filters);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in advancedSearch controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getAIPoweredTrending = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await enhancedCommunityService.getAIPoweredTrending(parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getAIPoweredTrending controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const findCompatibleUsers = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { limit = 5 } = req.query;
    const result = await enhancedCommunityService.findCompatibleUsers(userId, parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in findCompatibleUsers controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Analytics Controllers
const getEngagementAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const result = await enhancedCommunityService.getEngagementAnalytics(null, period);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getEngagementAnalytics controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getEmotionalTrends = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const result = await enhancedCommunityService.getEmotionalTrends(null, period);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getEmotionalTrends controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getCommunityHealthMetrics = async (req, res) => {
  try {
    const result = await enhancedCommunityService.getCommunityHealthMetrics();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getCommunityHealthMetrics controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  // AI Financial Therapist
  initializeFinancialTherapist,
  analyzeEmotionalSpending,
  startTherapySession,
  getPredictiveInsights,
  getTherapistProfile,
  updateWellnessMetrics,
  
  // Enhanced Community
  getPersonalizedCommunityFeed,
  getCommunityRecommendations,
  createEnhancedPost,
  
  // Community Challenges
  createCommunityChallenge,
  getCommunityChallenges,
  getChallengeById,
  joinCommunityChallenge,
  leaveCommunityChallenge,
  updateChallengeProgress,
  addChallengeCheckIn,
  
  // Peer Support Groups
  createPeerSupportGroup,
  getPeerSupportGroups,
  getGroupById,
  joinPeerSupportGroup,
  leavePeerSupportGroup,
  getGroupDiscussions,
  addGroupDiscussion,
  addDiscussionReply,
  addGroupResource,
  addGroupEvent,
  
  // Challenge Admin
  addChallengeTask,
  promoteChallengeParticipant,
  removeChallengeParticipant,
  
  // Group Admin
  promoteGroupMember,
  removeGroupMember,
  banGroupMember,
  
  // Advanced Search and Discovery
  advancedSearch,
  getAIPoweredTrending,
  findCompatibleUsers,
  
  // Analytics
  getEngagementAnalytics,
  getEmotionalTrends,
  getCommunityHealthMetrics
}; 