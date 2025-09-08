const CommunityPost = require('../models/CommunityPost');
const CommunityChallenge = require('../models/CommunityChallenge');
const PeerSupportGroup = require('../models/PeerSupportGroup');
const FinancialTherapist = require('../models/FinancialTherapist');
const User = require('../models/User');
const aiService = require('./ai.service');

class EnhancedCommunityService {
  // AI Financial Therapist Methods
  async initializeFinancialTherapist(userId) {
    try {
      let therapist = await FinancialTherapist.findOne({ user: userId });
      if (!therapist) {
        therapist = new FinancialTherapist({
          user: userId,
          emotionalProfile: {
            spendingTriggers: [],
            stressLevels: [],
            moodPatterns: [],
            anxietyTriggers: []
          },
          wellnessMetrics: {
            financialStress: { current: 5, trend: 'stable', lastUpdated: new Date() },
            emotionalSpendingControl: { score: 50, improvement: 0, lastUpdated: new Date() },
            financialConfidence: { score: 50, trend: 'stable', lastUpdated: new Date() },
            habitAdherence: { score: 50, consistency: 0, lastUpdated: new Date() }
          }
        });
        await therapist.save();
      }
      return { success: true, data: therapist };
    } catch (error) {
      console.error('Error initializing financial therapist:', error);
      return { success: false, error: error.message };
    }
  }

  async analyzeEmotionalSpending(userId, spendingData) {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      if (!therapist) {
        return { success: false, error: 'Financial therapist not found' };
      }

      // Analyze spending patterns using AI
      const aiAnalysis = await aiService.analyzeEmotionalSpending(spendingData);
      
      // Update emotional profile
      if (aiAnalysis.emotionalTrigger) {
        therapist.addSpendingTrigger(aiAnalysis.emotionalTrigger, aiAnalysis.impact);
      }
      
      if (aiAnalysis.stressLevel) {
        therapist.recordStressLevel(
          aiAnalysis.stressLevel,
          spendingData.amount,
          spendingData.category
        );
      }

      // Generate intervention if needed
      let intervention = null;
      if (aiAnalysis.needsIntervention) {
        intervention = await this.generateIntervention(therapist, aiAnalysis);
      }

      await therapist.save();

      return {
        success: true,
        data: {
          analysis: aiAnalysis,
          intervention,
          updatedProfile: therapist.emotionalProfile
        }
      };
    } catch (error) {
      console.error('Error analyzing emotional spending:', error);
      return { success: false, error: error.message };
    }
  }

  async generateIntervention(therapist, analysis) {
    try {
      const interventionData = {
        type: 'micro_pause',
        trigger: analysis.emotionalTrigger || 'stress',
        action: 'Take a 5-second pause before spending',
        outcome: 'pending',
        effectiveness: 0
      };

      // Customize intervention based on user's history
      if (analysis.stressLevel > 7) {
        interventionData.type = 'emotional_check';
        interventionData.action = 'Practice deep breathing for 30 seconds';
      } else if (analysis.category === 'entertainment' && analysis.amount > 50) {
        interventionData.type = 'habit_reminder';
        interventionData.action = 'Remember your financial goals';
      }

      therapist.addIntervention(interventionData);
      return interventionData;
    } catch (error) {
      console.error('Error generating intervention:', error);
      return null;
    }
  }

  async startTherapySession(userId, sessionType) {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      if (!therapist) {
        return { success: false, error: 'Financial therapist not found' };
      }

      const sessionData = {
        sessionType,
        duration: 0,
        insights: [],
        recommendations: [],
        moodBefore: 'neutral',
        moodAfter: 'neutral',
        effectiveness: 0,
        followUpActions: []
      };

      // Generate AI-powered session content
      const aiSession = await aiService.generateTherapySession(sessionType, therapist);
      sessionData.insights = aiSession.insights;
      sessionData.recommendations = aiSession.recommendations;
      sessionData.followUpActions = aiSession.followUpActions;

      therapist.addTherapySession(sessionData);
      await therapist.save();

      return {
        success: true,
        data: {
          session: sessionData,
          aiContent: aiSession
        }
      };
    } catch (error) {
      console.error('Error starting therapy session:', error);
      return { success: false, error: error.message };
    }
  }

  async getPredictiveInsights(userId) {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      if (!therapist) {
        return { success: false, error: 'Financial therapist not found' };
      }

      // Generate AI predictions
      const predictions = await aiService.generateFinancialPredictions(therapist);
      
      // Update predictive insights
      therapist.predictiveInsights = predictions;
      await therapist.save();

      return {
        success: true,
        data: predictions
      };
    } catch (error) {
      console.error('Error getting predictive insights:', error);
      return { success: false, error: error.message };
    }
  }

  // Enhanced Community Methods
  async createEnhancedPost(postData, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const post = new CommunityPost({
        ...postData,
        author: userId,
        displayName: postData.isAnonymous ? (postData.displayName || 'Anonymous User') : undefined,
        status: 'active',
      });

      await post.save();
      await post.populate('author', 'name email avatar');

      return {
        success: true,
        data: post,
        message: 'Post created successfully',
      };
    } catch (error) {
      console.error('Error creating enhanced community post:', error);
      return { success: false, error: error.message };
    }
  }

  async createCommunityChallenge(challengeData, userId) {
    try {
      const challenge = new CommunityChallenge({
        ...challengeData,
        creator: userId,
        participants: [],
        engagement: { likes: [], comments: [], shares: [] }
      });

      await challenge.save();
      await challenge.populate('creator', 'name email avatar');

      return {
        success: true,
        data: challenge,
        message: 'Challenge created successfully'
      };
    } catch (error) {
      console.error('Error creating community challenge:', error);
      return { success: false, error: error.message };
    }
  }

  async joinCommunityChallenge(challengeId, userId) {
    try {
      const challenge = await CommunityChallenge.findById(challengeId);
      if (!challenge) {
        return { success: false, error: 'Challenge not found' };
      }

      if (challenge.status !== 'active') {
        return { success: false, error: 'Challenge is not active' };
      }

      const joined = challenge.addParticipant(userId);
      if (!joined) {
        return { success: false, error: 'Already participating in this challenge' };
      }

      await challenge.save();
      await challenge.populate('participants.user', 'name email avatar');

      return {
        success: true,
        data: challenge,
        message: 'Successfully joined challenge'
      };
    } catch (error) {
      console.error('Error joining community challenge:', error);
      return { success: false, error: error.message };
    }
  }

  async createPeerSupportGroup(groupData, userId) {
    try {
      const group = new PeerSupportGroup({
        ...groupData,
        creator: userId,
        moderators: [userId],
        members: [],
        discussions: [],
        resources: [],
        events: []
      });

      // Add creator as first member
      group.addMember(userId, 'creator');

      await group.save();
      await group.populate('creator', 'name email avatar');

      return {
        success: true,
        data: group,
        message: 'Support group created successfully'
      };
    } catch (error) {
      console.error('Error creating peer support group:', error);
      return { success: false, error: error.message };
    }
  }

  async joinPeerSupportGroup(groupId, userId) {
    try {
      const group = await PeerSupportGroup.findById(groupId);
      if (!group) {
        return { success: false, error: 'Support group not found' };
      }

      if (group.privacy === 'invite_only') {
        return { success: false, error: 'This group requires an invitation' };
      }

      const joined = group.addMember(userId);
      if (!joined) {
        return { success: false, error: 'Already a member of this group' };
      }

      await group.save();
      await group.populate('members.user', 'name email avatar');

      return {
        success: true,
        data: group,
        message: 'Successfully joined support group'
      };
    } catch (error) {
      console.error('Error joining peer support group:', error);
      return { success: false, error: error.message };
    }
  }

  async getPersonalizedCommunityFeed(userId, page = 1, limit = 10) {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      const user = await User.findById(userId);

      // Get user's emotional profile and preferences
      const emotionalState = therapist?.wellnessMetrics?.financialStress?.current || 5;
      const userInterests = user?.interests || [];

      // Build personalized query
      let query = { status: 'active' };
      
      // Adjust content based on emotional state
      if (emotionalState > 7) {
        // High stress - show more supportive content
        query.category = { $in: ['emotional_support', 'motivation', 'success_story'] };
      } else if (emotionalState < 4) {
        // Low stress - show more educational content
        query.category = { $in: ['financial_education', 'tips_advice', 'habit_tracking'] };
      }

      const skip = (page - 1) * limit;
      
      const posts = await CommunityPost.find(query)
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await CommunityPost.countDocuments(query);

      // Add AI insights to posts
      const enhancedPosts = await Promise.all(
        posts.map(async (post) => {
          const aiInsights = await aiService.analyzePostRelevance(post, therapist);
          return {
            ...post.toObject(),
            aiInsights,
            personalRelevance: aiInsights.relevanceScore
          };
        })
      );

      return {
        success: true,
        data: {
          posts: enhancedPosts,
          pagination: {
            current: page,
            total: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      };
    } catch (error) {
      console.error('Error getting personalized community feed:', error);
      return { success: false, error: error.message };
    }
  }

  async getTherapistProfile(userId) {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      if (!therapist) {
        return { success: false, error: 'Financial therapist not found' };
      }
      
      return {
        success: true,
        data: therapist
      };
    } catch (error) {
      console.error('Error getting therapist profile:', error);
      return { success: false, error: error.message };
    }
  }

  async updateWellnessMetrics(userId, metrics) {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      if (!therapist) {
        return { success: false, error: 'Financial therapist not found' };
      }
      
      therapist.updateWellnessMetrics(metrics);
      await therapist.save();
      
      return {
        success: true,
        data: therapist.wellnessMetrics
      };
    } catch (error) {
      console.error('Error updating wellness metrics:', error);
      return { success: false, error: error.message };
    }
  }

  async getCommunityChallenges(filters = {}, page = 1, limit = 10) {
    try {
      const query = { status: 'active' };
      
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      
      const skip = (page - 1) * limit;
      
      const challenges = await CommunityChallenge.find(query)
        .populate('creator', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await CommunityChallenge.countDocuments(query);

      return {
        success: true,
        data: {
          challenges,
          pagination: {
            current: page,
            total: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      };
    } catch (error) {
      console.error('Error fetching community challenges:', error);
      return { success: false, error: error.message };
    }
  }

  async getChallengeById(challengeId) {
    try {
      const challenge = await CommunityChallenge.findById(challengeId)
        .populate('creator', 'name email avatar')
        .populate('participants.user', 'name email avatar');

      if (!challenge) {
        return { success: false, error: 'Challenge not found' };
      }

      return {
        success: true,
        data: challenge
      };
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return { success: false, error: error.message };
    }
  }

  async leaveCommunityChallenge(challengeId, userId) {
    try {
      const challenge = await CommunityChallenge.findById(challengeId);
      if (!challenge) {
        return { success: false, error: 'Challenge not found' };
      }

      const removed = challenge.removeParticipant(userId);
      if (!removed) {
        return { success: false, error: 'Not participating in this challenge' };
      }

      await challenge.save();
      return {
        success: true,
        message: 'Successfully left challenge'
      };
    } catch (error) {
      console.error('Error leaving challenge:', error);
      return { success: false, error: error.message };
    }
  }

  async updateChallengeProgress(challengeId, userId, progress, milestone) {
    try {
      const challenge = await CommunityChallenge.findById(challengeId);
      if (!challenge) {
        return { success: false, error: 'Challenge not found' };
      }

      const updated = challenge.updateParticipantProgress(userId, progress, milestone);
      if (!updated) {
        return { success: false, error: 'Not participating in this challenge' };
      }

      await challenge.save();
      return {
        success: true,
        message: 'Progress updated successfully'
      };
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      return { success: false, error: error.message };
    }
  }

  async addChallengeCheckIn(challengeId, userId, checkInData) {
    try {
      const challenge = await CommunityChallenge.findById(challengeId);
      if (!challenge) {
        return { success: false, error: 'Challenge not found' };
      }

      const added = challenge.addCheckIn(userId, checkInData);
      if (!added) {
        return { success: false, error: 'Not participating in this challenge' };
      }

      await challenge.save();
      return {
        success: true,
        message: 'Check-in added successfully'
      };
    } catch (error) {
      console.error('Error adding challenge check-in:', error);
      return { success: false, error: error.message };
    }
  }

  async getPeerSupportGroups(filters = {}, page = 1, limit = 10) {
    try {
      const query = { status: 'active' };
      
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.privacy) {
        query.privacy = filters.privacy;
      }
      
      const skip = (page - 1) * limit;
      
      const groups = await PeerSupportGroup.find(query)
        .populate('creator', 'name email avatar')
        .populate('members.user', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await PeerSupportGroup.countDocuments(query);

      return {
        success: true,
        data: {
          groups,
          pagination: {
            current: page,
            total: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      };
    } catch (error) {
      console.error('Error fetching peer support groups:', error);
      return { success: false, error: error.message };
    }
  }

  async getGroupById(groupId) {
    try {
      const group = await PeerSupportGroup.findById(groupId)
        .populate('creator', 'name email avatar')
        .populate('members.user', 'name email avatar')
        .populate('discussions.author', 'name email avatar');

      if (!group) {
        return { success: false, error: 'Group not found' };
      }

      return {
        success: true,
        data: group
      };
    } catch (error) {
      console.error('Error fetching group:', error);
      return { success: false, error: error.message };
    }
  }

  async leavePeerSupportGroup(groupId, userId) {
    try {
      const group = await PeerSupportGroup.findById(groupId);
      if (!group) {
        return { success: false, error: 'Group not found' };
      }

      const removed = group.removeMember(userId);
      if (!removed) {
        return { success: false, error: 'Not a member of this group' };
      }

      await group.save();
      return {
        success: true,
        message: 'Successfully left group'
      };
    } catch (error) {
      console.error('Error leaving group:', error);
      return { success: false, error: error.message };
    }
  }

  async addGroupDiscussion(groupId, userId, discussionData) {
    try {
      const group = await PeerSupportGroup.findById(groupId);
      if (!group) {
        return { success: false, error: 'Group not found' };
      }

      group.addDiscussion({
        ...discussionData,
        author: userId
      });

      await group.save();
      return {
        success: true,
        message: 'Discussion added successfully'
      };
    } catch (error) {
      console.error('Error adding group discussion:', error);
      return { success: false, error: error.message };
    }
  }

  async addGroupResource(groupId, userId, resourceData) {
    try {
      const group = await PeerSupportGroup.findById(groupId);
      if (!group) {
        return { success: false, error: 'Group not found' };
      }

      group.addResource({
        ...resourceData,
        addedBy: userId
      });

      await group.save();
      return {
        success: true,
        message: 'Resource added successfully'
      };
    } catch (error) {
      console.error('Error adding group resource:', error);
      return { success: false, error: error.message };
    }
  }

  async addGroupEvent(groupId, userId, eventData) {
    try {
      const group = await PeerSupportGroup.findById(groupId);
      if (!group) {
        return { success: false, error: 'Group not found' };
      }

      group.addEvent({
        ...eventData,
        organizer: userId
      });

      await group.save();
      return {
        success: true,
        message: 'Event added successfully'
      };
    } catch (error) {
      console.error('Error adding group event:', error);
      return { success: false, error: error.message };
    }
  }

  async advancedSearch(query, type, filters) {
    try {
      let results = {};
      
      if (type === 'posts' || !type) {
        const posts = await CommunityPost.find({
          $text: { $search: query },
          status: 'active',
          ...filters
        })
        .populate('author', 'name email avatar')
        .limit(10);
        
        results.posts = posts;
      }
      
      if (type === 'challenges' || !type) {
        const challenges = await CommunityChallenge.find({
          $text: { $search: query },
          status: 'active'
        })
        .populate('creator', 'name email avatar')
        .limit(5);
        
        results.challenges = challenges;
      }
      
      if (type === 'groups' || !type) {
        const groups = await PeerSupportGroup.find({
          $text: { $search: query },
          status: 'active'
        })
        .populate('creator', 'name email avatar')
        .limit(5);
        
        results.groups = groups;
      }
      
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      return { success: false, error: error.message };
    }
  }

  async getAIPoweredTrending(limit = 10) {
    try {
      // Get posts with high engagement and positive sentiment
      const trendingPosts = await CommunityPost.find({
        status: 'active',
        'engagement.likes': { $exists: true, $ne: [] }
      })
      .populate('author', 'name email avatar')
      .sort({ 'engagement.likes': -1, createdAt: -1 })
      .limit(limit);

      return {
        success: true,
        data: trendingPosts
      };
    } catch (error) {
      console.error('Error getting AI-powered trending:', error);
      return { success: false, error: error.message };
    }
  }

  async findCompatibleUsers(userId, limit = 5) {
    try {
      const user = await User.findById(userId);
      const therapist = await FinancialTherapist.findOne({ user: userId });
      
      // Find users with similar financial goals or situations
      const compatibleUsers = await User.find({
        _id: { $ne: userId },
        interests: { $in: user.interests || [] }
      })
      .limit(limit);

      return {
        success: true,
        data: compatibleUsers
      };
    } catch (error) {
      console.error('Error finding compatible users:', error);
      return { success: false, error: error.message };
    }
  }

  async getEngagementAnalytics(userId, period = '30d') {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      
      // Calculate engagement metrics
      const analytics = {
        postsCreated: 0,
        commentsMade: 0,
        challengesJoined: 0,
        groupsJoined: 0,
        therapySessions: therapist?.therapySessions?.length || 0,
        interventionsReceived: therapist?.interventions?.length || 0
      };

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Error getting engagement analytics:', error);
      return { success: false, error: error.message };
    }
  }

  async getEmotionalTrends(userId, period = '30d') {
    try {
      const therapist = await FinancialTherapist.findOne({ user: userId });
      
      if (!therapist) {
        return { success: false, error: 'Therapist profile not found' };
      }

      const trends = {
        stressLevels: therapist.emotionalProfile.stressLevels.slice(-10),
        moodPatterns: therapist.emotionalProfile.moodPatterns.slice(-10),
        spendingTriggers: therapist.emotionalProfile.spendingTriggers
      };

      return {
        success: true,
        data: trends
      };
    } catch (error) {
      console.error('Error getting emotional trends:', error);
      return { success: false, error: error.message };
    }
  }

  async getCommunityHealthMetrics() {
    try {
      const metrics = {
        totalUsers: await User.countDocuments(),
        activePosts: await CommunityPost.countDocuments({ status: 'active' }),
        activeChallenges: await CommunityChallenge.countDocuments({ status: 'active' }),
        activeGroups: await PeerSupportGroup.countDocuments({ status: 'active' }),
        totalTherapySessions: await FinancialTherapist.aggregate([
          { $group: { _id: null, total: { $sum: { $size: '$therapySessions' } } } }
        ])
      };

      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      console.error('Error getting community health metrics:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EnhancedCommunityService(); 