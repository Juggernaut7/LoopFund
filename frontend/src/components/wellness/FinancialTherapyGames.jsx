import React, { useState, useEffect, useRef } from 'react';
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
  Calendar,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Home,
  Lock,
  AlertTriangle,
  Bookmark,
  Timer,
  Flame,
  Crown,
  Medal,
  Gift
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuthStore } from '../../store/useAuthStore';
import therapyGameService from '../../services/therapyGameService';

const FinancialTherapyGames = () => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, results, locked
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameProgress, setGameProgress] = useState({});
  const [userStats, setUserStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    totalPoints: 0,
    streak: 0,
    level: 1,
    experience: 0,
    unlockedGames: ['anxiety-reduction'],
    currentStreak: 0,
    bestStreak: 0,
    perfectGames: 0,
    totalTime: 0
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [gameTimer, setGameTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isQuestionTimerRunning, setIsQuestionTimerRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameSession, setGameSession] = useState({
    startTime: null,
    endTime: null,
    totalQuestions: 0,
    correctAnswers: 0,
    timePerQuestion: [],
    difficulty: 'easy'
  });
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const questionTimerRef = useRef(null);
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Professional, evidence-based therapy games with strict validation
  const games = [
    {
      id: 'anxiety-reduction',
      title: 'Financial Anxiety Reduction',
      description: 'Evidence-based CBT techniques to reduce financial stress and anxiety',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      duration: '8 minutes',
      difficulty: 'Beginner',
      points: 100,
      type: 'mindfulness',
      category: 'Emotional Wellness',
      requiredLevel: 1,
      timeLimit: 30, // seconds per question
      questions: [
        {
          id: 1,
          type: 'cognitive_restructuring',
          question: 'You check your bank account and see a lower balance than expected. What\'s the most helpful thought?',
          options: [
            'I\'m terrible with money and will never get ahead',
            'This is a learning opportunity to understand my spending',
            'I should avoid checking my account to reduce stress',
            'I need to panic and cut all expenses immediately'
          ],
          correct: 1,
          explanation: 'Cognitive restructuring helps replace catastrophic thinking with balanced, solution-focused thoughts.',
          points: 25,
          therapeuticGoal: 'Reduce catastrophic thinking about finances'
        },
        {
          id: 2,
          type: 'mindfulness',
          question: 'When you feel financial anxiety, what breathing technique is most effective?',
          options: [
            'Rapid shallow breathing',
            '4-7-8 breathing (inhale 4, hold 7, exhale 8)',
            'Holding your breath',
            'Breathing through your mouth only'
          ],
          correct: 1,
          explanation: 'The 4-7-8 breathing technique activates the parasympathetic nervous system, reducing anxiety.',
          points: 25,
          therapeuticGoal: 'Implement stress reduction techniques'
        },
        {
          id: 3,
          type: 'grounding',
          question: 'During a financial panic attack, which grounding technique should you use first?',
          options: [
            '5-4-3-2-1 technique (5 things you see, 4 you hear, etc.)',
            'Immediately check all your accounts',
            'Call someone to vent about your problems',
            'Make an impulse purchase to feel better'
          ],
          correct: 0,
          explanation: 'The 5-4-3-2-1 grounding technique helps anchor you in the present moment during anxiety.',
          points: 25,
          therapeuticGoal: 'Develop grounding skills for anxiety management'
        },
        {
          id: 4,
          type: 'progressive_muscle_relaxation',
          question: 'What is the correct order for progressive muscle relaxation?',
          options: [
            'Tense all muscles at once, then relax',
            'Tense each muscle group for 5 seconds, then relax for 10 seconds',
            'Only relax without tensing',
            'Tense muscles for 30 seconds continuously'
          ],
          correct: 1,
          explanation: 'Progressive muscle relaxation involves systematic tensing and relaxing of muscle groups to reduce physical tension.',
          points: 25,
          therapeuticGoal: 'Learn physical relaxation techniques'
        }
      ]
    },
    {
      id: 'trigger-identification',
      title: 'Spending Trigger Analysis',
      description: 'Identify emotional and behavioral triggers that lead to problematic spending',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      duration: '12 minutes',
      difficulty: 'Intermediate',
      points: 150,
      type: 'behavioral_analysis',
      category: 'Behavioral Analysis',
      requiredLevel: 2,
      timeLimit: 45,
      questions: [
        {
          id: 1,
          type: 'trigger_recognition',
          question: 'Which emotional state is most commonly associated with impulse spending?',
          options: [
            'Contentment and satisfaction',
            'Boredom and loneliness',
            'Confidence and empowerment',
            'Calm and relaxation'
          ],
          correct: 1,
          explanation: 'Boredom and loneliness are primary emotional triggers for impulse spending as people seek emotional fulfillment through purchases.',
          points: 30,
          therapeuticGoal: 'Recognize emotional spending triggers'
        },
        {
          id: 2,
          type: 'situation_analysis',
          question: 'You receive a "50% off" email notification. What\'s the healthiest response?',
          options: [
            'Immediately click and buy something you\'ve been wanting',
            'Delete the email without opening it',
            'Evaluate if you actually need anything and set a 24-hour rule',
            'Forward it to friends so they can benefit'
          ],
          correct: 2,
          explanation: 'The 24-hour rule and need evaluation help prevent FOMO-driven purchases and promote mindful spending.',
          points: 30,
          therapeuticGoal: 'Develop resistance to marketing triggers'
        },
        {
          id: 3,
          type: 'pattern_recognition',
          question: 'What time of day are people most vulnerable to emotional spending?',
          options: [
            'Early morning (6-8 AM)',
            'Late evening (8-11 PM)',
            'Midday (12-2 PM)',
            'Late afternoon (4-6 PM)'
          ],
          correct: 1,
          explanation: 'Late evening is when people are most vulnerable due to decision fatigue, emotional exhaustion, and reduced self-control.',
          points: 30,
          therapeuticGoal: 'Identify high-risk time periods'
        },
        {
          id: 4,
          type: 'intervention_strategy',
          question: 'What\'s the most effective intervention when you feel a spending urge?',
          options: [
            'Immediately remove your wallet from reach',
            'Wait 10 minutes and reassess the urge',
            'Call a friend to talk you out of it',
            'All of the above'
          ],
          correct: 3,
          explanation: 'Combining multiple intervention strategies provides the strongest protection against impulse spending.',
          points: 30,
          therapeuticGoal: 'Implement effective spending interventions'
        }
      ]
    },
    {
      id: 'mindset-transformation',
      title: 'Money Mindset Transformation',
      description: 'Transform limiting beliefs and develop empowering financial mindsets',
      icon: Sparkles,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      duration: '15 minutes',
      difficulty: 'Advanced',
      points: 200,
      type: 'cognitive_restructuring',
      category: 'Mindset Shift',
      requiredLevel: 3,
      timeLimit: 60,
      questions: [
        {
          id: 1,
          type: 'belief_challenge',
          question: 'The belief "I\'m bad with money" is an example of what cognitive distortion?',
          options: [
            'All-or-nothing thinking',
            'Mind reading',
            'Fortune telling',
            'Catastrophizing'
          ],
          correct: 0,
          explanation: 'All-or-nothing thinking creates false dichotomies and prevents growth. Money skills are learnable and improvable.',
          points: 40,
          therapeuticGoal: 'Identify and challenge cognitive distortions'
        },
        {
          id: 2,
          type: 'reframing',
          question: 'How would you reframe "I can\'t afford it" into an empowering statement?',
          options: [
            'I choose not to spend money on this right now',
            'I\'m prioritizing other financial goals',
            'This doesn\'t align with my current budget',
            'All of the above'
          ],
          correct: 3,
          explanation: 'Reframing from "can\'t" to "choose not to" empowers you and emphasizes personal agency in financial decisions.',
          points: 40,
          therapeuticGoal: 'Develop empowering financial language'
        },
        {
          id: 3,
          type: 'abundance_mindset',
          question: 'What characterizes an abundance mindset about money?',
          options: [
            'Believing there\'s never enough money',
            'Seeing money as a tool for creating value',
            'Hoarding money out of fear',
            'Avoiding all financial discussions'
          ],
          correct: 1,
          explanation: 'An abundance mindset views money as a tool for creating value and opportunities, not as a source of scarcity.',
          points: 40,
          therapeuticGoal: 'Cultivate abundance thinking'
        },
        {
          id: 4,
          type: 'self_worth',
          question: 'How does self-worth relate to financial behavior?',
          options: [
            'People with low self-worth often overspend to feel better',
            'Self-worth and financial behavior are unrelated',
            'High self-worth always leads to good financial decisions',
            'Self-worth only affects investment decisions'
          ],
          correct: 0,
          explanation: 'Low self-worth often leads to emotional spending as people try to fill emotional voids with material possessions.',
          points: 40,
          therapeuticGoal: 'Understand the connection between self-worth and spending'
        }
      ]
    },
    {
      id: 'confidence-building',
      title: 'Financial Decision Confidence',
      description: 'Build confidence in financial decision-making through evidence-based strategies',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      duration: '18 minutes',
      difficulty: 'Expert',
      points: 250,
      type: 'skill_building',
      category: 'Skill Building',
      requiredLevel: 4,
      timeLimit: 90,
      questions: [
        {
          id: 1,
          type: 'decision_framework',
          question: 'What\'s the first step in making a confident financial decision?',
          options: [
            'Ask friends for their opinion',
            'Gather relevant information and data',
            'Make the decision quickly to avoid overthinking',
            'Avoid making the decision altogether'
          ],
          correct: 1,
          explanation: 'Informed decisions require gathering relevant information first. This builds confidence in your choice.',
          points: 50,
          therapeuticGoal: 'Develop systematic decision-making processes'
        },
        {
          id: 2,
          type: 'risk_assessment',
          question: 'How should you approach financial risks?',
          options: [
            'Avoid all risks to stay safe',
            'Take high risks for high rewards',
            'Assess risks based on your goals and risk tolerance',
            'Let others make risk decisions for you'
          ],
          correct: 2,
          explanation: 'Risk assessment should be personalized based on your financial goals, timeline, and comfort level.',
          points: 50,
          therapeuticGoal: 'Develop risk assessment skills'
        },
        {
          id: 3,
          type: 'goal_alignment',
          question: 'What\'s the most important factor when evaluating a financial opportunity?',
          options: [
            'How much money you can make',
            'How it aligns with your financial goals',
            'What your friends think about it',
            'How quickly you can get your money back'
          ],
          correct: 1,
          explanation: 'Goal alignment ensures your financial decisions support your long-term objectives and values.',
          points: 50,
          therapeuticGoal: 'Align decisions with personal goals'
        },
        {
          id: 4,
          type: 'confidence_building',
          question: 'How do you build confidence in financial decision-making?',
          options: [
            'Start with small decisions and gradually increase complexity',
            'Only make decisions you\'re 100% certain about',
            'Avoid making any financial decisions',
            'Always follow others\' advice'
          ],
          correct: 0,
          explanation: 'Confidence builds through practice. Start small, learn from outcomes, and gradually tackle more complex decisions.',
          points: 50,
          therapeuticGoal: 'Build decision-making confidence through practice'
        }
      ]
    }
  ];

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      setIsLoadingLeaderboard(true);
      const response = await therapyGameService.getLeaderboard(10);
      setLeaderboardData(response.data.data || []);
      
      // Get user's rank
      const rankResponse = await therapyGameService.getUserRank();
      setUserRank(rankResponse.data.data?.rank || null);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast('Failed to load leaderboard', 'error');
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setGameTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning && gameTimer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameTimer]);

  useEffect(() => {
    let interval = null;
    if (isQuestionTimerRunning) {
      interval = setInterval(() => {
        setQuestionTimer(timer => timer + 1);
      }, 1000);
    } else if (!isQuestionTimerRunning && questionTimer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isQuestionTimerRunning, questionTimer]);

  const startGame = (game) => {
    // Check if game is unlocked
    if (!userStats.unlockedGames.includes(game.id)) {
      toast(`Complete previous games to unlock ${game.title}`, 'error');
      return;
    }

    setCurrentGame(game);
    setGameState('playing');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setGameTimer(0);
    setQuestionTimer(0);
    setIsTimerRunning(true);
    setIsQuestionTimerRunning(true);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowExplanation(false);
    
    setGameSession({
      startTime: new Date(),
      endTime: null,
      totalQuestions: game.questions.length,
      correctAnswers: 0,
      timePerQuestion: [],
      difficulty: game.difficulty.toLowerCase()
    });

    toast(`Starting ${game.title}! Good luck!`, 'success');
  };

  const selectAnswer = (answerIndex) => {
    if (answerSubmitted) return; // Prevent multiple selections
    
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || answerSubmitted) return;

    const question = currentGame.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    const timeBonus = Math.max(0, (question.timeLimit || 30) - questionTimer);
    const basePoints = question.points || 25; // Default to 25 points if not defined
    const points = isCorrect ? basePoints + timeBonus : 0;

    setAnswerSubmitted(true);
    setShowExplanation(true);

    setUserAnswers(prev => [...prev, {
      questionId: question.id,
      answer: selectedAnswer,
      isCorrect,
      points,
      timeSpent: questionTimer,
      timeBonus
    }]);

    // Update game session
    setGameSession(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      timePerQuestion: [...prev.timePerQuestion, questionTimer]
    }));

    // Show feedback
    if (isCorrect) {
      toast(`Correct! +${points} points (${timeBonus} time bonus)`, 'success');
    } else {
      toast(`Incorrect. The correct answer was: ${question.options[question.correct]}`, 'error');
    }

    // Stop question timer
    setIsQuestionTimerRunning(false);

    // Don't auto-advance, wait for user to click continue
  };

  const nextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setQuestionTimer(0);
    setIsQuestionTimerRunning(true);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowExplanation(false);
  };

  const endGame = async () => {
    setIsTimerRunning(false);
    setIsQuestionTimerRunning(false);
    setGameState('results');
    
    const totalPoints = userAnswers.reduce((sum, answer) => sum + (answer.points || 0), 0);
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = Math.round((correctAnswers / userAnswers.length) * 100);
    const isPerfect = accuracy === 100;
    const isPassing = accuracy >= 70;

    // Calculate new level and experience
    const newExperience = userStats.experience + totalPoints;
    const newLevel = Math.floor(newExperience / 500) + 1;
    const newStreak = isPassing ? userStats.currentStreak + 1 : 0;
    const newBestStreak = Math.max(userStats.bestStreak, newStreak);

    // Unlock next game if passing
    let newUnlockedGames = [...userStats.unlockedGames];
    if (isPassing && currentGame) {
      const currentIndex = games.findIndex(g => g.id === currentGame.id);
      if (currentIndex < games.length - 1) {
        const nextGame = games[currentIndex + 1];
        if (!newUnlockedGames.includes(nextGame.id)) {
          newUnlockedGames.push(nextGame.id);
          setShowAchievement({
            title: 'Game Unlocked!',
            description: `${nextGame.title} is now available!`,
            icon: Lock,
            color: 'text-blue-600'
          });
        }
      }
    }

    // Check for achievements
    const newAchievements = [];
    if (isPerfect) {
      newAchievements.push({
        title: 'Perfect Score!',
        description: 'You got 100% accuracy!',
        icon: Crown,
        color: 'text-yellow-600'
      });
    }
    if (newStreak >= 5) {
      newAchievements.push({
        title: 'Streak Master!',
        description: '5 games in a row!',
        icon: Flame,
        color: 'text-orange-600'
      });
    }
    if (newLevel > userStats.level) {
      newAchievements.push({
        title: 'Level Up!',
        description: `You reached level ${newLevel}!`,
        icon: Star,
        color: 'text-purple-600'
      });
    }

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      gamesWon: prev.gamesWon + (isPassing ? 1 : 0),
      totalPoints: prev.totalPoints + totalPoints,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      perfectGames: prev.perfectGames + (isPerfect ? 1 : 0),
      totalTime: prev.totalTime + gameTimer,
      experience: newExperience,
      level: newLevel,
      unlockedGames: newUnlockedGames
    }));

    // Show achievements
    if (newAchievements.length > 0) {
      setShowAchievement(newAchievements[0]);
    }

    // Update game session
    setGameSession(prev => ({
      ...prev,
      endTime: new Date()
    }));

    // Save score to backend
    try {
      await therapyGameService.saveGameScore({
        gameId: currentGame.id,
        gameTitle: currentGame.title,
        score: totalPoints,
        totalPoints: totalPoints,
        accuracy: accuracy,
        timeSpent: gameTimer,
        questionsAnswered: currentGame.questions.length,
        correctAnswers: correctAnswers,
        difficulty: currentGame.difficulty,
        isPerfect: isPerfect,
        timeBonus: userAnswers.reduce((sum, answer) => sum + (answer.timeBonus || 0), 0)
      });

      // Reload leaderboard after saving score
      loadLeaderboard();
    } catch (error) {
      console.error('Error saving game score:', error);
      toast('Failed to save score', 'error');
    }

    const message = isPerfect 
      ? `Perfect! ${totalPoints} points with 100% accuracy!` 
      : isPassing 
      ? `Great job! ${totalPoints} points with ${accuracy}% accuracy!`
      : `Keep practicing! ${totalPoints} points with ${accuracy}% accuracy.`;

    toast(message, isPassing ? 'success' : 'info');
  };

  const resetGame = () => {
    setCurrentGame(null);
    setGameState('menu');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setGameTimer(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Emotional Wellness': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'Behavioral Analysis': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'Mindset Shift': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'Skill Building': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  if (gameState === 'playing' && currentGame) {
    const question = currentGame.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentGame.questions.length) * 100;
    const timeRemaining = question.timeLimit - questionTimer;
    const isTimeUp = timeRemaining <= 0;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Header */}
                <motion.div
            initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${currentGame.bgColor}`}>
                  <currentGame.icon className={`w-6 h-6 ${currentGame.color}`} />
                  </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentGame.title}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Question {currentQuestion + 1} of {currentGame.questions.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Question Time</p>
                  <p className={`font-mono text-lg font-bold ${timeRemaining <= 10 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                    {timeRemaining}s
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Time</p>
                  <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                    {formatTime(gameTimer)}
                  </p>
                    </div>
                    <button
                  onClick={resetGame}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                  <XCircle className="w-6 h-6" />
                    </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
                  </div>
                </motion.div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 mb-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {question.question}
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(currentGame.category)}`}>
                  {currentGame.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentGame.difficulty)}`}>
                  {currentGame.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {question.points} points
                </span>
            </div>
              
              {/* Question Timer */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                <motion.div
                  className={`h-2 rounded-full ${timeRemaining <= 10 ? 'bg-red-500' : 'bg-orange-500'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / question.timeLimit) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
          </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {question.options.map((option, index) => {
                let buttonClass = "p-6 text-left border rounded-xl transition-all duration-200 group ";
                
                if (answerSubmitted) {
                  if (index === question.correct) {
                    buttonClass += "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 ";
                  } else if (index === selectedAnswer && index !== question.correct) {
                    buttonClass += "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 ";
                  } else {
                    buttonClass += "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 ";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 ";
                  } else {
                    buttonClass += "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 ";
                  }
                }

        return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!answerSubmitted ? { scale: 1.02 } : {}}
                    whileTap={!answerSubmitted ? { scale: 0.98 } : {}}
                    onClick={() => !answerSubmitted && selectAnswer(index)}
                    disabled={answerSubmitted}
                    className={buttonClass}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        answerSubmitted 
                          ? index === question.correct 
                            ? 'bg-blue-200 dark:bg-blue-800' 
                            : index === selectedAnswer 
                              ? 'bg-red-200 dark:bg-red-800'
                              : 'bg-slate-200 dark:bg-slate-600'
                          : selectedAnswer === index
                            ? 'bg-blue-200 dark:bg-blue-800'
                            : 'bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50'
                      }`}>
                        <span className={`text-sm font-bold ${
                          answerSubmitted 
                            ? index === question.correct 
                              ? 'text-blue-800 dark:text-blue-200' 
                              : index === selectedAnswer 
                                ? 'text-red-800 dark:text-red-200'
                                : 'text-slate-600 dark:text-slate-400'
                            : selectedAnswer === index
                              ? 'text-blue-800 dark:text-blue-200'
                              : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        answerSubmitted 
                          ? index === question.correct 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : index === selectedAnswer 
                              ? 'text-red-900 dark:text-red-100'
                              : 'text-slate-600 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {option}
                      </span>
                      {answerSubmitted && index === question.correct && (
                        <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                      {answerSubmitted && index === selectedAnswer && index !== question.correct && (
                        <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!answerSubmitted && (
            <div className="text-center">
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null || isTimeUp}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    selectedAnswer === null || isTimeUp
                      ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isTimeUp ? 'Time\'s Up!' : selectedAnswer === null ? 'Select an Answer' : 'Submit Answer'}
                </button>
            </div>
            )}
            
            {/* Explanation */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Explanation:
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {question.explanation}
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                  <strong>Therapeutic Goal:</strong> {question.therapeuticGoal}
                </p>
                
                {/* Continue Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      if (currentQuestion < currentGame.questions.length - 1) {
                        nextQuestion();
                      } else {
                        endGame();
                      }
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <span>
                      {currentQuestion < currentGame.questions.length - 1 ? 'Continue' : 'Finish Game'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
            </div>
          </div>
        );
  }

  if (gameState === 'results' && currentGame) {
    const totalPoints = userAnswers.reduce((sum, answer) => sum + (answer.points || 0), 0);
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = Math.round((correctAnswers / userAnswers.length) * 100);
    const timeBonus = Math.max(0, 100 - gameTimer); // Bonus for faster completion
    const finalScore = (totalPoints || 0) + timeBonus;

        return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Game Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Great job completing {currentGame.title}
            </p>
          </motion.div>

          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {accuracy}%
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Accuracy</p>
                </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center"
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {finalScore}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Total Points</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {formatTime(gameTimer)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Time Taken</p>
            </motion.div>
            </div>
            
          {/* Detailed Results */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Question Review
            </h3>
            <div className="space-y-4">
              {userAnswers.map((answer, index) => {
                const question = currentGame.questions[index];
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      answer.isCorrect 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Question {index + 1}
                  </h4>
                      <div className="flex items-center space-x-2">
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          +{answer.points || 0} pts
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {question.question}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>Your answer:</strong> {question.options[answer.answer]}
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                        <strong>Correct answer:</strong> {question.options[question.correct]}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
                  <button
              onClick={resetGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Games</span>
            </button>
            <button
              onClick={() => startGame(currentGame)}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Play Again</span>
                  </button>
                </motion.div>
            </div>
          </div>
        );
    }

  // Main menu view
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-600 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Financial Therapy Games
              </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Transform your relationship with money through interactive games designed to build confidence, reduce anxiety, and develop healthy financial habits.
          </p>
        </motion.div>

        {/* User Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {userStats.totalGames}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Games Played</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {userStats.totalPoints || 0}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Total Points</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {userStats.streak}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Win Streak</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              Level {userStats.level || 1}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Current Level</p>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {games.map((game, index) => {
            const isUnlocked = userStats.unlockedGames.includes(game.id);
            const isLocked = !isUnlocked;
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={isUnlocked ? { scale: 1.02 } : {}}
                className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ${
                  isUnlocked ? 'hover:shadow-lg' : 'opacity-75'
                }`}
              >
                <div className={`p-6 ${game.bgColor} border-b ${game.borderColor} relative`}>
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${game.bgColor}`}>
                      <game.icon className={`w-6 h-6 ${game.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {game.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {game.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Level {game.requiredLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{game.points} points</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>{game.timeLimit}s per question</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {isUnlocked ? (
                    <button
                      onClick={() => startGame(game)}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Game</span>
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 mb-2">
                        <Lock className="w-5 h-5" />
                        <span className="font-medium">Locked</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Complete previous games to unlock
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Leaderboard
            </h3>
            <div className="flex items-center space-x-4">
              {userRank && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Your Rank: <span className="font-semibold text-blue-600">#{userRank}</span>
                </div>
              )}
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{showLeaderboard ? 'Show Less' : 'View All'}</span>
                {showLeaderboard ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isLoadingLeaderboard ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600 dark:text-slate-400">Loading leaderboard...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No scores yet. Be the first to play and appear on the leaderboard!
                  </p>
                </div>
              ) : (
                leaderboardData.slice(0, showLeaderboard ? 10 : 5).map((player, index) => (
                  <div
                    key={player.userId}
                    className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      player.userId === user?.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      player.rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      player.rank === 2 ? 'bg-gray-100 dark:bg-gray-700' :
                      player.rank === 3 ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      <span className={`text-sm font-bold ${
                        player.rank === 1 ? 'text-yellow-600' :
                        player.rank === 2 ? 'text-gray-600 dark:text-gray-400' :
                        player.rank === 3 ? 'text-orange-600' :
                        'text-slate-600 dark:text-slate-400'
                      }`}>
                        {player.rank}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {player.name}
                        {player.userId === user?.id && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {player.totalGames} games • {player.averageAccuracy}% avg accuracy
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {player.totalScore.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">points</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialTherapyGames; 