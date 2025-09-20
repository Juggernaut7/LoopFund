import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Target, Users, AlertCircle } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

const ContributionModal = ({ isOpen, onClose, goal, group, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { wallet, contributeToGoal, contributeToGroup } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    if (wallet && parseFloat(amount) > wallet.balance) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (goal) {
        await contributeToGoal(goal._id, parseFloat(amount), description);
      } else if (group) {
        await contributeToGroup(group._id, parseFloat(amount), description);
      }
      
      onSuccess?.();
      onClose();
      
      // Reset form
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Contribution error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount) || amount === null || amount === undefined) {
      return '₦0.00';
    }
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const target = goal || group;
  const isInsufficientFunds = wallet && parseFloat(amount) > wallet.balance;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-loopfund-neutral-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-2xl shadow-loopfund-xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-lg flex items-center justify-center">
                {goal ? <Target className="w-5 h-5 text-loopfund-emerald-600" /> : <Users className="w-5 h-5 text-loopfund-emerald-600" />}
              </div>
              <div>
                <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Contribute to {goal ? 'Goal' : 'Group'}
                </h2>
                <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  {target.name}
                </p>
              </div>
            </div>

            {/* Wallet Balance */}
            {wallet ? (
              <div className="mb-6 p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-lg border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="w-4 h-4 text-loopfund-emerald-600" />
                  <span className="font-body text-body-sm font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                    Available Balance
                  </span>
                </div>
                <div className="font-display text-h4 text-loopfund-emerald-600">
                  {formatCurrency(wallet.balance || 0)}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg border border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="w-4 h-4 text-loopfund-neutral-500" />
                  <span className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Loading wallet...
                  </span>
                </div>
                <div className="font-display text-h4 text-loopfund-neutral-500">
                  ₦0.00
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                  Contribution Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-loopfund-neutral-500 font-body text-body">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 pl-8 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                  />
                </div>
                {isInsufficientFunds && (
                  <div className="flex items-center space-x-2 mt-2 text-loopfund-coral-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-body text-body-sm">Insufficient wallet balance</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a note about this contribution..."
                  rows={3}
                  className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200 resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isInsufficientFunds || !amount || !wallet}
                  className="flex-1 px-4 py-3 bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 disabled:bg-loopfund-neutral-400 rounded-lg font-body text-body font-medium text-white transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Contributing...</span>
                    </>
                  ) : (
                    <>
                      <span>Contribute</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContributionModal;
