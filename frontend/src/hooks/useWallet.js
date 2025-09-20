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

  // Fetch transactions
  const fetchTransactions = useCallback(async (page = 1, limit = 20, type = null) => {
    try {
      const response = await walletService.getTransactions(page, limit, type);
      setTransactions(response.data.transactions);
      return response.data;
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

  // Load wallet on mount
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

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
    releaseGoalFunds
  };
};
