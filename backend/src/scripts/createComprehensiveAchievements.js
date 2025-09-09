const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { env } = require('../config/env');

async function createComprehensiveAchievements() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find();
    console.log(`\n👥 Found ${users.length} users`);

    // Create comprehensive achievements for ALL users
    for (const user of users) {
      console.log(`\n🎯 Creating comprehensive achievements for: ${user.firstName} ${user.lastName} (${user._id})`);

      // Clear existing achievements for this user
      await Achievement.deleteMany({ user: user._id });

      // Create comprehensive achievements for ALL categories
      const comprehensiveAchievements = [
        // GOALS CATEGORY
        {
          user: user._id,
          type: 'first_goal',
          title: 'First Steps',
          description: 'You set your first savings goal!',
          data: { category: 'goals', icon: '🎯', color: '#3B82F6', points: 10, rarity: 'common' }
        },
        {
          user: user._id,
          type: 'goal_completed',
          title: 'Goal Achiever',
          description: 'You successfully completed a savings goal!',
          data: { category: 'goals', icon: '🏆', color: '#3B82F6', points: 25, rarity: 'uncommon' }
        },
        {
          user: user._id,
          type: 'goal_completed',
          title: 'Goal Master',
          description: 'You completed 5 goals!',
          data: { category: 'goals', icon: '👑', color: '#3B82F6', points: 50, rarity: 'rare' }
        },
        {
          user: user._id,
          type: 'goal_completed',
          title: 'Goal Legend',
          description: 'You completed 10 goals!',
          data: { category: 'goals', icon: '💎', color: '#3B82F6', points: 100, rarity: 'legendary' }
        },

        // SAVINGS CATEGORY
        {
          user: user._id,
          type: 'first_contribution',
          title: 'First Contribution',
          description: 'You made your first contribution!',
          data: { category: 'savings', icon: '💰', color: '#3B82F6', points: 15, rarity: 'common' }
        },
        {
          user: user._id,
          type: 'savings_milestone',
          title: 'First Grand',
          description: 'You saved your first $1,000!',
          data: { category: 'savings', icon: '💵', color: '#3B82F6', points: 30, rarity: 'uncommon' }
        },
        {
          user: user._id,
          type: 'savings_milestone',
          title: 'Big Saver',
          description: 'You saved $5,000 total!',
          data: { category: 'savings', icon: '🏦', color: '#3B82F6', points: 75, rarity: 'rare' }
        },
        {
          user: user._id,
          type: 'savings_milestone',
          title: 'Savings Champion',
          description: 'You saved $10,000 total!',
          data: { category: 'savings', icon: '💎', color: '#3B82F6', points: 150, rarity: 'epic' }
        },
        {
          user: user._id,
          type: 'contribution_streak',
          title: 'Consistent Saver',
          description: 'You made contributions for 7 days straight!',
          data: { category: 'savings', icon: '📈', color: '#3B82F6', points: 40, rarity: 'uncommon' }
        },

        // SOCIAL CATEGORY
        {
          user: user._id,
          type: 'group_member',
          title: 'Team Player',
          description: 'You joined your first group savings!',
          data: { category: 'social', icon: '👥', color: '#3B82F6', points: 20, rarity: 'common' }
        },
        {
          user: user._id,
          type: 'group_creator',
          title: 'Group Leader',
          description: 'You created your first savings group!',
          data: { category: 'social', icon: '👑', color: '#3B82F6', points: 60, rarity: 'rare' }
        },
        {
          user: user._id,
          type: 'group_member',
          title: 'Social Butterfly',
          description: 'You joined 3 group savings!',
          data: { category: 'social', icon: '🦋', color: '#3B82F6', points: 45, rarity: 'uncommon' }
        },
        {
          user: user._id,
          type: 'group_creator',
          title: 'Community Builder',
          description: 'You created 3 savings groups!',
          data: { category: 'social', icon: '🏗️', color: '#3B82F6', points: 120, rarity: 'epic' }
        },

        // STREAKS CATEGORY
        {
          user: user._id,
          type: 'weekly_saver',
          title: 'Early Bird',
          description: 'You used LoopFund for 7 days!',
          data: { category: 'streaks', icon: '🌅', color: '#3B82F6', points: 15, rarity: 'common' }
        },
        {
          user: user._id,
          type: 'monthly_saver',
          title: 'Consistent Saver',
          description: 'You used LoopFund for 30 days!',
          data: { category: 'streaks', icon: '📅', color: '#3B82F6', points: 50, rarity: 'uncommon' }
        },
        {
          user: user._id,
          type: 'weekly_saver',
          title: 'Loyal User',
          description: 'You used LoopFund for 100 days!',
          data: { category: 'streaks', icon: '💎', color: '#3B82F6', points: 100, rarity: 'epic' }
        },
        {
          user: user._id,
          type: 'monthly_saver',
          title: 'Streak Master',
          description: 'You maintained a 30-day contribution streak!',
          data: { category: 'streaks', icon: '⚡', color: '#3B82F6', points: 80, rarity: 'rare' }
        },
        {
          user: user._id,
          type: 'weekly_saver',
          title: 'Dedication Champion',
          description: 'You maintained a 100-day contribution streak!',
          data: { category: 'streaks', icon: '🏆', color: '#3B82F6', points: 200, rarity: 'legendary' }
        }
      ];

      // Insert comprehensive achievements
      const achievements = await Achievement.insertMany(comprehensiveAchievements);
      console.log(`✅ Created ${achievements.length} comprehensive achievements for ${user.firstName}`);
      
      // Log achievements by category
      const goalsCount = achievements.filter(a => a.data.category === 'goals').length;
      const savingsCount = achievements.filter(a => a.data.category === 'savings').length;
      const socialCount = achievements.filter(a => a.data.category === 'social').length;
      const streaksCount = achievements.filter(a => a.data.category === 'streaks').length;
      
      console.log(`   📊 Goals: ${goalsCount}, Savings: ${savingsCount}, Social: ${socialCount}, Streaks: ${streaksCount}`);
    }

    console.log('\n🎉 All users now have comprehensive achievements in ALL categories!');
    console.log('\n📋 Categories populated:');
    console.log('   🎯 Goals: 4 achievements');
    console.log('   💰 Savings: 5 achievements');
    console.log('   👥 Social: 4 achievements');
    console.log('   ⚡ Streaks: 5 achievements');
    console.log('\n🚀 Total: 18 achievements per user!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating comprehensive achievements:', error);
    process.exit(1);
  }
}

// Run the function
createComprehensiveAchievements();
