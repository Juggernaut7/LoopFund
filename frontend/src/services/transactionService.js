class TransactionService {
  constructor() {
    this.baseURL = 'http://localhost:4000/api';
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Get user transactions with filtering
  async getUserTransactions(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters
      Object.keys(options).forEach(key => {
        if (options[key] !== undefined && options[key] !== null && options[key] !== '') {
          queryParams.append(key, options[key]);
        }
      });

      const response = await fetch(`${this.baseURL}/transactions?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Get transaction statistics
  async getTransactionStats(timeRange = '30') {
    try {
      const response = await fetch(`${this.baseURL}/transactions/stats?timeRange=${timeRange}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw error;
    }
  }

  // Get transaction analytics
  async getTransactionAnalytics(timeRange = '30') {
    try {
      const response = await fetch(`${this.baseURL}/transactions/analytics?timeRange=${timeRange}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction analytics:', error);
      throw error;
    }
  }

  // Get transaction by ID
  async getTransactionById(transactionId) {
    try {
      const response = await fetch(`${this.baseURL}/transactions/${transactionId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  // Get recent transactions
  async getRecentTransactions(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/transactions/recent?limit=${limit}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      throw error;
    }
  }

  // Get transactions by date range
  async getTransactionsByDateRange(startDate, endDate) {
    try {
      const response = await fetch(`${this.baseURL}/transactions/date-range?startDate=${startDate}&endDate=${endDate}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions by date range');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }

  // Update transaction status
  async updateTransactionStatus(transactionId, status, notes = '') {
    try {
      const response = await fetch(`${this.baseURL}/transactions/${transactionId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, notes })
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  // Export transactions
  async exportTransactions(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(options).forEach(key => {
        if (options[key] !== undefined && options[key] !== null && options[key] !== '') {
          queryParams.append(key, options[key]);
        }
      });

      const response = await fetch(`${this.baseURL}/transactions/export?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to export transactions');
      }

      // Handle CSV download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Error exporting transactions:', error);
      throw error;
    }
  }

  // Format transaction type for display
  formatTransactionType(type) {
    const typeMap = {
      'contribution': 'Contribution',
      'withdrawal': 'Withdrawal',
      'refund': 'Refund',
      'fee': 'Fee',
      'bonus': 'Bonus',
      'transfer': 'Transfer',
      'adjustment': 'Adjustment'
    };
    return typeMap[type] || type;
  }

  // Format transaction status for display
  formatTransactionStatus(status) {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'reversed': 'Reversed'
    };
    return statusMap[status] || status;
  }

  // Get status color for UI
  getStatusColor(status) {
    const colorMap = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'processing': 'text-blue-600 bg-blue-100',
      'completed': 'text-green-600 bg-green-100',
      'failed': 'text-red-600 bg-red-100',
      'cancelled': 'text-gray-600 bg-gray-100',
      'reversed': 'text-orange-600 bg-orange-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  }

  // Get type color for UI
  getTypeColor(type) {
    const colorMap = {
      'contribution': 'text-green-600 bg-green-100',
      'withdrawal': 'text-red-600 bg-red-100',
      'refund': 'text-blue-600 bg-blue-100',
      'fee': 'text-orange-600 bg-orange-100',
      'bonus': 'text-purple-600 bg-purple-100',
      'transfer': 'text-indigo-600 bg-indigo-100',
      'adjustment': 'text-gray-600 bg-gray-100'
    };
    return colorMap[type] || 'text-gray-600 bg-gray-100';
  }
}

export default new TransactionService();
