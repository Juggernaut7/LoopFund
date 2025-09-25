import apiService from './api';

const walletService = {
  // Get user wallet
  getWallet: async () => {
    console.log('🔄 Calling wallet API...');
    const response = await apiService.get('/wallet');
    console.log('📊 Wallet API response:', response);
    return response;
  },

  // Add money to wallet
  addToWallet: async (amount, reference, description) => {
    return apiService.post('/wallet/add', {
      amount,
      reference,
      description
    });
  },

  // Contribute to goal from wallet
  contributeToGoal: async (goalId, amount, description) => {
    return apiService.post('/wallet/contribute/goal', {
      goalId,
      amount,
      description
    });
  },

  // Contribute to group from wallet
  contributeToGroup: async (groupId, amount, description) => {
    return apiService.post('/wallet/contribute/group', {
      groupId,
      amount,
      description
    });
  },

  // Get wallet transactions with enhanced filtering
  getTransactions: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    // Add filter parameters
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);
    
    console.log('🔄 Calling wallet transactions API with params:', params.toString());
    const response = await apiService.get(`/wallet/transactions?${params}`);
    console.log('📊 Wallet transactions API response:', response);
    return response;
  },

  // Release goal funds to goal owner
  releaseGoalFunds: async (goalId) => {
    return apiService.post('/wallet/release-goal-funds', {
      goalId
    });
  },

  // Withdraw money from wallet
  withdrawFromWallet: async (amount, description, bankAccount) => {
    return apiService.post('/wallet/withdraw', {
      amount,
      description,
      bankAccount
    });
  },

  // Get withdrawal requests
  getWithdrawalRequests: async () => {
    return apiService.get('/wallet/withdrawals');
  },

  // Approve withdrawal (admin only)
  approveWithdrawal: async (transactionId) => {
    return apiService.post('/wallet/approve-withdrawal', {
      transactionId
    });
  }
};

export default walletService;
