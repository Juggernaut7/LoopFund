import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import walletService from '../services/walletService';

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch wallet data
  const fetchWallet = useCallback(async () => {
    try {
      console.log('🔄 Fetching wallet data...');
      setIsLoading(true);
      setError(null);
      const response = await walletService.getWallet();
      console.log('📊 Wallet response:', response);
      setWallet(response.data.data);
      console.log('💰 Wallet updated:', response.data.data);
    } catch (error) {
      console.error('❌ Error fetching wallet:', error);
      setError(error.message);
      toast.error('Wallet Error', 'Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch transactions with enhanced filtering
  const fetchTransactions = useCallback(async (page = 1, limit = 20, filters = {}) => {
    try {
      console.log('🔄 Fetching transactions with filters:', { page, limit, filters });
      const response = await walletService.getTransactions(page, limit, filters);
      console.log('📊 Transactions response:', response);
      console.log('📊 Response data:', response.data);
      console.log('📊 Response data.data:', response.data?.data);
      
      if (response.data && response.data.success && response.data.data) {
        console.log('💰 Setting transactions:', response.data.data.transactions);
        setTransactions(response.data.data.transactions);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Transaction Error', 'Failed to load transactions');
      return null;
    }
  }, [toast]);

  // Add money to wallet
  const addToWallet = useCallback(async (amount, reference, description) => {
    try {
      const response = await walletService.addToWallet(amount, reference, description);
      setWallet(response.data);
      toast.success('Success', 'Money added to wallet successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding to wallet:', error);
      toast.error('Wallet Error', error.response?.data?.message || 'Failed to add money to wallet');
      throw error;
    }
  }, [toast]);

  // Contribute to goal
  const contributeToGoal = useCallback(async (goalId, amount, description) => {
    try {
      const response = await walletService.contributeToGoal(goalId, amount, description);
      setWallet(response.data.wallet);
      toast.success('Contribution Success', 'Contribution made successfully');
      return response.data;
    } catch (error) {
      console.error('Error contributing to goal:', error);
      toast.error('Contribution Error', error.response?.data?.message || 'Failed to contribute to goal');
      throw error;
    }
  }, [toast]);

  // Contribute to group
  const contributeToGroup = useCallback(async (groupId, amount, description) => {
    try {
      const response = await walletService.contributeToGroup(groupId, amount, description);
      setWallet(response.data.wallet);
      toast.success('Contribution Success', 'Group contribution made successfully');
      return response.data;
    } catch (error) {
      console.error('Error contributing to group:', error);
      toast.error('Contribution Error', error.response?.data?.message || 'Failed to contribute to group');
      throw error;
    }
  }, [toast]);

  // Release goal funds
  const releaseGoalFunds = useCallback(async (goalId) => {
    try {
      const response = await walletService.releaseGoalFunds(goalId);
      setWallet(response.data.wallet);
      toast.success('Funds Released', 'Goal funds released to owner successfully');
      return response.data;
    } catch (error) {
      console.error('Error releasing goal funds:', error);
      toast.error('Release Error', error.response?.data?.message || 'Failed to release goal funds');
      throw error;
    }
  }, [toast]);

  // Release group funds
  const releaseGroupFunds = useCallback(async (groupId) => {
    try {
      const response = await walletService.releaseGroupFunds(groupId);
      setWallet(response.data.wallet);
      toast.success('Funds Released', 'Group funds released to creator successfully');
      return response.data;
    } catch (error) {
      console.error('Error releasing group funds:', error);
      toast.error('Release Error', error.response?.data?.message || 'Failed to release group funds');
      throw error;
    }
  }, [toast]);

  // Load wallet on mount
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const withdrawFromWallet = useCallback(async (amount, description, bankAccount) => {
    try {
      console.log('🔄 Withdrawing from wallet:', { amount, description, bankAccount });
      const response = await walletService.withdrawFromWallet(amount, description, bankAccount);
      console.log('📊 Withdrawal response:', response);
      
      if (response.data.success) {
        setWallet(response.data.data);
        toast.success('Withdrawal Requested', 'Your withdrawal request has been submitted for review.');
        return true;
      } else {
        toast.error('Withdrawal Failed', response.data.message || 'Failed to process withdrawal request');
        return false;
      }
    } catch (err) {
      console.error('❌ Withdrawal error:', err);
      toast.error('Withdrawal Error', err.message || 'An unexpected error occurred');
      return false;
    }
  }, [toast]);

  const getWithdrawalRequests = useCallback(async () => {
    try {
      const response = await walletService.getWithdrawalRequests();
      return response.data;
    } catch (err) {
      console.error('Error fetching withdrawal requests:', err);
      return [];
    }
  }, []);

  return {
    wallet,
    transactions,
    isLoading,
    error,
    fetchWallet,
    fetchTransactions,
    addToWallet,
    contributeToGoal,
    contributeToGroup,
    releaseGoalFunds,
    releaseGroupFunds,
    withdrawFromWallet,
    getWithdrawalRequests,
  };
};
