import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Target,
  Calendar,
  BarChart3,
  DollarSign,
  Clock,
  Lightbulb,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Info,
  Heart,
  Brain,
  Users
} from 'lucide-react';

const PredictiveFinancialHealth = () => {
  const [forecastPeriod, setForecastPeriod] = useState(6);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [financialHealth, setFinancialHealth] = useState({
    current: 72,
    predicted: 78,
    trend: 'improving'
  });
  const [crisisAlerts, setCrisisAlerts] = useState([]);
  const [opportunityCosts, setOpportunityCosts] = useState([]);
  const [lifeEvents, setLifeEvents] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overall');

  // Sample crisis alerts
  useEffect(() => {
    const alerts = [
      {
        id: 1,
        type: 'spending_spike',
        severity: 'high',
        title: 'Potential Spending Spike Detected',
        description: 'Based on your patterns, you may spend 40% more next week due to stress triggers',
        probability: 85,
        impact: 'high',
        recommendation: 'Enable spending pause alerts and review your emotional triggers',
        timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        actions: ['Enable Alerts', 'Review Triggers', 'Set Spending Limit']
      },
      {
        id: 2,
        type: 'savings_dip',
        severity: 'medium',
        title: 'Savings Rate May Decline',
        description: 'Your savings rate could drop by 25% in the next month due to upcoming expenses',
        probability: 65,
        impact: 'medium',
        recommendation: 'Consider adjusting your budget or finding additional income sources',
        timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        actions: ['Adjust Budget', 'Find Side Income', 'Review Expenses']
      },
      {
        id: 3,
        type: 'goal_at_risk',
        severity: 'low',
        title: 'Emergency Fund Goal at Risk',
        description: 'You may fall short of your emergency fund goal by $2,000 if current patterns continue',
        probability: 45,
        impact: 'low',
        recommendation: 'Increase monthly savings by $200 or extend timeline by 2 months',
        timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        actions: ['Increase Savings', 'Extend Timeline', 'Review Goals']
      }
    ];
    setCrisisAlerts(alerts);
  }, []);

  // Sample opportunity costs
  useEffect(() => {
    const costs = [
      {
        id: 1,
        scenario: 'Daily Coffee Purchase',
        currentCost: 5,
        frequency: 'daily',
        annualCost: 1825,
        opportunity: 'Invested in S&P 500',
        potentialReturn: 2920,
        lostGrowth: 1095,
        recommendation: 'Consider making coffee at home 3 days per week'
      },
      {
        id: 2,
        scenario: 'Impulse Online Shopping',
        currentCost: 50,
        frequency: 'weekly',
        annualCost: 2600,
        opportunity: 'Emergency Fund',
        potentialReturn: 2600,
        lostGrowth: 0,
        recommendation: 'Implement 24-hour purchase rule for items over $25'
      },
      {
        id: 3,
        scenario: 'Subscription Services',
        currentCost: 30,
        frequency: 'monthly',
        annualCost: 360,
        opportunity: 'High-Yield Savings',
        potentialReturn: 396,
        lostGrowth: 36,
        recommendation: 'Review and cancel unused subscriptions'
      }
    ];
    setOpportunityCosts(costs);
  }, []);

  // Sample life events
  useEffect(() => {
    const events = [
      {
        id: 1,
        event: 'Home Purchase',
        probability: 35,
        timeline: '2 years',
        estimatedCost: 250000,
        impact: 'major',
        preparation: 'Save $50,000 for down payment',
        monthlySavings: 2083,
        currentProgress: 45
      },
      {
        id: 2,
        event: 'Career Change',
        probability: 60,
        timeline: '1 year',
        estimatedCost: 15000,
        impact: 'medium',
        preparation: 'Build emergency fund and skill development',
        monthlySavings: 1250,
        currentProgress: 70
      },
      {
        id: 3,
        event: 'Starting Business',
        probability: 25,
        timeline: '3 years',
        estimatedCost: 50000,
        impact: 'major',
        preparation: 'Save startup capital and build credit',
        monthlySavings: 1389,
        currentProgress: 20
      }
    ];
    setLifeEvents(events);
  }, []);

  const getRiskColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'improving' ? 'text-green-500' : 'text-red-500';
  };

  const TrendIcon = getTrendIcon(financialHealth.trend);
  const trendColor = getTrendColor(financialHealth.trend);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
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
                Predictive Financial Health
              </h1>
              <p className="text-gray-600">
                AI-powered forecasting to prevent financial crises and maximize opportunities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Analysis</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Financial Health Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Health Score</h3>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{financialHealth.current}/100</div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className={trendColor}>Improving</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">6-Month Forecast</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{financialHealth.predicted}/100</div>
            <div className="text-sm text-gray-600">
              +{financialHealth.predicted - financialHealth.current} points expected
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Level</h3>
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2 capitalize">{riskLevel}</div>
            <div className="text-sm text-gray-600">
              {riskLevel === 'low' ? 'Low risk of financial stress' : 
               riskLevel === 'medium' ? 'Moderate risk - stay vigilant' : 
               'High risk - take action now'}
            </div>
          </div>
        </motion.div>

        {/* Crisis Prevention Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Crisis Prevention Alerts</h2>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">{crisisAlerts.length} active alerts</span>
            </div>
          </div>

          <div className="space-y-4">
            {crisisAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${getRiskColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alert.severity} risk
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>Probability: {alert.probability}%</span>
                      <span>Impact: {alert.impact}</span>
                      <span>Timeline: {alert.timestamp.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      Recommendation: {alert.recommendation}
                    </p>
                    <div className="flex space-x-2">
                      {alert.actions.map((action, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Opportunity Cost Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Opportunity Cost Analysis</h2>
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunityCosts.map((cost) => (
              <motion.div
                key={cost.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{cost.scenario}</h3>
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Annual Cost:</span>
                    <span className="font-medium">${cost.annualCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">If Invested:</span>
                    <span className="font-medium text-green-600">${cost.potentialReturn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lost Growth:</span>
                    <span className="font-medium text-red-600">${cost.lostGrowth.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800 font-medium">
                    💡 {cost.recommendation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Life Event Planning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Life Event Planning</h2>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {lifeEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{event.event}</h3>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {event.probability}% likely
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium">{event.timeline}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-medium">${event.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Savings Needed:</span>
                    <span className="font-medium">${event.monthlySavings.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Preparation Progress</span>
                    <span className="font-medium">{event.currentProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${event.currentProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-800 font-medium">
                    🎯 {event.preparation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advanced Analytics Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Analytics</span>
          </button>
        </motion.div>

        {/* Advanced Analytics */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Spending Pattern Analysis</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Emotional Spending</span>
                      <span className="text-sm font-medium">32% of total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Necessary Expenses</span>
                      <span className="text-sm font-medium">45% of total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Investment/Savings</span>
                      <span className="text-sm font-medium">23% of total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm text-gray-700">Emergency Fund Risk</span>
                      <span className="text-sm font-medium text-red-600">High</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-700">Debt-to-Income Ratio</span>
                      <span className="text-sm font-medium text-yellow-600">Medium</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">Savings Rate</span>
                      <span className="text-sm font-medium text-green-600">Low</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-gray-700">Investment Diversification</span>
                      <span className="text-sm font-medium text-orange-600">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PredictiveFinancialHealth; 