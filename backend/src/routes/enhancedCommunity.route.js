const express = require('express');
const router = express.Router();
const enhancedCommunityController = require('../controllers/enhancedCommunity.controller');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { body, param, query } = require('express-validator');

// Validation schemas for AI Financial Therapist
const therapySessionValidation = [
  body('sessionType').isIn([
    'emotional_analysis',
    'spending_intervention',
    'habit_building',
    'crisis_prevention',
    'mindset_shift'
  ]).withMessage('Invalid session type')
];

const emotionalSpendingValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').isString().withMessage('Category is required'),
  body('mood').optional().isString().withMessage('Mood must be a string'),
  body('trigger').optional().isString().withMessage('Trigger must be a string')
];

// Validation schemas for Community Challenges
const createChallengeValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
  body('category').isIn([
    'savings_challenge',
    'debt_free_challenge',
    'no_spend_challenge',
    'emotional_control',
    'habit_building',
    'financial_education',
    'mindset_shift',
    'community_support'
  ]).withMessage('Invalid challenge category'),
  body('duration.startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('duration.endDate').isISO8601().withMessage('End date must be a valid date'),
  body('duration.durationDays').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('goals.targetAmount').optional().isNumeric().withMessage('Target amount must be a number'),
  body('goals.targetParticipants').optional().isInt({ min: 1 }).withMessage('Target participants must be at least 1'),
  body('rules').optional().isArray().withMessage('Rules must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

// Validation schemas for Peer Support Groups
const createGroupValidation = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
  body('category').isIn([
    'debt_recovery',
    'savings_focus',
    'emotional_spending',
    'financial_anxiety',
    'budgeting_beginners',
    'investment_newbies',
    'single_parents',
    'students',
    'entrepreneurs',
    'retirement_planning',
    'general_support'
  ]).withMessage('Invalid group category'),
  body('privacy').optional().isIn(['public', 'private', 'invite_only']).withMessage('Invalid privacy setting'),
  body('maxMembers').optional().isInt({ min: 2, max: 1000 }).withMessage('Max members must be between 2 and 1000'),
  body('rules').optional().isArray().withMessage('Rules must be an array'),
  body('topics').optional().isArray().withMessage('Topics must be an array')
];

// AI Financial Therapist Routes
router.post('/therapist/initialize', auth, enhancedCommunityController.initializeFinancialTherapist);

router.post('/therapist/analyze-spending', auth, emotionalSpendingValidation, validateRequest, enhancedCommunityController.analyzeEmotionalSpending);

router.post('/therapist/session', auth, therapySessionValidation, validateRequest, enhancedCommunityController.startTherapySession);

router.get('/therapist/insights', auth, enhancedCommunityController.getPredictiveInsights);

router.get('/therapist/profile', auth, enhancedCommunityController.getTherapistProfile);

router.put('/therapist/update-metrics', auth, enhancedCommunityController.updateWellnessMetrics);

// Enhanced Community Routes
router.get('/feed/personalized', auth, enhancedCommunityController.getPersonalizedCommunityFeed);

router.get('/recommendations', auth, enhancedCommunityController.getCommunityRecommendations);

router.post('/posts/enhanced', auth, enhancedCommunityController.createEnhancedPost);

// Community Challenges Routes
router.post('/challenges', auth, createChallengeValidation, validateRequest, enhancedCommunityController.createCommunityChallenge);

router.get('/challenges', enhancedCommunityController.getCommunityChallenges);

router.get('/challenges/:challengeId', enhancedCommunityController.getChallengeById);

router.post('/challenges/:challengeId/join', auth, enhancedCommunityController.joinCommunityChallenge);

router.post('/challenges/:challengeId/leave', auth, enhancedCommunityController.leaveCommunityChallenge);

router.put('/challenges/:challengeId/progress', auth, enhancedCommunityController.updateChallengeProgress);

router.post('/challenges/:challengeId/checkin', auth, enhancedCommunityController.addChallengeCheckIn);

// Peer Support Groups Routes
router.post('/groups', auth, createGroupValidation, validateRequest, enhancedCommunityController.createPeerSupportGroup);

router.get('/groups', enhancedCommunityController.getPeerSupportGroups);

router.get('/groups/:groupId', enhancedCommunityController.getGroupById);

router.post('/groups/:groupId/join', auth, enhancedCommunityController.joinPeerSupportGroup);

router.post('/groups/:groupId/leave', auth, enhancedCommunityController.leavePeerSupportGroup);

router.post('/groups/:groupId/discussions', auth, enhancedCommunityController.addGroupDiscussion);

router.post('/groups/:groupId/resources', auth, enhancedCommunityController.addGroupResource);

router.post('/groups/:groupId/events', auth, enhancedCommunityController.addGroupEvent);

// Enhanced Search and Discovery
router.get('/search/advanced', enhancedCommunityController.advancedSearch);

router.get('/trending/ai-powered', enhancedCommunityController.getAIPoweredTrending);

router.get('/matching/users', auth, enhancedCommunityController.findCompatibleUsers);

// Community Analytics
router.get('/analytics/engagement', auth, enhancedCommunityController.getEngagementAnalytics);

router.get('/analytics/emotional-trends', auth, enhancedCommunityController.getEmotionalTrends);

router.get('/analytics/community-health', enhancedCommunityController.getCommunityHealthMetrics);

module.exports = router; 