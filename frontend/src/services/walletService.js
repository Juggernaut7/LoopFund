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

  // Get wallet transactions
  getTransactions: async (page = 1, limit = 20, type = null) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (type) {
      params.append('type', type);
    }
    
    return apiService.get(`/wallet/transactions?${params}`);
  },

  // Release goal funds to goal owner
  releaseGoalFunds: async (goalId) => {
    return apiService.post('/wallet/release-goal-funds', {
      goalId
    });
  }
};

export default walletService;
