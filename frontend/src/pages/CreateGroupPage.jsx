import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, FileText, CreditCard, CheckCircle, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';
import FeeCalculator from '../components/payment/FeeCalculator';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

const CreateGroupPage = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    description: '',
    maxMembers: 10,
    durationMonths: 1
  });
  const [feeData, setFeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!feeData) {
      setError('Please wait for fee calculation to complete');
      return;
    }

    setError('');
    setShowPaymentModal(true);
  };

  const handleFeeCalculated = (fee) => {
    setFeeData(fee);
  };

  const handlePaymentSuccess = async () => {
    try {
      setIsLoading(true);
      
      // The group should already be created by the backend after successful payment
      // We just need to redirect to the groups page or show success message
      setSuccess('Payment successful! Your group is being created...');
      
      // Clear form data
      setFormData({ name: '', targetAmount: '', description: '', maxMembers: 10, durationMonths: 1 });
      setFeeData(null);
      
      // Redirect to groups page after a delay
      setTimeout(() => {
        window.location.href = '/groups';
      }, 3000);
      
    } catch (err) {
      console.error('Payment success handling error:', err);
      setError('Payment was successful but there was an issue. Please check your groups.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Create New Savings Group
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Start a new savings challenge with friends and family. 
            <span className="text-blue-600 dark:text-blue-400 font-medium"> Dynamic fees based on amount and duration</span> - fair and transparent pricing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Duration Selection */}
            <div className="glass-card p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                  Savings Duration
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 1, label: '1 month' },
                  { value: 3, label: '3 months' },
                  { value: 6, label: '6 months' },
                  { value: 12, label: '12 months' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, durationMonths: option.value }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.durationMonths === option.value
                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="text-lg font-bold">{option.value}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{option.label.includes('month') ? 'month' : 'months'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Users className="inline w-4 h-4 mr-2" />
                    Group Name *
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Vacation Fund 2024"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Target className="inline w-4 h-4 mr-2" />
                    Target Amount (₦) *
                  </label>
                  <input 
                    type="number" 
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    min="1000"
                    step="1000"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Minimum: ₦1,000
                  </p>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <FileText className="inline w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What are you saving for? (optional)"
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    <Users className="inline w-4 h-4 mr-2" />
                    Maximum Members
                  </label>
                  <select
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value={5}>5 members</option>
                    <option value={10}>10 members</option>
                    <option value={15}>15 members</option>
                    <option value={20}>20 members</option>
                    <option value={50}>50 members</option>
                  </select>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                      <div>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">{success}</p>
                        <p className="text-green-500 dark:text-green-300 text-xs mt-1">
                          Redirecting to groups page...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isLoading || !feeData}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      <span>
                        {feeData 
                          ? `Pay ₦${feeData.totalFee.toLocaleString()} & Create Group`
                          : 'Calculating Fee...'
                        }
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Dynamic Fee Calculator */}
            <FeeCalculator
              targetAmount={formData.targetAmount}
              durationMonths={formData.durationMonths}
              onFeeCalculated={handleFeeCalculated}
            />

            {/* Features */}
            <div className="glass-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Smart Savings Features
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">Dynamic fee calculation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">AI-powered insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">Progress tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">Group collaboration</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="glass-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                🔒 Secure & Trusted
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your payment is processed securely through Paystack, a trusted payment gateway used by thousands of businesses across Africa.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        groupData={formData}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CreateGroupPage; 