import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Brain, 
  Heart, 
  Target, 
  Award, 
  Zap, 
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Trophy,
  Star,
  Users,
  MessageCircle,
  Share2,
  Download,
  Settings,
  Info,
  Lightbulb,
  Shield,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';

const FinancialTherapyGames = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameProgress, setGameProgress] = useState({});
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    totalPoints: 0,
    streak: 0,
    level: 1
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Sample games
  const games = [
    {
      id: 'anxiety-reduction',
      title: 'Financial Anxiety Reduction',
      description: 'Practice mindfulness and breathing exercises to reduce financial stress',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      duration: '5 minutes',
      difficulty: 'Easy',
      points: 100,
      type: 'mindfulness',
      instructions: 'Take deep breaths and focus on positive financial thoughts',
      exercises: [
        { id: 1, name: 'Deep Breathing', duration: 60, points: 20 },
        { id: 2, name: 'Positive Affirmations', duration: 120, points: 30 },
        { id: 3, name: 'Gratitude Practice', duration: 180, points: 50 }
      ]
    },
    {
      id: 'trigger-identification',
      title: 'Spending Trigger Hunt',
      description: 'Identify and understand your emotional spending triggers',
      icon: Target,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      duration: '10 minutes',
      difficulty: 'Medium',
      points: 150,
      type: 'awareness',
      instructions: 'Analyze scenarios and identify potential spending triggers',
      scenarios: [
        { id: 1, scenario: 'You had a stressful day at work', trigger: 'Stress relief', points: 25 },
        { id: 2, scenario: 'You feel lonely and bored', trigger: 'Comfort seeking', points: 25 },
        { id: 3, scenario: 'You see a sale notification', trigger: 'FOMO', points: 25 },
        { id: 4, scenario: 'You want to celebrate success', trigger: 'Reward seeking', points: 25 },
        { id: 5, scenario: 'You feel overwhelmed', trigger: 'Escape mechanism', points: 25 }
      ]
    },
    {
      id: 'mindset-transformation',
      title: 'Money Mindset Quest',
      description: 'Transform limiting beliefs about money into empowering ones',
      icon: Sparkles,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      duration: '15 minutes',
      difficulty: 'Hard',
      points: 200,
      type: 'transformation',
      instructions: 'Replace negative money thoughts with positive ones',
      beliefs: [
        { id: 1, negative: 'I\'m bad with money', positive: 'I\'m learning to be better with money', points: 40 },
        { id: 2, negative: 'I\'ll never be wealthy', positive: 'I can build wealth through smart choices', points: 40 },
        { id: 3, negative: 'Money is the root of all evil', positive: 'Money is a tool for good', points: 40 },
        { id: 4, negative: 'I don\'t deserve financial success', positive: 'I deserve financial security and abundance', points: 40 },
        { id: 5, negative: 'I can\'t save money', positive: 'I can save money by making small changes', points: 40 }
      ]
    },
    {
      id: 'confidence-building',
      title: 'Financial Confidence Builder',
      description: 'Build confidence in your financial decision-making abilities',
      icon: Shield,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      duration: '8 minutes',
      difficulty: 'Medium',
      points: 120,
      type: 'confidence',
      instructions: 'Practice making confident financial decisions',
      decisions: [
        { id: 1, situation: 'Emergency fund vs. vacation', correct: 'Emergency fund', points: 30 },
        { id: 2, situation: 'Pay debt vs. invest', correct: 'Pay high-interest debt first', points: 30 },
        { id: 3, situation: 'Buy now vs. save', correct: 'Save and buy later', points: 30 },
        { id: 4, situation: 'Spend vs. invest bonus', correct: 'Invest the bonus', points: 30 }
      ]
    }
  ];

  // Sample leaderboard data
  useEffect(() => {
    const leaderboard = [
      { id: 1, name: 'Sarah M.', points: 2840, level: 8, games: 15 },
      { id: 2, name: 'Mike R.', points: 2650, level: 7, games: 12 },
      { id: 3, name: 'Alex K.', points: 2420, level: 6, games: 14 },
      { id: 4, name: 'Emma L.', points: 2180, level: 5, games: 10 },
      { id: 5, name: 'David P.', points: 1950, level: 4, games: 8 }
    ];
    setLeaderboardData(leaderboard);
  }, []);

  const startGame = (game) => {
    setCurrentGame(game);
    setGameProgress({
      currentExercise: 0,
      completedExercises: [],
      totalPoints: 0,
      timeRemaining: game.duration
    });
  };

  const completeExercise = (exerciseId, points) => {
    setGameProgress(prev => ({
      ...prev,
      completedExercises: [...prev.completedExercises, exerciseId],
      totalPoints: prev.totalPoints + points,
      currentExercise: prev.currentExercise + 1
    }));
  };

  const finishGame = () => {
    const finalPoints = gameProgress.totalPoints;
    setUserStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      gamesWon: prev.gamesWon + 1,
      totalPoints: prev.totalPoints + finalPoints,
      streak: prev.streak + 1
    }));
    setCurrentGame(null);
    setGameProgress({});
  };

  const getGameIcon = (game) => {
    const IconComponent = game.icon;
    return <IconComponent className={`w-6 h-6 ${game.color}`} />;
  };

  const renderGameContent = () => {
    if (!currentGame) return null;

    switch (currentGame.type) {
      case 'mindfulness':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentGame.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentGame.instructions}</p>
            </div>
            
            <div className="space-y-4">
              {currentGame.exercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                    <span className="text-sm text-gray-600">{exercise.duration}s</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Duration: {exercise.duration} seconds</span>
                    </div>
                    <button
                      onClick={() => completeExercise(exercise.id, exercise.points)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'awareness':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentGame.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentGame.instructions}</p>
            </div>
            
            <div className="space-y-4">
              {currentGame.scenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Scenario: {scenario.scenario}
                  </h4>
                  <p className="text-gray-600 mb-3">
                    What spending trigger might this create?
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => completeExercise(scenario.id, scenario.points)}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      {scenario.trigger}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'transformation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentGame.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentGame.instructions}</p>
            </div>
            
            <div className="space-y-4">
              {currentGame.beliefs.map((belief) => (
                <motion.div
                  key={belief.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="mb-3">
                    <h4 className="font-semibold text-red-600 mb-2">
                      Limiting Belief: {belief.negative}
                    </h4>
                    <h4 className="font-semibold text-green-600">
                      Empowering Belief: {belief.positive}
                    </h4>
                  </div>
                  <button
                    onClick={() => completeExercise(belief.id, belief.points)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Transform This Belief
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'confidence':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentGame.title}
              </h3>
              <p className="text-gray-600 mb-4">{currentGame.instructions}</p>
            </div>
            
            <div className="space-y-4">
              {currentGame.decisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Situation: {decision.situation}
                  </h4>
                  <p className="text-gray-600 mb-3">
                    What would be the most confident financial decision?
                  </p>
                  <button
                    onClick={() => completeExercise(decision.id, decision.points)}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    {decision.correct}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Financial Therapy Games
              </h1>
              <p className="text-gray-600">
                Transform your financial mindset through engaging therapy games
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Level</h3>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.level}</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Points</h3>
              <Award className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Games Won</h3>
              <Trophy className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.gamesWon}</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Win Rate</h3>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {userStats.totalGames > 0 ? Math.round((userStats.gamesWon / userStats.totalGames) * 100) : 0}%
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Streak</h3>
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userStats.streak}</div>
          </div>
        </motion.div>

        {/* Game Selection */}
        {!currentGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {games.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 ${game.bgColor} hover:shadow-md`}
                onClick={() => startGame(game)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getGameIcon(game)}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{game.title}</h3>
                      <p className="text-gray-600 text-sm">{game.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{game.points}</div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{game.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{game.difficulty}</span>
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center space-x-2 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Start Game</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Current Game */}
        <AnimatePresence>
          {currentGame && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getGameIcon(currentGame)}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentGame.title}</h2>
                    <p className="text-gray-600">Progress: {gameProgress.completedExercises.length} completed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{gameProgress.totalPoints}</div>
                    <div className="text-xs text-gray-600">points earned</div>
                  </div>
                  <button
                    onClick={() => setCurrentGame(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Exit Game
                  </button>
                </div>
              </div>
              
              {renderGameContent()}
              
              {gameProgress.completedExercises.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={finishGame}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Complete Game & Earn {gameProgress.totalPoints} Points
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              
              <div className="space-y-3">
                {leaderboardData.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{player.name}</h3>
                        <p className="text-sm text-gray-600">Level {player.level} • {player.games} games</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{player.points}</div>
                      <div className="text-xs text-gray-600">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinancialTherapyGames; 