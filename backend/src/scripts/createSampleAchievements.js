const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const { env } = require('../config/env');

async function createSampleAchievements() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the first user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found in database');
      process.exit(0);
    }

    console.log(`Creating achievements for user: ${user.firstName} ${user.lastName}`);

    // Clear existing achievements for this user
    await Achievement.deleteMany({ user: user._id });
    console.log('Cleared existing achievements for user');

    // Create sample achievements
    const sampleAchievements = [
      {
        user: user._id,
        type: 'first_goal',
        title: 'First Steps',
        description: 'You set your first savings goal!',
        data: { category: 'beginner', icon: '🎯', color: '#10B981', points: 10, rarity: 'common' }
      },
      {
        user: user._id,
        type: 'first_contribution',
        title: 'First Contribution',
        description: 'You made your first contribution!',
        data: { category: 'beginner', icon: '💰', color: '#10B981', points: 15, rarity: 'common' }
      },
      {
        user: user._id,
        type: 'savings_milestone',
        title: 'Savings Champion',
        description: 'You reached a significant savings milestone!',
        data: { category: 'intermediate', icon: '🏆', color: '#F59E0B', points: 50, rarity: 'uncommon', amount: 1000 }
      }
    ];

    // Insert sample achievements
    const achievements = await Achievement.insertMany(sampleAchievements);
    console.log(`Created ${achievements.length} sample achievements`);

    // Log the achievements
    achievements.forEach(achievement => {
      console.log(`✅ ${achievement.title} - ${achievement.description}`);
    });

    console.log('\n🎉 Sample achievements created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample achievements:', error);
    process.exit(1);
  }
}

// Run the function
createSampleAchievements();
