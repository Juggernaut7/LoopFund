import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Brain, 
  Target,
  Award,
  BarChart3,
  Users,
  Shield,
  Zap,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Trophy,
  Crown,
  Sparkles
} from "lucide-react";

const FinancialWellnessScore = () => {
  const [overallScore, setOverallScore] = useState(0);
  const [mentalHealthScore, setMentalHealthScore] = useState(0);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);
  const [socialHealthScore, setSocialHealthScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Sample score data
  useEffect(() => {
    setOverallScore(78);
    setMentalHealthScore(82);
    setFinancialHealthScore(75);
    setSocialHealthScore(79);
    
    const history = [
      { date: "Jan", overall: 65, mental: 68, financial: 62, social: 70 },
      { date: "Feb", overall: 68, mental: 71, financial: 65, social: 72 },
      { date: "Mar", overall: 72, mental: 75, financial: 68, social: 75 },
      { date: "Apr", overall: 75, mental: 78, financial: 71, social: 77 },
      { date: "May", overall: 78, mental: 82, financial: 75, social: 79 }
    ];
    setScoreHistory(history);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-secondary-600";
    if (score >= 60) return "text-primary-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-secondary-100 dark:bg-secondary-900/30";
    if (score >= 60) return "bg-primary-100 dark:bg-primary-900/30";
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return { level: "Exceptional", icon: Crown, color: "text-yellow-500" };
    if (score >= 80) return { level: "Excellent", icon: Trophy, color: "text-secondary-600" };
    if (score >= 70) return { level: "Good", icon: Star, color: "text-primary-600" };
    if (score >= 60) return { level: "Fair", icon: Target, color: "text-yellow-600" };
    return { level: "Needs Improvement", icon: Shield, color: "text-red-600" };
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulate score improvement
      setOverallScore(prev => Math.min(100, prev + 2));
    }, 3000);
  };

  const overallLevel = getScoreLevel(overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Financial Wellness Score
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Your comprehensive financial wellness rating combining mental health, financial health, and social support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overall Score */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Overall Wellness Score
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Your comprehensive financial wellness rating
                </p>
              </div>

              {/* Main Score Display */}
              <div className="text-center mb-6">
                <div className={`w-40 h-40 mx-auto mb-4 rounded-full ${getScoreBg(overallScore)} flex items-center justify-center relative`}>
                  <span className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </span>
                  <div className="absolute -top-2 -right-2">
                    <overallLevel.icon className={`w-8 h-8 ${overallLevel.color}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {overallLevel.level}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {overallScore >= 80 ? "Outstanding financial wellness! You are a role model for others." :
                     overallScore >= 60 ? "Good progress! Keep building on your strengths." :
                     overallScore >= 40 ? "You are making positive changes. Focus on consistency." : 
                     "Every journey starts with awareness. You are taking the right steps."}
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Mental Health</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{mentalHealthScore}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-secondary-600" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Financial Health</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{financialHealthScore}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Social Support</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{socialHealthScore}</span>
                </div>
              </div>

              {/* Analysis Button */}
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "Update Score"
                )}
              </button>
            </div>
          </div>

          {/* Middle Column - Score History */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Score History
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Track your wellness journey
                  </p>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* History Chart */}
              <div className="space-y-4">
                {scoreHistory.map((data, index) => (
                  <motion.div
                    key={data.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-900 dark:text-white">{data.date}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-2 py-1 rounded-full ${getScoreBg(data.overall)} ${getScoreColor(data.overall)}`}>
                          {data.overall}
                        </span>
                        {index > 0 && (
                          <div className="flex items-center space-x-1">
                            {data.overall > scoreHistory[index - 1].overall ? (
                              <ArrowUp className="w-3 h-3 text-secondary-600" />
                            ) : data.overall < scoreHistory[index - 1].overall ? (
                              <ArrowDown className="w-3 h-3 text-red-600" />
                            ) : (
                              <Minus className="w-3 h-3 text-slate-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-slate-600 dark:text-slate-400">Mental</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{data.mental}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-600 dark:text-slate-400">Financial</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{data.financial}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-600 dark:text-slate-400">Social</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{data.social}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Insights & Recommendations */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Wellness Insights */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-secondary-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Wellness Insights</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Strongest Area</span>
                      <span className="text-sm text-secondary-600 font-semibold">Mental Health</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Your emotional spending awareness is excellent. Keep leveraging this strength.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Growth Area</span>
                      <span className="text-sm text-primary-600 font-semibold">Financial Health</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Focus on building emergency fund and reducing high-interest debt.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Community Impact</span>
                      <span className="text-sm text-primary-600 font-semibold">High</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Your progress inspires others. Consider sharing your journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Recommendations */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recommendations</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Emergency Fund</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Increase emergency fund to 6 months of expenses
                    </p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-secondary-600" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Stress Management</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Practice daily mindfulness to maintain mental wellness
                    </p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Community</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Join a financial wellness support group
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Social Comparison */}
        <div className="mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Community Comparison
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                See how your financial wellness compares to others in your age group and income bracket (anonymously)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">78</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Your Score</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Top 25%</p>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-600">65</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Age Group Avg</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">25-35 years</p>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-600">58</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Income Level</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">$50k-$75k</p>
              </div>

              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary-600">82</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Community Goal</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Next milestone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialWellnessScore;
