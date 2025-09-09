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
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Crown,
  Lock,
  Banknote,
  X
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import { useAuthStore } from '../store/useAuthStore';
import goalPaymentService from '../services/goalPaymentService';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionData, setContributionData] = useState({
    goalId: '',
    amount: '',
    method: 'bank_transfer',
    description: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    endDate: '',
    category: 'personal',
    frequency: 'monthly',
    amount: ''
  });
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Fetch goals and user stats on component mount
  useEffect(() => {
    fetchGoals();
    fetchUserStats();
  }, []);

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

  // Check if user can create goal for free
  const canCreateGoalForFree = () => {
    if (!userStats) return false;
    const individualGoals = goals.filter(goal => !goal.isGroupGoal);
    return individualGoals.length === 0; // First individual goal is free
  };

  // Calculate fee for additional goals
  const calculateGoalFee = (targetAmount) => {
    const baseFee = targetAmount * 0.025; // 2.5% fee
    const minFee = 500; // Minimum ₦500
    const maxFee = 10000; // Maximum ₦10,000
    return Math.max(minFee, Math.min(maxFee, baseFee));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.endDate) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }

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
        if (!canCreateGoalForFree()) {
          const fee = calculateGoalFee(parseFloat(formData.targetAmount));
          // Show payment modal
          setShowPaymentModal(true);
          return;
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
        amount: ''
      });
      setShowCreateForm(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Save Error', 'Failed to save goal. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        amount: parseFloat(formData.amount),
        endDate: new Date(formData.endDate).toISOString()
      };
      
      console.log('Frontend goal data being sent:', goalData);
      console.log('Target amount type:', typeof goalData.targetAmount, goalData.targetAmount);
      
      // Initialize payment with Paystack
      const paymentResult = await goalPaymentService.initializeGoalPayment(goalData);
      
      if (paymentResult.success) {
        // Open Paystack payment page
        window.open(paymentResult.data.authorizationUrl, '_blank');
        
        // Show success message
        toast.success('Payment Initiated', 'Redirecting to payment page...');
        
        // Reset form and close modals
        setFormData({
          name: '',
          description: '',
          targetAmount: '',
          endDate: '',
          category: 'personal',
          frequency: 'monthly',
          amount: ''
        });
        setShowCreateForm(false);
        setShowPaymentModal(false);
        
        // Refresh goals after a delay to allow for payment processing
        setTimeout(() => {
          fetchGoals();
        }, 5000);
      } else {
        toast.error('Payment Error', paymentResult.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error', 'Failed to process payment. Please try again.');
    }
  };

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
      method: 'bank_transfer',
      description: ''
    });
    setShowContributeModal(true);
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

    try {
      const response = await fetch('http://localhost:4000/api/contributions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          goalId: contributionData.goalId,
          amount: parseFloat(contributionData.amount),
          method: contributionData.method,
          description: contributionData.description || `Contribution to ${selectedGoal.name}`,
          type: 'individual'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to contribute to goal');
      }

      toast.success('Contribution Successful', `Successfully contributed $${parseFloat(contributionData.amount).toLocaleString()} to ${selectedGoal.name}!`);
      setShowContributeModal(false);
      setContributionData({
        goalId: '',
        amount: '',
        method: 'bank_transfer',
        description: ''
      });
      fetchGoals(); // Refresh goals to show updated progress
    } catch (error) {
      console.error('Error contributing to goal:', error);
      toast.error('Contribution Failed', 'Failed to contribute to goal. Please try again.');
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
      amount: goal.amount?.toString() || '' // Use amount
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
      amount: ''
    });
    setShowCreateForm(false);
  };

  const getProgressPercentage = (goal) => {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => getProgressPercentage(goal) >= 100);
  };

  const getIncompleteGoals = () => {
    return goals.filter(goal => getProgressPercentage(goal) < 100);
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
    if (progress >= 100) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    if (progress >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    if (progress >= 50) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
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
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your goals...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">Failed to load goals</p>
            <button 
              onClick={fetchGoals} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              My Goals
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage your savings goals and track your progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={openContributeModal}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-2xl border border-orange-500/20"
            >
              <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span>Contribute</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-2xl border border-blue-500/20"
            >
              <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <span>Create Goal</span>
            </motion.button>
          </div>
        </div>

        {/* Goal Statistics */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Goals</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{getGoalStats().total}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-3xl font-bold text-orange-600">{getGoalStats().completed}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{getGoalStats().incomplete}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Saved</p>
                  <p className="text-3xl font-bold text-orange-600">${getGoalStats().totalValue.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Revenue Model Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Goal Creation Plan
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300"><strong>First Goal:</strong> Create your first individual goal for FREE!</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300"><strong>Additional Goals:</strong> Pay 2.5% fee (min ₦500, max ₦10,000)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300"><strong>Group Goals:</strong> Create unlimited group goals for FREE!</span>
                </div>
              </div>
              {!canCreateGoalForFree() && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                      You've used your free goal. Additional goals require a small fee.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Create/Edit Goal Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Goal Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Goal Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., Vacation Fund"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="travel">Travel</option>
                      <option value="emergency">Emergency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="1000"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Contribution Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contribution Frequency
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {/* Contribution Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contribution Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="100"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Describe your goal..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Incomplete Goals */}
        {getIncompleteGoals().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Goals In Progress ({getIncompleteGoals().length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getIncompleteGoals().map((goal) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Goal Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {goal.name}
                    </h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Individual
                    </span>
                  </div>
                </div>
                
                {/* Actions Menu */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(goal)}
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Goal Description */}
              {goal.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {goal.description}
                </p>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getProgressPercentage(goal).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${getProgressPercentage(goal)}%` }}
                  />
                </div>
              </div>

              {/* Goal Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Current:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${(goal.currentAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Target:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Remaining:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${(goal.targetAmount - (goal.currentAmount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Goal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal)}`}>
                  {getStatusIcon(goal)}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Due: {new Date(goal.endDate).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Goals */}
        {getCompletedGoals().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Completed Goals ({getCompletedGoals().length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCompletedGoals().map((goal) => (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 group opacity-95"
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {goal.name}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          Completed
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions Menu */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(goal)}
                        className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Goal Description */}
                  {goal.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-medium text-orange-600">
                        {getProgressPercentage(goal).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                      <div
                        className="h-2 rounded-full bg-orange-600"
                        style={{ width: `${getProgressPercentage(goal)}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Current:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ${(goal.currentAmount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Target:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Remaining:</span>
                      <span className="font-medium text-orange-600">
                        ${(goal.targetAmount - (goal.currentAmount || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Goal Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 text-orange-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Goal Achieved!</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Due: {new Date(goal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {goals.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No goals yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start your savings journey by creating your first goal
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Create Your First Goal
            </button>
          </motion.div>
        )}

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPaymentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Create Additional Goal
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    You've used your free goal. Create additional goals with a small fee.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Goal Details:</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{formData.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Target: ₦{parseFloat(formData.targetAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Fee: ₦{calculateGoalFee(parseFloat(formData.targetAmount || 0)).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePaymentSuccess}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Pay ₦{calculateGoalFee(parseFloat(formData.targetAmount || 0)).toLocaleString()} & Create Goal
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contribution Modal */}
        <AnimatePresence>
          {showContributeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowContributeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Contribute to Goal
                  </h2>
                  <button
                    onClick={() => setShowContributeModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Goal Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Goal *
                  </label>
                  <select
                    value={contributionData.goalId}
                    onChange={(e) => setContributionData({ ...contributionData, goalId: e.target.value })}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Choose a goal to contribute to</option>
                    {getIncompleteGoals().map((goal) => (
                      <option key={goal._id} value={goal._id}>
                        {goal.name} - ${goal.targetAmount.toLocaleString()} ({getProgressPercentage(goal).toFixed(1)}% complete)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Goal Progress Preview */}
                {contributionData.goalId && (() => {
                  const selectedGoal = goals.find(goal => goal._id === contributionData.goalId);
                  return selectedGoal ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {selectedGoal.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Target: ${selectedGoal.targetAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Current Progress</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          ${selectedGoal.currentAmount || 0} / ${selectedGoal.targetAmount}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(((selectedGoal.currentAmount || 0) / selectedGoal.targetAmount) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </motion.div>
                  ) : null;
                })()}

                <div className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={contributionData.amount}
                        onChange={(e) => setContributionData({ ...contributionData, amount: e.target.value })}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'bank_transfer', label: 'Bank Transfer', icon: Banknote },
                        { id: 'card_payment', label: 'Card Payment', icon: CreditCard },
                        { id: 'cash', label: 'Cash', icon: DollarSign },
                        { id: 'other', label: 'Other', icon: DollarSign }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setContributionData({ ...contributionData, method: method.id })}
                          className={`p-3 border rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                            contributionData.method === method.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
                          }`}
                        >
                          <method.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={contributionData.description}
                      onChange={(e) => setContributionData({ ...contributionData, description: e.target.value })}
                      placeholder="What's this contribution for?"
                      rows={3}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowContributeModal(false)}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={contributeToGoal}
                      disabled={!contributionData.goalId || !contributionData.amount}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Contribution
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default GoalsPage;   















