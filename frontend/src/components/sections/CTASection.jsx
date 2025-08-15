import React from 'react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-synergy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-responsive-lg font-bold text-white mb-4">
            Ready to start your savings journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who are already achieving their financial goals together.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-primary-50 transition-colors duration-300"
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
