import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Planning",
      description: "Set personalized savings goals with flexible timelines and contribution schedules.",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Collaboration",
      description: "Invite friends and family to contribute towards shared financial goals.",
      color: "from-secondary-500 to-secondary-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Tracking",
      description: "Real-time progress tracking with beautiful visualizations and insights.",
      color: "from-success-500 to-success-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Transparent",
      description: "Bank-level security with full transparency - we never hold your funds.",
      color: "from-warning-500 to-warning-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Payments",
      description: "Seamless integration with your bank for hassle-free contributions.",
      color: "from-error-500 to-error-600"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Achievement Rewards",
      description: "Earn rewards and celebrate milestones as you reach your goals.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-responsive-lg font-bold text-neutral-900 dark:text-white mb-4">
            Everything you need to save successfully
          </h2>
          <p className="text-responsive-md text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Powerful features designed to make group savings effortless, transparent, and enjoyable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="feature-card group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
