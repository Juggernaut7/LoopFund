import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Target, 
  Users, 
  Calendar, 
  DollarSign, 
  Edit, 
  Trash2, 
  Loader,
  Banknote,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Crown,
  Lock,
  X,
  Sparkles,
  Trophy,
  Zap,
  Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import { useAuthStore } from '../store/useAuthStore';
import goalPaymentService from '../services/goalPaymentService';
import { useWallet } from '../hooks/useWallet';
import ContributionForm from '../components/contributions/ContributionForm';
import WalletCard from '../components/wallet/WalletCard';
import ContributionModal from '../components/wallet/ContributionModal';
import AddMoneyModal from '../components/wallet/AddMoneyModal';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundCard, { LoopFundCardHeader, LoopFundCardTitle, LoopFundCardDescription, LoopFundCardContent } from '../components/ui/LoopFundCard';
import LoopFundInput from '../components/ui/LoopFundInput';
import { formatCurrencySimple } from '../utils/currency';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  // Payment modal removed - now using wallet deduction
  const [userStats, setUserStats] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWalletCard, setShowWalletCard] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  // Payment processing removed - now using wallet deduction
  const [isProcessingContribution, setIsProcessingContribution] = useState(false);
  const [contributionData, setContributionData] = useState({
    goalId: '',
    amount: '',
    description: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    endDate: '',
    category: 'personal',
    frequency: 'monthly',
    amount: '',
    duration: '', // New field for duration
    calculatedAmount: '' // Auto-calculated amount per period
  });
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { wallet, fetchWallet } = useWallet();

  // Fetch goals and user stats on component mount
  useEffect(() => {
    fetchGoals();
    fetchUserStats();
    
    // Check if user is returning from a payment verification
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the tab, refresh goals data
        fetchGoals();
        fetchUserStats();
      }
    };
    
    const handleFocus = () => {
      // User focused the window, refresh goals data
      fetchGoals();
      fetchUserStats();
    };
    
    // Listen for tab visibility changes and window focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Listen for payment completion events
    const handlePaymentCompleted = (event) => {
      console.log('🔄 Payment completed event received:', event.detail);
      toast.success('Payment completed', 'Your payment has been completed successfully');
      if (event.detail.type === 'goals' || event.detail.type === 'dashboard') {
        console.log('🔄 Refreshing goals data after payment completion...');
        fetchGoals();
        fetchUserStats();
      }
    };
    
    window.addEventListener('paymentCompleted', handlePaymentCompleted);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('paymentCompleted', handlePaymentCompleted);
    };
  }, []);

  // Auto-calculate amount per period when target amount, end date, or frequency changes
  useEffect(() => {
    if (formData.targetAmount && formData.endDate && formData.frequency) {
      const today = new Date().toISOString().split('T')[0];
      const durationInDays = calculateDurationInDays(today, formData.endDate);
      const calculatedAmount = calculateAmountPerPeriod(
        formData.targetAmount, 
        durationInDays, 
        formData.frequency
      );
      
      setFormData(prev => ({
        ...prev,
        duration: durationInDays.toString(),
        calculatedAmount: calculatedAmount.toString(),
        amount: calculatedAmount.toString() // Auto-fill the amount field
      }));
    }
  }, [formData.targetAmount, formData.endDate, formData.frequency]);

  // Handle payment verification when returning from Paystack
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const reference = urlParams.get('reference');
    
    console.log('🔍 URL params:', { paymentStatus, reference });
    
    if (paymentStatus === 'success' && reference) {
      console.log('🔍 Triggering payment verification...');
      verifyGoalPayment(reference);
    }
  }, []);

  // Debug function to manually verify payment (for testing)
  const debugVerifyPayment = async () => {
    const reference = prompt('Enter payment reference to verify:');
    if (reference) {
      console.log('🔍 Manual verification for reference:', reference);
      try {
        const response = await fetch('http://localhost:4000/api/payments/verify-payment-manual', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ reference })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Manual verification successful:', data);
          if (data.success) {
            toast.success('Payment Verified', data.message || 'Payment verified successfully!');
            await fetchGoals(); // Refresh goals
          }
        } else {
          const errorData = await response.json();
          console.error('❌ Manual verification failed:', errorData);
          toast.error('Verification Failed', errorData.error || 'Failed to verify payment');
        }
      } catch (error) {
        console.error('❌ Manual verification error:', error);
        toast.error('Verification Failed', 'Failed to verify payment');
      }
    }
  };

  const verifyGoalPayment = async (reference) => {
    console.log('🔍 Verifying goal payment with reference:', reference);
    try {
      const response = await fetch(`http://localhost:4000/api/payments/verify-goal-contribution/${reference}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('🔍 Verification response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Verification response data:', data);
        
        if (data.success) {
          const contributionAmount = data.data?.contributionAmount || data.data?.amount || 0;
          console.log('✅ Payment verified successfully, contribution amount:', contributionAmount);
          toast.success('Contribution Successful', `Successfully contributed ${formatCurrencySimple(contributionAmount)} to your goal!`);
          // Refresh goals to show updated progress
          await fetchGoals();
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.error('❌ Payment verification failed:', data.error);
          toast.error('Payment Verification Failed', data.error || 'Payment verification failed');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Verification request failed:', response.status, errorData);
        toast.error('Payment Verification Failed', errorData.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('❌ Error verifying goal payment:', error);
      toast.error('Payment Verification Failed', 'Failed to verify payment');
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await dashboardService.getDashboardStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await dashboardService.getUserGoals();
      setGoals(response.data || []);
      
      console.log('Goals fetched:', response);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error.message);
      toast.error('Goals Error', 'Failed to load goals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if user can create goal for free (first 2 goals are free)
  const canCreateGoalForFree = () => {
    if (!userStats) return false;
    const individualGoals = goals.filter(goal => !goal.isGroupGoal);
    return individualGoals.length < 2; // First 2 individual goals are free
  };

  // Calculate fee for additional goals (minimal fee after first 2)
  const calculateGoalFee = (targetAmount) => {
    const individualGoals = goals.filter(goal => !goal.isGroupGoal);
    if (individualGoals.length < 2) return 0; // First 2 goals are free
    
    // Minimal fee for subsequent goals
    const minFee = 100; // Minimum ₦100
    const maxFee = 1000; // Maximum ₦1,000
    const baseFee = Math.min(targetAmount * 0.01, maxFee); // 1% or max fee
    return Math.max(minFee, baseFee);
  };

  // Calculate amount per period based on target amount, duration, and frequency
  const calculateAmountPerPeriod = (targetAmount, duration, frequency) => {
    if (!targetAmount || !duration || !frequency) return 0;
    
    const target = parseFloat(targetAmount);
    const durationNum = parseFloat(duration);
    
    if (target <= 0 || durationNum <= 0) return 0;
    
    // Convert duration to the same unit as frequency
    let periodsInDuration = durationNum;
    
    switch (frequency) {
      case 'daily':
        // Duration is already in days
        periodsInDuration = durationNum;
        break;
      case 'weekly':
        // Convert days to weeks
        periodsInDuration = Math.ceil(durationNum / 7);
        break;
      case 'monthly':
        // Convert days to months (approximate 30 days per month)
        periodsInDuration = Math.ceil(durationNum / 30);
        break;
      case 'yearly':
        // Convert days to years (approximate 365 days per year)
        periodsInDuration = Math.ceil(durationNum / 365);
        break;
      default:
        periodsInDuration = durationNum;
    }
    
    return Math.ceil(target / periodsInDuration);
  };

  // Calculate duration in days from start date to end date
  const calculateDurationInDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  // Calculate next payment date based on frequency
  const calculateNextPaymentDate = (frequency) => {
    const today = new Date();
    const nextPayment = new Date(today);
    
    switch (frequency) {
      case 'daily':
        nextPayment.setDate(today.getDate() + 1);
        break;
      case 'weekly':
        nextPayment.setDate(today.getDate() + 7);
        break;
      case 'monthly':
        nextPayment.setMonth(today.getMonth() + 1);
        break;
      case 'yearly':
        nextPayment.setFullYear(today.getFullYear() + 1);
        break;
      default:
        nextPayment.setDate(today.getDate() + 1);
    }
    
    return nextPayment.toLocaleDateString();
  };

  // Get frequency display name
  const getFrequencyDisplayName = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'day';
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      case 'yearly':
        return 'year';
      default:
        return 'period';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.endDate) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        amount: parseFloat(formData.amount),
        endDate: new Date(formData.endDate).toISOString()
      };

      if (editingGoal) {
        // Update existing goal
        await updateGoal(editingGoal._id, goalData);
        toast.success('Goal Updated', 'Your goal has been successfully updated.');
      } else {
        // Check if user needs to pay for this goal
          const fee = calculateGoalFee(parseFloat(formData.targetAmount));
        if (fee > 0) {
          // Create goal with fee deduction from wallet
          await createGoalWithFee(goalData, fee);
        } else {
          // Create new goal for free
          await createGoal(goalData);
          toast.success('Goal Created', 'Your new goal has been successfully created!');
        }
      }

      // Reset form and refresh goals
      setFormData({
        name: '',
        description: '',
        targetAmount: '',
        endDate: '',
        category: 'personal',
        frequency: 'monthly',
        amount: '',
        duration: '',
        calculatedAmount: ''
      });
      setShowCreateForm(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Save Error', 'Failed to save goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment success handler removed - now using wallet deduction

  const createGoal = async (goalData) => {
    try {
      const response = await fetch('http://localhost:4000/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: goalData.name,
          description: goalData.description,
          targetAmount: parseFloat(goalData.targetAmount),
          endDate: goalData.endDate, // Changed from deadline to endDate
          frequency: goalData.frequency || 'monthly', // Add required field
          amount: parseFloat(goalData.amount) || 0, // Add required field
          type: goalData.type || 'individual',
          category: goalData.category || 'personal'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.error || 'Failed to create goal');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  };

  const createGoalWithFee = async (goalData, fee) => {
    try {
      const response = await fetch('http://localhost:4000/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: goalData.name,
          description: goalData.description,
          targetAmount: parseFloat(goalData.targetAmount),
          endDate: goalData.endDate,
          frequency: goalData.frequency || 'monthly',
          amount: parseFloat(goalData.amount) || 0,
          type: goalData.type || 'individual',
          category: goalData.category || 'personal',
          feeData: {
            totalFee: fee,
            type: 'goal_creation_fee'
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.message || 'Failed to create goal');
      }

      toast.success('Goal Created', `Your new goal has been created! Fee of ₦${fee.toLocaleString()} deducted from wallet.`);
      return data.data;
    } catch (error) {
      console.error('Error creating goal with fee:', error);
      toast.error('Goal Creation Failed', error.message || 'Failed to create goal');
      throw error;
    }
  };

  const updateGoal = async (goalId, goalData) => {
    const response = await fetch(`http://localhost:4000/api/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        name: goalData.name,
        description: goalData.description,
        targetAmount: parseFloat(goalData.targetAmount),
        endDate: goalData.endDate, // Changed from deadline to endDate
        frequency: goalData.frequency || 'monthly',
        amount: parseFloat(goalData.amount) || 0,
        type: goalData.type || 'individual',
        category: goalData.category || 'personal'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update goal');
    }

    return response.json();
  };

  const deleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete goal');
      }

      toast.success('Goal Deleted', 'Your goal has been successfully deleted.');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Delete Error', 'Failed to delete goal. Please try again.');
    }
  };

  const openContributeModal = () => {
    setContributionData({
      goalId: '',
      amount: '',
      description: ''
    });
    setShowContributeModal(true);
  };

  const handleAddContribution = async (contributionData) => {
    try {
      const response = await fetch('http://localhost:4000/api/contributions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contributionData)
      });

      const data = await response.json();

      if (response.ok) {
        // Check if this is a direct Paystack payment
        // Check for nested structure first (data.data.data.authorizationUrl)
        if (data.data && data.data.data && data.data.data.authorizationUrl) {
          // Open Paystack payment page
          window.open(data.data.data.authorizationUrl, '_blank');
          toast.success('Success', 'Payment page opened. Complete payment to add contribution.');
        } else if (data.data && data.data.authorizationUrl) {
          // Open Paystack payment page
          window.open(data.data.authorizationUrl, '_blank');
          toast.success('Success', 'Payment page opened. Complete payment to add contribution.');
        } else {
          // Wallet payment completed immediately
          toast.success('Success', 'Contribution added successfully!');
          setShowContributeModal(false);
          await fetchGoals();
          await fetchUserStats();
        }
      } else {
        toast.error('Error', data.error || 'Failed to add contribution');
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Error', 'Failed to add contribution. Please try again.');
    }
  };

  const contributeToGoal = async () => {
    if (!contributionData.goalId || !contributionData.amount || parseFloat(contributionData.amount) <= 0) {
      toast.error('Invalid Input', 'Please select a goal and enter a valid contribution amount.');
      return;
    }

    const selectedGoal = goals.find(goal => goal._id === contributionData.goalId);
    if (!selectedGoal) {
      toast.error('Goal Not Found', 'Selected goal not found.');
      return;
    }

    setIsProcessingContribution(true);
    try {
      // Initialize goal contribution payment with Paystack
      const response = await fetch('http://localhost:4000/api/payments/initialize-goal-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          goalId: contributionData.goalId,
          amount: parseFloat(contributionData.amount),
          description: contributionData.description || `Contribution to ${selectedGoal.name}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Redirect to Paystack payment page
          window.location.href = data.data.authorizationUrl;
        } else {
          toast.error('Payment Initialization Failed', data.error || 'Failed to initialize payment');
        }
      } else {
        const errorData = await response.json();
        toast.error('Payment Initialization Failed', errorData.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing goal contribution payment:', error);
      toast.error('Payment Initialization Failed', 'Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessingContribution(false);
    }
  };

  const startEditing = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      targetAmount: goal.targetAmount.toString(),
      endDate: goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : '', // Use endDate
      category: goal.category || 'personal',
      frequency: goal.frequency || 'monthly', // Use frequency
      amount: goal.amount?.toString() || '', // Use amount
      duration: '', // Will be calculated
      calculatedAmount: '' // Will be calculated
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      endDate: '',
      category: 'personal',
      frequency: 'monthly',
      amount: '',
      duration: '',
      calculatedAmount: ''
    });
    setShowCreateForm(false);
  };

  const getProgressPercentage = (goal) => {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const isGoalCompleted = (goal) => {
    if (!goal) return false;
    return (goal.currentAmount || 0) >= (goal.targetAmount || 0);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => getProgressPercentage(goal) >= 100);
  };

  const getIncompleteGoals = () => {
    return goals.filter(goal => getProgressPercentage(goal) < 100);
  };

  // Wallet handlers
  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };

  const handleViewTransactions = () => {
    // TODO: Implement transaction history view
    toast.info('Coming Soon', 'Transaction history will be available soon');
  };

  const handleContributeToGoal = (goal) => {
    setSelectedGoal(goal);
    setShowContributionModal(true);
  };

  const handleContributionSuccess = () => {
    fetchGoals();
    fetchWallet();
  };

  const getGoalStats = () => {
    const completed = getCompletedGoals();
    const incomplete = getIncompleteGoals();
    const totalValue = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    
    return {
      total: goals.length,
      completed: completed.length,
      incomplete: incomplete.length,
      totalValue,
      totalTarget,
      overallProgress: totalTarget > 0 ? (totalValue / totalTarget) * 100 : 0
    };
  };

  const getStatusColor = (goal) => {
    const progress = getProgressPercentage(goal);
    if (progress >= 100) return 'text-loopfund-emerald-600 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20';
    if (progress >= 80) return 'text-loopfund-electric-600 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/20';
    if (progress >= 50) return 'text-loopfund-gold-600 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/20';
    return 'text-loopfund-coral-600 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20';
  };

  const getStatusIcon = (goal) => {
    const progress = getProgressPercentage(goal);
    if (progress >= 100) return <CheckCircle size={16} />;
    if (progress >= 80) return <TrendingUp size={16} />;
    if (progress >= 50) return <Clock size={16} />;
    return <Target size={16} />;
  };

  // Show loading state
  if (isLoading) {
    return (
        <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-loopfund-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-8 h-8 text-loopfund-emerald-600" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Loading Your Goals
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Preparing your financial journey...
            </p>
          </motion.div>
        </div>
    );
  }

  // Show error state
  if (error) {
    return (
        <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-loopfund-coral-600" />
            </div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Failed to Load Goals
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              We encountered an issue while loading your goals
            </p>
            <LoopFundButton 
              onClick={fetchGoals}
              variant="primary"
              size="lg"
              icon={<Target className="w-5 h-5" />}
            >
              Try Again
            </LoopFundButton>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="space-y-8 p-6">
          {/* Revolutionary Header */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  My Financial Goals
                </motion.h1>
                <motion.p 
                  className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Transform your dreams into reality with smart savings
                </motion.p>
              </div>
              
              <div className="flex items-center space-x-4">
                <LoopFundButton
                  onClick={openContributeModal}
                  variant="gold"
                  size="lg"
                  icon={<Banknote className="w-5 h-5" />}
                >
                  Contribute
                </LoopFundButton>
                <LoopFundButton
                  onClick={() => setShowCreateForm(true)}
                  variant="primary"
                  size="lg"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create Goal
                </LoopFundButton>
              </div>
            </div>
          </motion.div>

          {/* Revolutionary Goal Statistics */}
          {goals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group"
              >
                <LoopFundCard className="min-h-[140px] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Total Goals</p>
                      <p className="font-display text-h3 text-loopfund-neutral-900">{getGoalStats().total}</p>
                    </div>
                    <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                      <Target className="w-6 h-6 text-loopfund-emerald-600" />
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <LoopFundCard className="min-h-[140px] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Completed</p>
                      <p className="font-display text-h3 text-loopfund-gold-600">{getGoalStats().completed}</p>
                    </div>
                    <div className="p-3 bg-loopfund-gold-100 rounded-full">
                      <Trophy className="w-6 h-6 text-loopfund-gold-600" />
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative group"
              >
                <LoopFundCard className="min-h-[140px] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">In Progress</p>
                      <p className="font-display text-h3 text-loopfund-coral-600">{getGoalStats().incomplete}</p>
                    </div>
                    <div className="p-3 bg-loopfund-coral-100 rounded-full">
                      <Zap className="w-6 h-6 text-loopfund-coral-600" />
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <LoopFundCard className="min-h-[140px] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Total Saved</p>
                      <p className="font-display text-h3 text-loopfund-emerald-600 break-words">{formatCurrencySimple(getGoalStats().totalValue)}</p>
                    </div>
                    <div className="p-3 bg-loopfund-electric-100 rounded-full">
                      <Banknote className="w-6 h-6 text-loopfund-electric-600" />
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
            </motion.div>
          )}

          {/* Goal Creation Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative"
          >
            <LoopFundCard className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-loopfund-gold-100 rounded-full">
                  <Crown className="w-6 h-6 text-loopfund-gold-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 mb-4">
                    Goal Creation Plan
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-loopfund-neutral-50 rounded-xl">
                      <div className="p-2 bg-loopfund-emerald-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-loopfund-emerald-600" />
                      </div>
                      <span className="font-body text-body-sm text-loopfund-neutral-700">
                        <strong>First Goal:</strong> Create your first individual goal for FREE!
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-loopfund-neutral-50 rounded-xl">
                      <div className="p-2 bg-loopfund-coral-100 rounded-lg">
                        <CreditCard className="w-4 h-4 text-loopfund-coral-600" />
                      </div>
                      <span className="font-body text-body-sm text-loopfund-neutral-700">
                        <strong>Additional Goals:</strong> Pay 2.5% fee (min ₦500, max ₦10,000)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-loopfund-neutral-50 rounded-xl">
                      <div className="p-2 bg-loopfund-electric-100 rounded-lg">
                        <Users className="w-4 h-4 text-loopfund-electric-600" />
                      </div>
                      <span className="font-body text-body-sm text-loopfund-neutral-700">
                        <strong>Group Goals:</strong> Create unlimited group goals for FREE!
                      </span>
                    </div>
                  </div>
                  
                  {!canCreateGoalForFree() && (
                    <div className="mt-6 p-4 bg-loopfund-coral-50 border border-loopfund-coral-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-loopfund-coral-100 rounded-lg">
                          <Lock className="w-4 h-4 text-loopfund-coral-600" />
                        </div>
                        <span className="font-body text-body-sm text-loopfund-coral-700 font-medium">
                          You've used your free goal. Additional goals require a small fee.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Goal Creation Form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <LoopFundCard variant="elevated" className="overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                        </h2>
                        <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Set up your savings goal and invite contributors
                        </p>
                      </div>
                      <button
                        onClick={cancelEdit}
                        className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-elevated"
                      >
                        <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                      </button>
                    </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Basic Information
                    </h3>
                    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Goal Name */}
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Goal Name *
                        </label>
                        <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                          placeholder="e.g., Wedding Fund, Emergency Savings"
                      required
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                    />
                      </div>

                  {/* Category */}
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Category *
                    </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                      >
                        <option value="personal">Personal</option>
                        <option value="family">Family</option>
                        <option value="education">Education</option>
                        <option value="business">Business</option>
                        <option value="travel">Travel</option>
                        <option value="emergency">Emergency</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your goal and why it's important..."
                        rows={3}
                        className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="space-y-6">
                    <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Financial Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Target Amount */}
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Target Amount *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-loopfund-neutral-500 font-body text-body">
                            ₦
                          </span>
                          <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      placeholder="100000"
                      min="0"
                      step="0.01"
                      required
                            className="w-full px-4 py-3 pl-8 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Target Date */}
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Target Date *
                        </label>
                        <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                    />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contribution Frequency */}
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Contribution Frequency
                    </label>
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                  {/* Contribution Amount */}
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                          Suggested Contribution Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-loopfund-neutral-500 font-body text-body">
                            ₦
                          </span>
                          <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="10000"
                      min="0"
                      step="0.01"
                            className="w-full px-4 py-3 pl-8 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                          />
                        </div>
                        <p className="text-xs text-loopfund-neutral-500 mt-1">
                          This is a suggestion. Contributors can choose their own amount.
                        </p>
                      </div>
                    </div>
                </div>

                  {/* Smart Calculation Preview */}
                  {formData.targetAmount && formData.endDate && formData.frequency && (
                    <div className="space-y-6">
                      <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        Goal Preview
                      </h3>
                      
                      <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-lg p-6 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                              Duration
                            </div>
                            <div className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              {formData.duration} days
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                              Suggested per {getFrequencyDisplayName(formData.frequency)}
                            </div>
                            <div className="font-display text-h5 text-loopfund-emerald-600">
                              ₦{parseFloat(formData.calculatedAmount || 0).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                              Target Amount
                            </div>
                            <div className="font-display text-h5 text-loopfund-emerald-600">
                              ₦{parseFloat(formData.targetAmount || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-white dark:bg-loopfund-dark-surface rounded-lg border border-loopfund-emerald-200 dark:border-loopfund-emerald-700">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-loopfund-emerald-600" />
                            <p className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                              Contributors can choose their own contribution amounts. This is just a suggestion based on your timeline.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                    <button
                    type="button"
                    onClick={cancelEdit}
                      className="px-6 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated transition-colors duration-200"
                  >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                      className="px-6 py-3 bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 disabled:bg-loopfund-neutral-400 rounded-lg font-body text-body font-medium text-white transition-colors duration-200 flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4" />
                          <span>{editingGoal ? 'Update Goal' : 'Create Goal'}</span>
                        </>
                      )}
                    </button>
                  </div>
                    </form>
                  </div>
                </LoopFundCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goals Display */}
          {getIncompleteGoals().length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    Your Goals
                  </h2>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {getIncompleteGoals().length} active goals in progress
                  </p>
                </div>
                      </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getIncompleteGoals().map((goal, index) => (
                  <div key={goal._id} className="group">
                    <LoopFundCard variant="elevated" className="h-full">
                      <div className="p-6">
                        {/* Goal Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1 min-w-0">
                            <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 truncate">
                                {goal.name}
                              </h3>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                              {goal.category}
                              </span>
                          </div>
                          
                          {/* Actions Menu */}
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => startEditing(goal)}
                              className="p-2 text-loopfund-neutral-500 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 transition-colors rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal._id)}
                              className="p-2 text-loopfund-neutral-500 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400 transition-colors rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Goal Description */}
                        {goal.description && (
                          <div className="mb-6">
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 line-clamp-2">
                              {goal.description}
                            </p>
                          </div>
                        )}

                        {/* Progress Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Progress</span>
                            <span className="font-display text-h5 text-loopfund-emerald-600">
                              {getProgressPercentage(goal).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-loopfund-emerald-600 transition-all duration-500"
                              style={{ width: `${getProgressPercentage(goal)}%` }}
                            />
                          </div>
                        </div>

                        {/* Goal Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between py-2 px-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg">
                            <span className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Current:</span>
                            <span className="font-display text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              {formatCurrencySimple(goal.currentAmount || 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg">
                            <span className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Target:</span>
                            <span className="font-display text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              {formatCurrencySimple(goal.targetAmount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 px-3 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-lg">
                            <span className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Remaining:</span>
                            <span className="font-display text-body font-medium text-loopfund-emerald-600">
                              {formatCurrencySimple(goal.targetAmount - (goal.currentAmount || 0))}
                            </span>
                          </div>
                        </div>

                        {/* Goal Footer */}
                        <div className="pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {isGoalCompleted(goal) ? (
                                <>
                                  <div className="w-2 h-2 bg-loopfund-gold-500 rounded-full"></div>
                                  <span className="font-body text-body-sm text-loopfund-gold-600">
                                    Completed
                                  </span>
                                </>
                              ) : (
                                <>
                              <div className="w-2 h-2 bg-loopfund-emerald-500 rounded-full"></div>
                              <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                                In Progress
                              </span>
                                </>
                              )}
                          </div>
                            <div className="text-right">
                              <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                              Due: {new Date(goal.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          </div>
                          
                          {/* Contribute Button */}
                          <button
                            onClick={() => {
                              if (isGoalCompleted(goal)) return;
                              setContributionData({
                                goalId: goal._id,
                                amount: '',
                                description: ''
                              });
                              setShowContributeModal(true);
                            }}
                            disabled={isGoalCompleted(goal)}
                            className={`w-full px-4 py-2 rounded-lg font-body text-body-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                              isGoalCompleted(goal)
                                ? 'bg-loopfund-neutral-300 dark:bg-loopfund-neutral-700 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 cursor-not-allowed'
                                : 'bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 text-white'
                            }`}
                          >
                            <Target className="w-4 h-4" />
                            <span>{isGoalCompleted(goal) ? 'Completed' : 'Contribute'}</span>
                          </button>
                        </div>
                      </div>
                    </LoopFundCard>
                  </div>
              ))}
            </div>
            </div>
        )}

          {/* Completed Goals */}
          {getCompletedGoals().length > 0 && (
            <div className="space-y-8">
                <div>
                <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    Completed Goals
                  </h2>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {getCompletedGoals().length} goals successfully achieved
                  </p>
                </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getCompletedGoals().map((goal, index) => (
                  <div key={goal._id} className="group">
                    <LoopFundCard variant="elevated" className="h-full opacity-90">
                      <div className="p-6">
                        {/* Goal Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1 min-w-0">
                            <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 truncate">
                                {goal.name}
                              </h3>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-medium bg-loopfund-gold-100 text-loopfund-gold-700 dark:bg-loopfund-gold-900/30 dark:text-loopfund-gold-300">
                              Completed
                              </span>
                          </div>
                          
                          {/* Actions Menu */}
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => startEditing(goal)}
                              className="p-2 text-loopfund-neutral-500 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 transition-colors rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal._id)}
                              className="p-2 text-loopfund-neutral-500 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400 transition-colors rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Goal Description */}
                        {goal.description && (
                          <div className="mb-6">
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 line-clamp-2">
                              {goal.description}
                            </p>
                          </div>
                        )}

                        {/* Progress Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Progress</span>
                            <span className="font-display text-h5 text-loopfund-gold-600">
                              100%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-loopfund-gold-600 w-full" />
                          </div>
                        </div>

                        {/* Goal Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between py-2 px-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg">
                            <span className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Amount:</span>
                            <span className="font-display text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              {formatCurrencySimple(goal.targetAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Goal Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-loopfund-gold-600" />
                            <span className="font-body text-body-sm text-loopfund-gold-600 font-medium">
                              Completed
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                              {new Date(goal.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </LoopFundCard>
                  </div>
              ))}
            </div>
            </div>
        )}

          {/* Empty State */}
          {goals.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-loopfund-emerald-600" />
              </div>
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                No Goals Yet
              </h3>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8 max-w-md mx-auto">
                Start your financial journey by creating your first savings goal
              </p>
              <button
                  onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-loopfund-emerald-600 hover:bg-loopfund-emerald-700 rounded-lg font-body text-body font-medium text-white transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Goal</span>
              </button>
            </div>
          )}

          {/* Payment Modal removed - now using wallet deduction */}

          {/* Revolutionary Contribution Modal */}
          <AnimatePresence>
            {showContributeModal && (
              <ContributionForm
                goals={goals}
                onSubmit={handleAddContribution}
                onClose={() => setShowContributeModal(false)}
              />
            )}
            {false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-loopfund-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={() => setShowContributeModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LoopFundCard variant="elevated" className="overflow-hidden">
                    
                    <div className="relative p-8">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8">
                        <motion.h2 
                          className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Contribute to Goal
                        </motion.h2>
                        <motion.button
                          onClick={() => setShowContributeModal(false)}
                          className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl flex items-center justify-center transition-colors duration-200"
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                        </motion.button>
                      </div>

                      {/* Goal Selection */}
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                          Select Goal *
                        </label>
                        <div className="relative">
                          <select
                            value={contributionData.goalId}
                            onChange={(e) => setContributionData({ ...contributionData, goalId: e.target.value })}
                            className="w-full px-4 py-4 pl-12 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200"
                            required
                          >
                            <option value="">Choose a goal to contribute to</option>
                            {getIncompleteGoals().map((goal) => (
                              <option key={goal._id} value={goal._id}>
                                {goal.name} - {formatCurrencySimple(goal.targetAmount)} ({getProgressPercentage(goal).toFixed(1)}% complete)
                              </option>
                            ))}
                          </select>
                          <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-loopfund-neutral-500" />
                        </div>
                      </motion.div>

                      {/* Goal Progress Preview */}
                      {contributionData.goalId && (() => {
                        const selectedGoal = goals.find(goal => goal._id === contributionData.goalId);
                        return selectedGoal ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8 p-6 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                          >
                            <div className="flex items-center space-x-4 mb-4">
                              <motion.div 
                                className="w-12 h-12 bg-loopfund-emerald-100 rounded-2xl flex items-center justify-center shadow-loopfund"
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Target className="w-6 h-6 text-loopfund-emerald-600" />
                              </motion.div>
                              <div>
                                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1">
                                  {selectedGoal.name}
                                </h3>
                                <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 break-words">
                                  Target: {formatCurrencySimple(selectedGoal.targetAmount)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm mb-3">
                              <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Current Progress</span>
                              <span className="font-display text-h5 text-loopfund-emerald-600">
                                {formatCurrencySimple(selectedGoal.currentAmount || 0)} / {formatCurrencySimple(selectedGoal.targetAmount)}
                              </span>
                            </div>
                            <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3 overflow-hidden">
                              <motion.div
                                className="bg-loopfund-emerald-500 h-3 rounded-full transition-all duration-300"
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${Math.min(((selectedGoal.currentAmount || 0) / selectedGoal.targetAmount) * 100, 100)}%` 
                                }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        ) : null;
                      })()}

                      <div className="space-y-6">
                        {/* Amount */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <LoopFundInput
                            label="Amount"
                            type="number"
                            value={contributionData.amount}
                            onChange={(e) => setContributionData({ ...contributionData, amount: e.target.value })}
                            placeholder="1000.00"
                            min="0"
                            step="0.01"
                            required
                            icon={<Banknote className="w-5 h-5" />}
                          />
                        </motion.div>

                        {/* Secure Payment Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-loopfund-emerald-100 rounded-full flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-loopfund-emerald-600" />
                              </div>
                              <div>
                                <h4 className="font-body text-body font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                                  Secure Payment via Paystack
                                </h4>
                                <p className="font-body text-body-xs text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                                  Your contribution will be processed securely through Paystack
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                            Description
                          </label>
                          <textarea
                            value={contributionData.description}
                            onChange={(e) => setContributionData({ ...contributionData, description: e.target.value })}
                            placeholder="What's this contribution for?"
                            rows={3}
                            className="w-full px-4 py-4 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text font-body text-body transition-all duration-200 resize-none"
                          />
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div 
                          className="flex space-x-4 pt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <LoopFundButton
                            type="button"
                            onClick={() => setShowContributeModal(false)}
                            variant="secondary"
                            size="lg"
                            className="flex-1 max-w-[140px]"
                          >
                            Cancel
                          </LoopFundButton>
                          <LoopFundButton
                            onClick={contributeToGoal}
                            disabled={!contributionData.goalId || !contributionData.amount || isProcessingContribution}
                            variant="primary"
                            size="lg"
                            icon={isProcessingContribution ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                            className="flex-1"
                          >
                            {isProcessingContribution ? 'Processing...' : 'Pay with Paystack'}
                          </LoopFundButton>
                        </motion.div>
                      </div>
                    </div>
                  </LoopFundCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wallet Modals */}
          <AddMoneyModal
            isOpen={showAddMoneyModal}
            onClose={() => setShowAddMoneyModal(false)}
            onSuccess={handleContributionSuccess}
          />

          <ContributionModal
            isOpen={showContributionModal}
            onClose={() => setShowContributionModal(false)}
            goal={selectedGoal}
            onSuccess={handleContributionSuccess}
          />

        </div>
      </div>
  );
};

export default GoalsPage;   















