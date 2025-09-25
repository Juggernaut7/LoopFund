import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Users, Wallet, CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { LoopFundButton, LoopFundInput, LoopFundCard } from '../ui';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../hooks/useWallet';

const ContributionModal = ({ isOpen, onClose, goal, group, onSuccess }) => {
  const { toast } = useToast();
  const { wallet, contributeToGoal, contributeToGroup } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'wallet' && wallet && parseFloat(amount) > wallet.balance) {
      setError(`Insufficient wallet balance. Available: ₦${wallet.balance.toLocaleString()}`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let success = false;
      
      if (goal) {
        success = await contributeToGoal(goal._id, parseFloat(amount), description);
      } else if (group) {
        success = await contributeToGroup(group._id, parseFloat(amount), description);
      }

      if (success) {
        toast.success('Contribution Successful', `₦${parseFloat(amount).toLocaleString()} contributed successfully!`);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Contribution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setError('');
    onClose();
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₦0.00';
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
            className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-3xl shadow-loopfund-xl w-full max-w-md relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  goal ? 'bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500' : 'bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500'
                }`}>
                  {goal ? <Target className="w-6 h-6 text-white" /> : <Users className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Contribute to {goal ? 'Goal' : 'Group'}
                  </h2>
                  <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {target?.name}
                  </p>
                </div>
              </div>

              {/* Target Info */}
              <LoopFundCard className="p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                    Target Amount
                  </span>
                  <span className="font-display text-h5 text-loopfund-emerald-600">
                    {formatCurrency(target?.targetAmount || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                    Current Amount
                  </span>
                  <span className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {formatCurrency(target?.currentAmount || 0)}
                  </span>
                </div>
                <div className="w-full h-2 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500"
                    style={{ 
                      width: `${Math.min(100, ((target?.currentAmount || 0) / (target?.targetAmount || 1)) * 100)}%` 
                    }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {Math.round(((target?.currentAmount || 0) / (target?.targetAmount || 1)) * 100)}% Complete
                  </span>
                </div>
              </LoopFundCard>

              {/* Wallet Balance */}
              {wallet && (
                <div className="mb-6 p-4 bg-gradient-to-r from-loopfund-emerald-50 to-loopfund-mint-50 dark:from-loopfund-emerald-900/20 dark:to-loopfund-mint-900/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-loopfund-emerald-600" />
                      <span className="font-body text-body-sm font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                        Available Balance
                      </span>
                    </div>
                    <div className="font-display text-h4 text-loopfund-emerald-600">
                      {formatCurrency(wallet.balance || 0)}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Amount (NGN) *
                  </label>
                  <LoopFundInput
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="100"
                    max={wallet?.balance || 0}
                    step="100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Description (Optional)
                  </label>
                  <LoopFundInput
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Monthly contribution"
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-2 ${
                        paymentMethod === 'wallet'
                          ? 'border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20'
                          : 'border-loopfund-neutral-200 dark:border-loopfund-neutral-600 hover:border-loopfund-emerald-300'
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-loopfund-emerald-600" />
                      <span className="font-body text-body-sm font-medium">Wallet</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-2 ${
                        paymentMethod === 'card'
                          ? 'border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20'
                          : 'border-loopfund-neutral-200 dark:border-loopfund-neutral-600 hover:border-loopfund-emerald-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-loopfund-neutral-500" />
                      <span className="font-body text-body-sm font-medium">Card</span>
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-loopfund-coral-600" />
                    <span className="font-body text-body-sm text-loopfund-coral-700 dark:text-loopfund-coral-300">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {isInsufficientFunds && (
                <div className="mb-4 p-3 bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20 border border-loopfund-gold-200 dark:border-loopfund-gold-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-loopfund-gold-600" />
                    <span className="font-body text-body-sm text-loopfund-gold-700 dark:text-loopfund-gold-300">
                      Insufficient wallet balance. Please add money to your wallet first.
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <LoopFundButton
                  variant="secondary"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </LoopFundButton>
                <LoopFundButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading || !amount || isInsufficientFunds}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Contributing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Contribute
                    </>
                  )}
                </LoopFundButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContributionModal;