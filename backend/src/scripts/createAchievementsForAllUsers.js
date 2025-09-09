const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { env } = require('../config/env');

async function createAchievementsForAllUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find();
    console.log(`\n👥 Found ${users.length} users`);

    // Create achievements for ALL users
    for (const user of users) {
      console.log(`\n🎯 Creating achievements for: ${user.firstName} ${user.lastName} (${user._id})`);

      // Clear existing achievements for this user
      await Achievement.deleteMany({ user: user._id });

      // Create sample achievements for this user
      const sampleAchievements = [
        {
          user: user._id,
          type: 'first_goal',
          title: 'First Steps',
          description: 'You set your first savings goal!',
          data: { category: 'beginner', icon: '🎯', color: '#3B82F6', points: 10, rarity: 'common' }
        },
        {
          user: user._id,
          type: 'first_contribution',
          title: 'First Contribution',
          description: 'You made your first contribution!',
          data: { category: 'beginner', icon: '💰', color: '#3B82F6', points: 15, rarity: 'common' }
        },
        {
          user: user._id,
          type: 'savings_milestone',
          title: 'Savings Champion',
          description: 'You reached a significant savings milestone!',
          data: { category: 'intermediate', icon: '🏆', color: '#3B82F6', points: 50, rarity: 'uncommon', amount: 1000 }
        },
        {
          user: user._id,
          type: 'weekly_saver',
          title: 'Weekly Warrior',
          description: 'You saved consistently for a week!',
          data: { category: 'beginner', icon: '📅', color: '#3B82F6', points: 20, rarity: 'common', days: 7 }
        }
      ];

      // Insert sample achievements
      const achievements = await Achievement.insertMany(sampleAchievements);
      console.log(`✅ Created ${achievements.length} achievements for ${user.firstName}`);
    }

    console.log('\n🎉 All users now have achievements!');
    console.log('\n📋 No need to set any tokens - just refresh the achievements page!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating achievements for all users:', error);
    process.exit(1);
  }
}

// Run the function
createAchievementsForAllUsers();
