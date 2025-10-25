import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import ContributionForm from '../components/contributions/ContributionForm';
import ContributionTimeline from '../components/contributions/ContributionTimeline';
import ContributionStats from '../components/contributions/ContributionStats';
import ContributionCharts from '../components/contributions/ContributionCharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

const ContributionsPage = () => {
  const [contributions, setContributions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchContributions();
    fetchGoals();
    fetchStats();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contributions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContributions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contributions:', error);
      toast.error('Error', 'Failed to load contributions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contributions/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats:', response.status);
        // Set default stats structure if API fails
        setStats({
          totalContributed: 0,
          totalContributions: 0,
          averageContribution: 0,
          monthlyStats: [],
          paymentMethods: []
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats structure on error
      setStats({
        totalContributed: 0,
        totalContributions: 0,
        averageContribution: 0,
        monthlyStats: [],
        paymentMethods: []
      });
    }
  };

  const handleAddContribution = async (contributionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contributions`, {
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
          setShowForm(false);
          fetchContributions();
          fetchStats();
        }
      } else {
        toast.error('Error', data.error || 'Failed to add contribution');
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Error', 'Failed to add contribution. Please try again.');
    }
  };

  const filteredContributions = contributions.filter(contribution => {
    const matchesFilter = filter === 'all' || contribution.type === filter;
    const matchesSearch = contribution.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.goal?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Contributions
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Track your savings progress and contribution history
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Contribution</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        {stats ? (
          <ContributionStats stats={stats} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-16 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-20"></div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {stats ? (
          <ContributionCharts data={stats} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-32 mb-4"></div>
                <div className="h-48 bg-slate-200 dark:bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contributions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {[
                { id: 'all', label: 'All', count: contributions.length },
                { id: 'individual', label: 'Individual', count: contributions.filter(c => c.type === 'individual').length },
                { id: 'group', label: 'Group', count: contributions.filter(c => c.type === 'group').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Contributions Timeline */}
        <ContributionTimeline contributions={filteredContributions} />

        {/* Add Contribution Form Modal */}
        <AnimatePresence>
          {showForm && (
            <ContributionForm
              goals={goals}
              onSubmit={handleAddContribution}
              onClose={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
  );
};

export default ContributionsPage; 