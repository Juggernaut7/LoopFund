import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Shield, 
  TrendingUp, 
  Gamepad2, 
  Users,
  Zap,
  Star,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target
} from 'lucide-react';

const RevolutionaryFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Financial Therapist",
      description: "Revolutionary AI that understands your money psychology and provides personalized therapy sessions",
      benefits: ["Emotional spending analysis", "Stress-triggered interventions", "Personalized therapy sessions"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Users,
      title: "Financial Wellness Community",
      description: "Anonymous peer support and shared financial struggles with AI insights",
      benefits: ["Anonymous support groups", "Success story sharing", "AI-powered insights"],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: TrendingUp,
      title: "Predictive Financial Health",
      description: "6-month forecasts and crisis prevention alerts to secure your financial future",
      benefits: ["Crisis prevention alerts", "Opportunity cost analysis", "Life event planning"],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Gamepad2,
      title: "Financial Therapy Games",
      description: "Gamified exercises to reduce financial anxiety and build money confidence",
      benefits: ["Anxiety reduction games", "Mindset transformation", "Confidence building"],
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    }
  ];

  const stats = [
    { number: "75%", label: "Reduction in emotional spending", icon: Heart },
    { number: "60%", label: "Decrease in financial stress", icon: Shield },
    { number: "40%", label: "Increase in savings rate", icon: TrendingUp },
    { number: "85%", label: "User satisfaction rate", icon: Star }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            Revolutionary Innovation
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            The Only App That Understands Your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Money Psychology
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Traditional financial apps ignore the psychological aspects of money. 
            We're the first to combine AI therapy, community support, and behavioral interventions 
            to transform your relationship with money.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl border-2 ${feature.bgColor} ${feature.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Relationship with Money?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their financial lives 
              with our revolutionary AI-powered financial wellness platform.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
              Start Your Financial Therapy Journey
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RevolutionaryFeaturesSection; 