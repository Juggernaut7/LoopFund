const mongoose = require('mongoose');
const { Achievement } = require('../models/Achievement');
const { env } = require('../config/env');

const defaultAchievements = [
  {
    name: 'First Steps',
    description: 'Create your first savings goal',
    type: 'first_goal',
    category: 'beginner',
    icon: '🎯',
    color: '#10B981',
    criteria: { goalsCompleted: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    name: 'Goal Getter',
    description: 'Complete your first goal',
    type: 'goal_completed',
    category: 'beginner',
    icon: '🏆',
    color: '#F59E0B',
    criteria: { goalsCompleted: 1 },
    points: 25,
    rarity: 'uncommon'
  },
  {
    name: 'Goal Master',
    description: 'Complete 5 goals',
    type: 'goal_completed',
    category: 'intermediate',
    icon: '👑',
    color: '#8B5CF6',
    criteria: { goalsCompleted: 5 },
    points: 50,
    rarity: 'rare'
  },
  {
    name: 'Goal Legend',
    description: 'Complete 10 goals',
    type: 'goal_completed',
    category: 'expert',
    icon: '💎',
    color: '#EF4444',
    criteria: { goalsCompleted: 10 },
    points: 100,
    rarity: 'legendary'
  },
  {
    name: 'First Grand',
    description: 'Save your first $1,000',
    type: 'contribution_milestone',
    category: 'beginner',
    icon: '💰',
    color: '#10B981',
    criteria: { totalContributed: 1000 },
    points: 30,
    rarity: 'uncommon'
  },
  {
    name: 'Big Saver',
    description: 'Save $5,000 total',
    type: 'contribution_milestone',
    category: 'intermediate',
    icon: '💵',
    color: '#F59E0B',
    criteria: { totalContributed: 5000 },
    points: 75,
    rarity: 'rare'
  },
  {
    name: 'Savings Champion',
    description: 'Save $10,000 total',
    type: 'contribution_milestone',
    category: 'advanced',
    icon: '🏦',
    color: '#8B5CF6',
    criteria: { totalContributed: 10000 },
    points: 150,
    rarity: 'epic'
  },
  {
    name: 'Team Player',
    description: 'Join your first group savings',
    type: 'team_player',
    category: 'beginner',
    icon: '👥',
    color: '#3B82F6',
    criteria: { groupMembers: 1 },
    points: 20,
    rarity: 'common'
  },
  {
    name: 'Group Leader',
    description: 'Join 3 group savings',
    type: 'team_player',
    category: 'intermediate',
    icon: '👑',
    color: '#F59E0B',
    criteria: { groupMembers: 3 },
    points: 60,
    rarity: 'rare'
  },
  {
    name: 'Early Bird',
    description: 'Use LoopFund for 7 days',
    type: 'streak_milestone',
    category: 'beginner',
    icon: '🌅',
    color: '#10B981',
    criteria: { streakDays: 7 },
    points: 15,
    rarity: 'common'
  },
  {
    name: 'Consistent Saver',
    description: 'Use LoopFund for 30 days',
    type: 'streak_milestone',
    category: 'intermediate',
    icon: '📅',
    color: '#F59E0B',
    criteria: { streakDays: 30 },
    points: 50,
    rarity: 'uncommon'
  },
  {
    name: 'Loyal User',
    description: 'Use LoopFund for 100 days',
    type: 'streak_milestone',
    category: 'advanced',
    icon: '💎',
    color: '#8B5CF6',
    criteria: { streakDays: 100 },
    points: 100,
    rarity: 'epic'
  }
];

async function seedAchievements() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('Cleared existing achievements');

    // Insert default achievements
    const achievements = await Achievement.insertMany(defaultAchievements);
    console.log(`Seeded ${achievements.length} achievements`);

    // Log the achievements
    achievements.forEach(achievement => {
      console.log(`✅ ${achievement.name} - ${achievement.description}`);
    });

    console.log('\n🎉 Achievement seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAchievements(); 