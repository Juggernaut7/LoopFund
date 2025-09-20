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
  Users,
  Sparkles,
  Crown,
  Trophy,
  Star
} from 'lucide-react';
import { LoopFundButton, LoopFundCard } from '../ui';

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
      case 'high': return 'text-loopfund-coral-600 bg-loopfund-coral-50 border-loopfund-coral-200 dark:bg-loopfund-coral-900/20 dark:border-loopfund-coral-800';
      case 'medium': return 'text-loopfund-gold-600 bg-loopfund-gold-50 border-loopfund-gold-200 dark:bg-loopfund-gold-900/20 dark:border-loopfund-gold-800';
      case 'low': return 'text-loopfund-emerald-600 bg-loopfund-emerald-50 border-loopfund-emerald-200 dark:bg-loopfund-emerald-900/20 dark:border-loopfund-emerald-800';
      default: return 'text-loopfund-neutral-600 bg-loopfund-neutral-50 border-loopfund-neutral-200 dark:bg-loopfund-neutral-900/20 dark:border-loopfund-neutral-800';
    }
  };

  const getRiskGradient = (severity) => {
    switch (severity) {
      case 'high': return 'bg-gradient-coral';
      case 'medium': return 'bg-gradient-gold';
      case 'low': return 'bg-gradient-emerald';
      default: return 'bg-gradient-to-r from-loopfund-neutral-500 to-loopfund-neutral-600';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'improving' ? 'text-loopfund-emerald-600' : 'text-loopfund-coral-600';
  };

  const TrendIcon = getTrendIcon(financialHealth.trend);
  const trendColor = getTrendColor(financialHealth.trend);

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="relative">
              {/* Background Elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
              
              <div className="relative">
                <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                  Predictive Financial Health
                </h1>
                <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  AI-powered forecasting to prevent financial crises and maximize opportunities
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LoopFundButton
                variant="primary"
                size="lg"
                icon={<RefreshCw className="w-5 h-5" />}
              >
                Refresh Analysis
              </LoopFundButton>
              <LoopFundButton
                variant="secondary"
                size="lg"
                icon={<Settings className="w-5 h-5" />}
              >
                Settings
              </LoopFundButton>
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
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Current Health Score</h3>
                  <motion.div 
                    className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                <div className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">{financialHealth.current}/100</div>
                <div className="flex items-center space-x-2 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  <span className={trendColor}>Improving</span>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-emerald opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">6-Month Forecast</h3>
                  <motion.div 
                    className="w-10 h-10 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                <div className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">{financialHealth.predicted}/100</div>
                <div className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  +{financialHealth.predicted - financialHealth.current} points expected
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Risk Level</h3>
                  <motion.div 
                    className="w-10 h-10 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                <div className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 capitalize">{riskLevel}</div>
                <div className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  {riskLevel === 'low' ? 'Low risk of financial stress' : 
                   riskLevel === 'medium' ? 'Moderate risk - stay vigilant' : 
                   'High risk - take action now'}
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        </motion.div>

        {/* Crisis Prevention Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <LoopFundCard variant="elevated" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </motion.div>
                  <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Crisis Prevention Alerts</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-loopfund-coral-500" />
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">{crisisAlerts.length} active alerts</span>
                </div>
              </div>

              <div className="space-y-4">
                {crisisAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-6 rounded-xl border ${getRiskColor(alert.severity)}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{alert.title}</h3>
                          <span className={`px-3 py-1 rounded-full font-body text-body-sm font-medium ${
                            alert.severity === 'high' ? 'bg-loopfund-coral-100 text-loopfund-coral-700 dark:bg-loopfund-coral-900/20 dark:text-loopfund-coral-300' :
                            alert.severity === 'medium' ? 'bg-loopfund-gold-100 text-loopfund-gold-700 dark:bg-loopfund-gold-900/20 dark:text-loopfund-gold-300' :
                            'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/20 dark:text-loopfund-emerald-300'
                          }`}>
                            {alert.severity} risk
                          </span>
                        </div>
                        <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-4">{alert.description}</p>
                        <div className="flex items-center space-x-6 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-4">
                          <span>Probability: {alert.probability}%</span>
                          <span>Impact: {alert.impact}</span>
                          <span>Timeline: {alert.timestamp.toLocaleDateString()}</span>
                        </div>
                        <p className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
                          Recommendation: {alert.recommendation}
                        </p>
                        <div className="flex space-x-3">
                          {alert.actions.map((action, index) => (
                            <LoopFundButton
                              key={index}
                              variant="primary"
                              size="sm"
                            >
                              {action}
                            </LoopFundButton>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Opportunity Cost Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <LoopFundCard variant="elevated" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Lightbulb className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Opportunity Cost Analysis</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {opportunityCosts.map((cost) => (
                  <motion.div
                    key={cost.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 rounded-xl hover:shadow-loopfund transition-all duration-200"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{cost.scenario}</h3>
                      <motion.div 
                        className="w-8 h-8 bg-gradient-emerald rounded-xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <DollarSign className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between font-body text-body-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Current Annual Cost:</span>
                        <span className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">${cost.annualCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-body text-body-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">If Invested:</span>
                        <span className="font-medium text-loopfund-emerald-600">${cost.potentialReturn.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-body text-body-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Lost Growth:</span>
                        <span className="font-medium text-loopfund-coral-600">${cost.lostGrowth.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20 p-4 rounded-xl border border-loopfund-electric-200 dark:border-loopfund-electric-800">
                      <p className="font-body text-body-sm text-loopfund-electric-800 dark:text-loopfund-electric-200 font-medium">
                        💡 {cost.recommendation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Life Event Planning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <LoopFundCard variant="elevated" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-lavender opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-lavender rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Life Event Planning</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {lifeEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 rounded-xl hover:shadow-loopfund transition-all duration-200"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{event.event}</h3>
                      <span className="font-body text-body-sm bg-loopfund-electric-100 text-loopfund-electric-700 dark:bg-loopfund-electric-900/20 dark:text-loopfund-electric-300 px-3 py-1 rounded-full">
                        {event.probability}% likely
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between font-body text-body-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Timeline:</span>
                        <span className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{event.timeline}</span>
                      </div>
                      <div className="flex justify-between font-body text-body-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Estimated Cost:</span>
                        <span className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">${event.estimatedCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-body text-body-sm">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Monthly Savings Needed:</span>
                        <span className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">${event.monthlySavings.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between font-body text-body-sm mb-2">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Preparation Progress</span>
                        <span className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{event.currentProgress}%</span>
                      </div>
                      <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3">
                        <motion.div 
                          className="bg-gradient-loopfund h-3 rounded-full transition-all duration-300"
                          style={{ width: `${event.currentProgress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${event.currentProgress}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 p-4 rounded-xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                      <p className="font-body text-body-sm text-loopfund-emerald-800 dark:text-loopfund-emerald-200 font-medium">
                        🎯 {event.preparation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Advanced Analytics Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <LoopFundButton
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="secondary"
            size="lg"
            icon={<BarChart3 className="w-5 h-5" />}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Analytics
          </LoopFundButton>
        </motion.div>

        {/* Advanced Analytics */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8"
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-electric opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Brain className="w-5 h-5 text-white" />
                    </motion.div>
                    <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Advanced Analytics</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Spending Pattern Analysis</h3>
                      <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Emotional Spending</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">32% of total</span>
                        </div>
                        <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3">
                          <motion.div 
                            className="bg-gradient-coral h-3 rounded-full"
                            style={{ width: '32%' }}
                            initial={{ width: 0 }}
                            animate={{ width: '32%' }}
                            transition={{ delay: 0.6, duration: 1 }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Necessary Expenses</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">45% of total</span>
                        </div>
                        <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3">
                          <motion.div 
                            className="bg-gradient-emerald h-3 rounded-full"
                            style={{ width: '45%' }}
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            transition={{ delay: 0.7, duration: 1 }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Investment/Savings</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">23% of total</span>
                        </div>
                        <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3">
                          <motion.div 
                            className="bg-gradient-loopfund h-3 rounded-full"
                            style={{ width: '23%' }}
                            initial={{ width: 0 }}
                            animate={{ width: '23%' }}
                            transition={{ delay: 0.8, duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Risk Assessment</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 rounded-xl border border-loopfund-coral-200 dark:border-loopfund-coral-800">
                          <span className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Emergency Fund Risk</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-coral-600">High</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20 rounded-xl border border-loopfund-gold-200 dark:border-loopfund-gold-800">
                          <span className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Debt-to-Income Ratio</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-gold-600">Medium</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                          <span className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Savings Rate</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-emerald-600">Low</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20 rounded-xl border border-loopfund-electric-200 dark:border-loopfund-electric-800">
                          <span className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Investment Diversification</span>
                          <span className="font-body text-body-sm font-medium text-loopfund-electric-600">Medium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PredictiveFinancialHealth;