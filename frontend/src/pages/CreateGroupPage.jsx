import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Target, FileText, CreditCard, CheckCircle, Calendar, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';
import FeeCalculator from '../components/payment/FeeCalculator';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

const CreateGroupPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    description: '',
    maxMembers: 10,
    durationType: 'weekly',
    durationValue: 1,
    accountInfo: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      swiftCode: '',
      paymentMethod: 'bank_transfer',
      additionalInfo: ''
    }
  });
  const [feeData, setFeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getDurationOptions = (type) => {
    switch (type) {
      case 'weekly':
        return [
          { value: 1, label: '1 week' },
          { value: 2, label: '2 weeks' },
          { value: 3, label: '3 weeks' },
          { value: 4, label: '4 weeks' }
        ];
      case 'monthly':
        return [
          { value: 1, label: '1 month' },
          { value: 2, label: '2 months' },
          { value: 3, label: '3 months' },
          { value: 6, label: '6 months' },
          { value: 9, label: '9 months' },
          { value: 12, label: '12 months' }
        ];
      case 'yearly':
        return [
          { value: 1, label: '1 year' },
          { value: 2, label: '2 years' },
          { value: 3, label: '3 years' },
          { value: 5, label: '5 years' }
        ];
      default:
        return [];
    }
  };

  const calculateTotalDurationInMonths = () => {
    const { durationType, durationValue } = formData;
    switch (durationType) {
      case 'weekly':
        return Math.ceil(durationValue / 4); // Convert weeks to months
      case 'monthly':
        return durationValue;
      case 'yearly':
        return durationValue * 12;
      default:
        return 1;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) {
      return; // Prevent double submission
    }
    
    if (!formData.name || !formData.targetAmount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!feeData) {
      setError('Please wait for fee calculation to complete');
      return;
    }

    setError('');
    setIsLoading(true);
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
      setFormData({ 
        name: '', 
        targetAmount: '', 
        description: '', 
        maxMembers: 10, 
        durationType: 'weekly', 
        durationValue: 1,
        accountInfo: {
          bankName: '',
          accountName: '',
          accountNumber: '',
          routingNumber: '',
          swiftCode: '',
          paymentMethod: 'bank_transfer',
          additionalInfo: ''
        }
      });
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
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Back Navigation */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/groups')}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Groups</span>
            </button>
          </div>
          
          {/* Title and Description */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Create New Savings Group
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Start a new savings challenge with friends and family. 
              <span className="text-blue-600 dark:text-blue-400 font-medium"> Dynamic fees based on amount and duration</span> - fair and transparent pricing.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Duration Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Savings Duration
                </h3>
              </div>
              
              {/* Duration Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Choose Duration Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'weekly', label: 'Weekly', icon: '📅' },
                    { value: 'monthly', label: 'Monthly', icon: '📆' },
                    { value: 'yearly', label: 'Yearly', icon: '🗓️' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, durationType: type.value, durationValue: 1 }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.durationType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Value Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select {formData.durationType === 'weekly' ? 'Weeks' : formData.durationType === 'monthly' ? 'Months' : 'Years'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getDurationOptions(formData.durationType).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, durationValue: option.value }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.durationValue === option.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                          : 'border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-600 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-2xl font-bold">{option.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {option.label.split(' ')[1]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Summary */}
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Duration:</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formData.durationValue} {formData.durationType === 'weekly' ? 'week' : formData.durationType === 'monthly' ? 'month' : 'year'}{formData.durationValue > 1 ? 's' : ''}
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                      ({calculateTotalDurationInMonths()} month{calculateTotalDurationInMonths() > 1 ? 's' : ''})
                    </span>
                  </span>
                </div>
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

                {/* Account Information */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Payment Account Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Bank Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={formData.accountInfo.bankName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          accountInfo: { ...prev.accountInfo, bankName: e.target.value }
                        }))}
                        placeholder="e.g., First Bank, GTBank"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Account Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={formData.accountInfo.accountName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          accountInfo: { ...prev.accountInfo, accountName: e.target.value }
                        }))}
                        placeholder="Account holder name"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={formData.accountInfo.accountNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          accountInfo: { ...prev.accountInfo, accountNumber: e.target.value }
                        }))}
                        placeholder="10-digit account number"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Routing Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Routing Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.accountInfo.routingNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          accountInfo: { ...prev.accountInfo, routingNumber: e.target.value }
                        }))}
                        placeholder="Bank routing number"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Preferred Payment Method
                      </label>
                      <select
                        value={formData.accountInfo.paymentMethod}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          accountInfo: { ...prev.accountInfo, paymentMethod: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Additional Info */}
                    <div className="md:col-span-2 lg:col-span-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Additional Payment Information (Optional)
                      </label>
                      <textarea
                        value={formData.accountInfo.additionalInfo}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          accountInfo: { ...prev.accountInfo, additionalInfo: e.target.value }
                        }))}
                        placeholder="Any additional payment instructions or information..."
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div>
                        <p className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-1">
                          Payment Information
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          This information will be shared with group members so they know where to send their contributions. 
                          Make sure the details are accurate and up-to-date.
                        </p>
                      </div>
                    </div>
                  </div>
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
                <div className="flex justify-center">
                  <button 
                    type="submit"
                    disabled={isLoading || !feeData}
                    className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
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
                </div>
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
              durationMonths={calculateTotalDurationInMonths()}
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
        groupData={{
          ...formData,
          durationMonths: calculateTotalDurationInMonths()
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CreateGroupPage; 