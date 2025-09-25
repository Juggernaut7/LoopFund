import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, AlertCircle, CheckCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { LoopFundButton, LoopFundInput, LoopFundCard } from '../ui';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../hooks/useWallet';

const WithdrawModal = ({ isOpen, onClose, onSuccess, wallet }) => {
  const { toast } = useToast();
  const { withdrawFromWallet } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    bankAccount: '',
    bankName: '',
    accountName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWithdraw = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(formData.amount) > wallet.balance) {
      setError(`Insufficient balance. Available: ₦${wallet.balance.toLocaleString()}`);
      return;
    }

    if (!formData.bankAccount || !formData.bankName || !formData.accountName) {
      setError('Please fill in all bank account details');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const bankAccountData = {
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNumber: formData.bankAccount
      };
      
      console.log('🏦 Withdrawal data:', {
        amount: parseFloat(formData.amount),
        description: formData.description,
        bankAccount: bankAccountData
      });
      
      const success = await withdrawFromWallet(
        parseFloat(formData.amount),
        formData.description,
        bankAccountData
      );
      
      if (success) {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Withdrawal request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      description: '',
      bankAccount: '',
      bankName: '',
      accountName: ''
    });
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
                <div className="w-12 h-12 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Withdraw Money
                  </h2>
                  <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Transfer funds to your bank account
                  </p>
                </div>
              </div>

              {/* Wallet Balance */}
              <LoopFundCard className="p-4 mb-6 bg-gradient-to-r from-loopfund-emerald-50 to-loopfund-mint-50 dark:from-loopfund-emerald-900/20 dark:to-loopfund-mint-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                      Available Balance
                    </p>
                    <p className="font-display text-h4 text-loopfund-emerald-600">
                      {formatCurrency(wallet?.balance || 0)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-loopfund-emerald-600" />
                  </div>
                </div>
              </LoopFundCard>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Amount (NGN) *
                  </label>
                  <LoopFundInput
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
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
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., Emergency withdrawal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Bank Name *
                    </label>
                    <LoopFundInput
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., Access Bank"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Account Name *
                    </label>
                    <LoopFundInput
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bankAccount" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                    Account Number *
                  </label>
                  <LoopFundInput
                    type="text"
                    id="bankAccount"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit account number"
                    maxLength="10"
                    required
                  />
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

              <div className="bg-loopfund-neutral-100 dark:bg-loopfund-dark-card p-4 rounded-lg mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-loopfund-neutral-500 mt-0.5" />
                  <div>
                    <p className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                      <strong>Note:</strong> Withdrawal requests are processed within 24-48 hours. 
                      You'll receive a notification once your withdrawal is approved and processed.
                    </p>
                  </div>
                </div>
              </div>

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
                  onClick={handleWithdraw}
                  disabled={isLoading || !formData.amount || !formData.bankAccount}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      Request Withdrawal
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

export default WithdrawModal;
