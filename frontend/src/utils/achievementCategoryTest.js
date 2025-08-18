// Test the category mapping logic
const testAchievements = [
  {
    name: 'First Steps',
    type: 'first_goal',
    category: 'beginner'
  },
  {
    name: 'Goal Getter',
    type: 'goal_completed',
    category: 'beginner'
  },
  {
    name: 'First Grand',
    type: 'contribution_milestone',
    category: 'beginner'
  },
  {
    name: 'Team Player',
    type: 'team_player',
    category: 'beginner'
  },
  {
    name: 'Early Bird',
    type: 'streak_milestone',
    category: 'beginner'
  }
];

const mapBackendCategoryToFrontend = (achievement) => {
  const type = achievement.type;
  
  switch (type) {
    case 'contribution_milestone':
      return 'savings';
    case 'goal_completed':
    case 'first_goal':
      return 'goals';
    case 'team_player':
      return 'social';
    case 'streak_milestone':
      return 'streaks';
    default:
      return 'goals';
  }
};

console.log('Testing category mapping:');
testAchievements.forEach(achievement => {
  const frontendCategory = mapBackendCategoryToFrontend(achievement);
  console.log(`${achievement.name} (${achievement.type}) -> ${frontendCategory}`);
});

export { mapBackendCategoryToFrontend }; 