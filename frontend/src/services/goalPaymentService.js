// Goal Payment Service for Paystack Integration
import api from './api';

class GoalPaymentService {
  constructor() {
    this.baseURL = 'http://localhost:4000/api';
  }

  // Initialize payment for goal creation
  async initializeGoalPayment(goalData) {
    try {
      const response = await fetch(`${this.baseURL}/payments/initialize-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          goalName: goalData.name,
          targetAmount: parseFloat(goalData.targetAmount),
          description: goalData.description,
          category: goalData.category,
          endDate: goalData.endDate,
          frequency: goalData.frequency,
          amount: parseFloat(goalData.amount) || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initialize payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error initializing goal payment:', error);
      throw error;
    }
  }

  // Verify payment status
  async verifyPayment(reference) {
    try {
      const response = await fetch(`${this.baseURL}/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Calculate fee for goal creation
  async calculateGoalFee(targetAmount) {
    try {
      const response = await fetch(`${this.baseURL}/payments/calculate-goal-fee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          targetAmount: parseFloat(targetAmount)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to calculate fee');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating fee:', error);
      throw error;
    }
  }

  // Get user's payment history
  async getPaymentHistory() {
    try {
      const response = await fetch(`${this.baseURL}/payments/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }
}

export default new GoalPaymentService();
