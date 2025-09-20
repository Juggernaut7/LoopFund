import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Target, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Crown,
  Zap,
  DollarSign,
  Clock,
  Shield,
  Loader2
} from 'lucide-react';
import PaymentModal from '../components/payment/PaymentModal';
import FeeCalculator from '../components/payment/FeeCalculator';
import { useAuthStore } from '../store/useAuthStore';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';
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
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-loopfund opacity-5 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-coral opacity-5 rounded-full blur-2xl animate-float-delayed" />
          </div>

          {/* Back Navigation */}
          <div className="mb-6 relative">
            <motion.button
              onClick={() => navigate('/groups')}
              className="flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 transition-colors duration-200"
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-body text-body font-medium">Back to Groups</span>
            </motion.button>
          </div>
          
          {/* Title and Description */}
          <div className="text-center relative">
            <motion.h1 
              className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create New Savings Group
            </motion.h1>
            <motion.p 
              className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start a new savings challenge with friends and family. 
              <span className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium"> Dynamic fees based on amount and duration</span> - fair and transparent pricing.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Duration Selection */}
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
                <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
              </div>

              <div className="relative p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Calendar className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Savings Duration
                  </h3>
                </div>
                
                {/* Duration Type Selection */}
                <div className="mb-8">
                  <label className="block font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-4">
                    Choose Duration Type
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'weekly', label: 'Weekly', icon: '📅' },
                      { value: 'monthly', label: 'Monthly', icon: '📆' },
                      { value: 'yearly', label: 'Yearly', icon: '🗓️' }
                    ].map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, durationType: type.value, durationValue: 1 }))}
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                          formData.durationType === type.value
                            ? 'border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 text-loopfund-emerald-700 dark:text-loopfund-emerald-300 shadow-loopfund'
                            : 'border-loopfund-neutral-300 dark:border-loopfund-neutral-600 hover:border-loopfund-emerald-300 dark:hover:border-loopfund-emerald-600 text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated'
                        }`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-3xl mb-3">{type.icon}</div>
                        <div className="font-body text-body font-medium">{type.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Duration Value Selection */}
                <div>
                  <label className="block font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-4">
                    Select {formData.durationType === 'weekly' ? 'Weeks' : formData.durationType === 'monthly' ? 'Months' : 'Years'}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getDurationOptions(formData.durationType).map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, durationValue: option.value }))}
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                          formData.durationValue === option.value
                            ? 'border-loopfund-coral-500 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 text-loopfund-coral-700 dark:text-loopfund-coral-300 shadow-loopfund'
                            : 'border-loopfund-neutral-300 dark:border-loopfund-neutral-600 hover:border-loopfund-coral-300 dark:hover:border-loopfund-coral-600 text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated'
                        }`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-3xl font-display text-h2">{option.value}</div>
                        <div className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {option.label.split(' ')[1]}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Duration Summary */}
                <div className="mt-8 p-6 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-body font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Duration:</span>
                    <span className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {formData.durationValue} {formData.durationType === 'weekly' ? 'week' : formData.durationType === 'monthly' ? 'month' : 'year'}{formData.durationValue > 1 ? 's' : ''}
                      <span className="font-body text-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400 ml-2">
                        ({calculateTotalDurationInMonths()} month{calculateTotalDurationInMonths() > 1 ? 's' : ''})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-coral opacity-5 rounded-full blur-2xl animate-float" />
                <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float-delayed" />
              </div>

              <div className="relative p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Group Name */}
                  <div>
                    <LoopFundInput
                      type="text"
                      label="Group Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Vacation Fund 2024"
                      icon={<Users className="w-5 h-5" />}
                      required
                    />
                  </div>
                  
                  {/* Target Amount */}
                  <div>
                    <LoopFundInput
                      type="number"
                      label="Target Amount (₦)"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      placeholder="e.g., 50000"
                      min="1000"
                      step="1000"
                      icon={<Target className="w-5 h-5" />}
                      required
                    />
                    <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-2">
                      Minimum: ₦1,000
                    </p>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                      <FileText className="inline w-5 h-5 mr-2" />
                      Description
                    </label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What are you saving for? (optional)"
                      rows={4}
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-all font-body text-body"
                    />
                  </div>

                  {/* Max Members */}
                  <div>
                    <label className="block font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                      <Users className="inline w-5 h-5 mr-2" />
                      Maximum Members
                    </label>
                    <select
                      name="maxMembers"
                      value={formData.maxMembers}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-all font-body text-body"
                    >
                      <option value={5}>5 members</option>
                      <option value={10}>10 members</option>
                      <option value={15}>15 members</option>
                      <option value={20}>20 members</option>
                      <option value={50}>50 members</option>
                    </select>
                  </div>

                  {/* Account Information */}
                  <LoopFundCard variant="gradient" className="relative">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-gold opacity-5 rounded-full blur-2xl animate-float" />
                    </div>

                    <div className="relative p-8">
                      <div className="flex items-center space-x-4 mb-8">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CreditCard className="w-6 h-6 text-white" />
                        </motion.div>
                        <h3 className="font-display text-h2 text-white">
                          Payment Account Information
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Bank Name */}
                        <div>
                          <label className="block font-body text-body font-medium text-white/90 mb-3">
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
                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-loopfund-gold-500 focus:border-transparent transition-colors font-body text-body"
                          />
                        </div>

                        {/* Account Name */}
                        <div>
                          <label className="block font-body text-body font-medium text-white/90 mb-3">
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
                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-loopfund-gold-500 focus:border-transparent transition-colors font-body text-body"
                          />
                        </div>

                        {/* Account Number */}
                        <div>
                          <label className="block font-body text-body font-medium text-white/90 mb-3">
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
                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-loopfund-gold-500 focus:border-transparent transition-colors font-body text-body"
                          />
                        </div>

                        {/* Routing Number */}
                        <div>
                          <label className="block font-body text-body font-medium text-white/90 mb-3">
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
                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-loopfund-gold-500 focus:border-transparent transition-colors font-body text-body"
                          />
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="block font-body text-body font-medium text-white/90 mb-3">
                            Preferred Payment Method
                          </label>
                          <select
                            value={formData.accountInfo.paymentMethod}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              accountInfo: { ...prev.accountInfo, paymentMethod: e.target.value }
                            }))}
                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-loopfund-gold-500 focus:border-transparent transition-colors font-body text-body"
                          >
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="mobile_money">Mobile Money</option>
                            <option value="crypto">Cryptocurrency</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Additional Info */}
                        <div className="md:col-span-2 lg:col-span-4">
                          <label className="block font-body text-body font-medium text-white/90 mb-3">
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
                            className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-loopfund-gold-500 focus:border-transparent transition-colors resize-none font-body text-body"
                          />
                        </div>
                      </div>

                      <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="flex items-start space-x-4">
                          <motion.div 
                            className="w-8 h-8 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <span className="text-white text-sm font-bold">i</span>
                          </motion.div>
                          <div>
                            <p className="text-white font-body text-body font-medium mb-2">
                              Payment Information
                            </p>
                            <p className="text-white/80 font-body text-body-sm">
                              This information will be shared with group members so they know where to send their contributions. 
                              Make sure the details are accurate and up-to-date.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LoopFundCard>

                  {/* Error Display */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        className="bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-2xl p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="text-loopfund-coral-600 dark:text-loopfund-coral-400 w-6 h-6" />
                          <p className="text-loopfund-coral-600 dark:text-loopfund-coral-400 font-body text-body">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success Display */}
                  <AnimatePresence>
                    {success && (
                      <motion.div 
                        className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800 rounded-2xl p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 w-6 h-6" />
                          <div>
                            <p className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-body text-body font-medium">{success}</p>
                            <p className="text-loopfund-emerald-500 dark:text-loopfund-emerald-300 font-body text-body-sm mt-1">
                              Redirecting to groups page...
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <LoopFundButton 
                      type="submit"
                      disabled={isLoading || !feeData}
                      variant="primary"
                      size="lg"
                      icon={isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                      className="w-full max-w-md"
                    >
                      {isLoading ? 'Processing...' : (
                        feeData 
                          ? `Pay ₦${feeData.totalFee.toLocaleString()} & Create Group`
                          : 'Calculating Fee...'
                      )}
                    </LoopFundButton>
                  </div>
                </form>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Dynamic Fee Calculator */}
            <FeeCalculator
              targetAmount={formData.targetAmount}
              durationMonths={calculateTotalDurationInMonths()}
              onFeeCalculated={handleFeeCalculated}
            />

            {/* Features */}
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-electric opacity-5 rounded-full blur-2xl animate-float" />
              </div>

              <div className="relative p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Smart Savings Features
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: 'Dynamic fee calculation', color: 'emerald' },
                    { icon: Zap, text: 'AI-powered insights', color: 'electric' },
                    { icon: Target, text: 'Progress tracking', color: 'coral' },
                    { icon: Users, text: 'Group collaboration', color: 'gold' }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className={`w-10 h-10 bg-loopfund-${feature.color}-100 dark:bg-loopfund-${feature.color}-900/20 rounded-xl flex items-center justify-center`}>
                        <feature.icon className={`text-loopfund-${feature.color}-600 dark:text-loopfund-${feature.color}-400 w-5 h-5`} />
                      </div>
                      <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </LoopFundCard>

            {/* Security Info */}
            <LoopFundCard variant="gradient" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-emerald opacity-5 rounded-full blur-2xl animate-float" />
              </div>

              <div className="relative p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h2 text-white">
                    🔒 Secure & Trusted
                  </h3>
                </div>
                <p className="font-body text-body text-white/90">
                  Your payment is processed securely through Paystack, a trusted payment gateway used by thousands of businesses across Africa.
                </p>
              </div>
            </LoopFundCard>
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