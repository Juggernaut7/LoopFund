import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CreditCard, Banknote, Wallet, Zap, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

const GroupContributionForm = ({ group, onSubmit, onClose }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    amount: '',
    method: 'wallet',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  // Only wallet payments allowed
  const paymentMethods = [
    { 
      id: 'wallet', 
      label: 'Wallet Balance', 
      icon: Wallet,
      description: 'Use your wallet balance',
      requiresBalance: true
    }
  ];

  // Load wallet balance on component mount
  useEffect(() => {
    const loadWalletBalance = async () => {
      try {
        console.log('🔍 Loading wallet balance...');
        const response = await api.get('/wallet');
        console.log('💰 Wallet response:', response.data);
        if (response.data.success) {
          setWalletBalance(response.data.data.balance || 0);
          console.log('💰 Wallet balance set to:', response.data.data.balance);
        }
      } catch (error) {
        console.error('❌ Error loading wallet balance:', error);
        // Set default balance if API fails
        setWalletBalance(0);
      } finally {
        setIsLoadingWallet(false);
      }
    };

    loadWalletBalance();
  }, []);

  // Check for insufficient balance when amount or method changes
  useEffect(() => {
    if (formData.method === 'wallet' && formData.amount && parseFloat(formData.amount) > walletBalance) {
      setShowInsufficientBalance(true);
    } else {
      setShowInsufficientBalance(false);
    }
  }, [formData.amount, formData.method, walletBalance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Only wallet payments allowed
      const contributionData = {
        groupId: group._id,
        amount: parseFloat(formData.amount),
        method: 'wallet',
        description: formData.description || `Contribution to ${group.name}`,
        type: 'group'
      };

      console.log('🚀 GroupContributionForm submitting wallet payment:', contributionData);

      await onSubmit(contributionData);
    } catch (error) {
      console.error('Error submitting contribution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFundWallet = async () => {
    try {
      const response = await api.post('/payments/initialize-wallet-funding', {
        amount: parseFloat(formData.amount) - walletBalance,
        description: `Fund wallet for ${group.name} contribution`
      });

      if (response.data.success) {
        window.open(response.data.data.authorizationUrl, '_blank');
      }
    } catch (error) {
      console.error('Error funding wallet:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-loopfund-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-2xl p-6 w-full max-w-md shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Contribute to Group
            </h2>
            <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-1">
              {group?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-loopfund-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Info */}
          {group && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-loopfund rounded-xl flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {group.name}
                  </h3>
                  <p className="text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Group Contribution
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-loopfund-neutral-400" />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
              Payment Method
            </label>
            <div className="p-4 border border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 text-loopfund-emerald-700 dark:text-loopfund-emerald-300 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Wallet Balance</div>
                  <div className="text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    Use your wallet balance
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {isLoadingWallet ? 'Loading...' : `₦${walletBalance.toLocaleString()}`}
                </div>
                <div className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                  Available
                </div>
              </div>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {showInsufficientBalance && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-amber-800 dark:text-amber-200">
                    Insufficient Wallet Balance
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    You need ₦{(parseFloat(formData.amount) - walletBalance).toLocaleString()} more to make this contribution.
                  </div>
                  <button
                    type="button"
                    onClick={handleFundWallet}
                    className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Fund Wallet with Paystack
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's this contribution for?"
              rows={3}
              className="w-full p-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.amount || (formData.method === 'wallet' && showInsufficientBalance)}
              className="flex-1 px-4 py-3 bg-gradient-loopfund text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 
               formData.method === 'wallet' && showInsufficientBalance ? 'Fund Wallet First' :
               'Contribute to Group'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupContributionForm;
