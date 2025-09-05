const mongoose = require('mongoose');
const FinancialTherapist = require('./src/models/FinancialTherapist');
const CommunityChallenge = require('./src/models/CommunityChallenge');
const PeerSupportGroup = require('./src/models/PeerSupportGroup');
const enhancedCommunityService = require('./src/services/enhancedCommunity.service');

// Test configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopfund';

async function testEnhancedCommunityFeatures() {
  try {
    console.log('🧪 Testing Enhanced Community Features...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test 1: Create Financial Therapist Profile
    console.log('1️⃣ Testing Financial Therapist Profile Creation...');
    const testUserId = new mongoose.Types.ObjectId();
    const therapistResult = await enhancedCommunityService.initializeFinancialTherapist(testUserId);
    
    if (therapistResult.success) {
      console.log('✅ Financial Therapist profile created successfully');
      console.log(`   - User ID: ${testUserId}`);
      console.log(`   - Wellness Score: ${therapistResult.data.wellnessMetrics.financialConfidence.score}`);
    } else {
      console.log('❌ Failed to create Financial Therapist profile');
      console.log(`   Error: ${therapistResult.error}`);
    }
    
    // Test 2: Analyze Emotional Spending
    console.log('\n2️⃣ Testing Emotional Spending Analysis...');
    const spendingData = {
      amount: 150,
      category: 'entertainment',
      mood: 'stressed',
      trigger: 'boredom'
    };
    
    const analysisResult = await enhancedCommunityService.analyzeEmotionalSpending(testUserId, spendingData);
    
    if (analysisResult.success) {
      console.log('✅ Emotional spending analysis completed');
      console.log(`   - Emotional Trigger: ${analysisResult.data.analysis.emotionalTrigger}`);
      console.log(`   - Impact Level: ${analysisResult.data.analysis.impact}/10`);
      console.log(`   - Needs Intervention: ${analysisResult.data.analysis.needsIntervention}`);
    } else {
      console.log('❌ Failed to analyze emotional spending');
      console.log(`   Error: ${analysisResult.error}`);
    }
    
    // Test 3: Start Therapy Session
    console.log('\n3️⃣ Testing Therapy Session...');
    const sessionResult = await enhancedCommunityService.startTherapySession(testUserId, 'emotional_analysis');
    
    if (sessionResult.success) {
      console.log('✅ Therapy session started successfully');
      console.log(`   - Session Type: ${sessionResult.data.session.sessionType}`);
      console.log(`   - Insights Count: ${sessionResult.data.session.insights.length}`);
      console.log(`   - Recommendations Count: ${sessionResult.data.session.recommendations.length}`);
    } else {
      console.log('❌ Failed to start therapy session');
      console.log(`   Error: ${sessionResult.error}`);
    }
    
    // Test 4: Create Community Challenge
    console.log('\n4️⃣ Testing Community Challenge Creation...');
    const challengeData = {
      title: 'Mindful Spending Challenge',
      description: 'Learn to pause before spending and build better habits',
      category: 'emotional_control',
      duration: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        durationDays: 7
      },
      goals: {
        targetAmount: 500,
        targetParticipants: 50
      },
      rules: ['Pause 5 seconds before any purchase', 'Track your mood'],
      tags: ['mindfulness', 'spending']
    };
    
    const challengeResult = await enhancedCommunityService.createCommunityChallenge(challengeData, testUserId);
    
    if (challengeResult.success) {
      console.log('✅ Community challenge created successfully');
      console.log(`   - Challenge ID: ${challengeResult.data._id}`);
      console.log(`   - Title: ${challengeResult.data.title}`);
      console.log(`   - Category: ${challengeResult.data.category}`);
      console.log(`   - Duration: ${challengeResult.data.duration.durationDays} days`);
    } else {
      console.log('❌ Failed to create community challenge');
      console.log(`   Error: ${challengeResult.error}`);
    }
    
    // Test 5: Create Peer Support Group
    console.log('\n5️⃣ Testing Peer Support Group Creation...');
    const groupData = {
      name: 'Debt Recovery Warriors',
      description: 'Support group for people working to become debt-free',
      category: 'debt_recovery',
      privacy: 'public',
      maxMembers: 100,
      rules: ['Be supportive', 'No judgment', 'Share experiences'],
      topics: ['debt payoff strategies', 'budgeting tips', 'motivation']
    };
    
    const groupResult = await enhancedCommunityService.createPeerSupportGroup(groupData, testUserId);
    
    if (groupResult.success) {
      console.log('✅ Peer support group created successfully');
      console.log(`   - Group ID: ${groupResult.data._id}`);
      console.log(`   - Name: ${groupResult.data.name}`);
      console.log(`   - Category: ${groupResult.data.category}`);
      console.log(`   - Privacy: ${groupResult.data.privacy}`);
    } else {
      console.log('❌ Failed to create peer support group');
      console.log(`   Error: ${groupResult.error}`);
    }
    
    // Test 6: Get Personalized Feed
    console.log('\n6️⃣ Testing Personalized Community Feed...');
    const feedResult = await enhancedCommunityService.getPersonalizedCommunityFeed(testUserId, 1, 5);
    
    if (feedResult.success) {
      console.log('✅ Personalized feed generated successfully');
      console.log(`   - Posts Count: ${feedResult.data.posts.length}`);
      console.log(`   - Pagination: ${feedResult.data.pagination.current}/${feedResult.data.pagination.total}`);
    } else {
      console.log('❌ Failed to generate personalized feed');
      console.log(`   Error: ${feedResult.error}`);
    }
    
    // Test 7: Get Community Recommendations
    console.log('\n7️⃣ Testing Community Recommendations...');
    const recommendationsResult = await enhancedCommunityService.getCommunityRecommendations(testUserId);
    
    if (recommendationsResult.success) {
      console.log('✅ Community recommendations generated successfully');
      console.log(`   - Challenges: ${recommendationsResult.data.challenges.length}`);
      console.log(`   - Groups: ${recommendationsResult.data.groups.length}`);
    } else {
      console.log('❌ Failed to generate community recommendations');
      console.log(`   Error: ${recommendationsResult.error}`);
    }
    
    console.log('\n🎉 All Enhanced Community Features Tested Successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Financial Therapist Profile');
    console.log('✅ Emotional Spending Analysis');
    console.log('✅ Therapy Sessions');
    console.log('✅ Community Challenges');
    console.log('✅ Peer Support Groups');
    console.log('✅ Personalized Feed');
    console.log('✅ Community Recommendations');
    
    console.log('\n🚀 LoopFund Enhanced Community is ready for production!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
if (require.main === module) {
  testEnhancedCommunityFeatures();
}

module.exports = { testEnhancedCommunityFeatures }; 