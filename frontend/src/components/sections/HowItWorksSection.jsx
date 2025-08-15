import React from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Set Your Goal",
      description: "Define your savings target and timeline. Choose between solo or group goals.",
      icon: "🎯"
    },
    {
      step: "02",
      title: "Invite & Plan",
      description: "Invite friends via email or shareable link. Set contribution schedules.",
      icon: "👥"
    },
    {
      step: "03",
      title: "Save & Track",
      description: "Make contributions and watch your progress in real-time.",
      icon: "📈"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-responsive-lg font-bold text-neutral-900 dark:text-white mb-4">
            How LoopFund Works
          </h2>
          <p className="text-responsive-md text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Get started in minutes with our simple 3-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-synergy rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                {item.step}
              </div>
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
