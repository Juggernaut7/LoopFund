const TransactionLog = require('../models/TransactionLog');
const User = require('../models/User');
const Group = require('../models/Group');
const Goal = require('../models/Goal');
const Payment = require('../models/Payment');

class TransactionService {
  // Create a new transaction log
  async createTransaction(transactionData) {
    try {
      const transaction = new TransactionLog(transactionData);
      await transaction.save();
      
      console.log('📝 Transaction created:', {
        id: transaction._id,
        transactionId: transaction.transactionId,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status
      });
      
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Get user transactions with advanced filtering
  async getUserTransactions(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        status,
        paymentMethod,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search
      } = options;

      const skip = (page - 1) * limit;
      const query = { user: userId };

      // Apply filters
      if (type) query.type = type;
      if (status) query.status = status;
      if (paymentMethod) query.paymentMethod = paymentMethod;
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      if (search) {
        query.$or = [
          { transactionId: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const transactions = await TransactionLog.find(query)
        .populate('goal', 'name targetAmount currentAmount')
        .populate('group', 'name targetAmount currentAmount')
        .populate('createdBy', 'name email')
        .populate('approvedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await TransactionLog.countDocuments(query);

      return {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }

  // Get transaction statistics
  async getTransactionStats(userId, timeRange = '30') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const stats = await TransactionLog.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalFees: { $sum: '$fee' },
            netAmount: { $sum: '$netAmount' },
            avgTransactionAmount: { $avg: '$amount' },
            completedTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            failedTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            pendingTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        }
      ]);

      // Get transactions by type
      const transactionsByType = await TransactionLog.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Get transactions by status
      const transactionsByStatus = await TransactionLog.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      // Get monthly trend
      const monthlyTrend = await TransactionLog.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            completedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      return {
        summary: stats[0] || {
          totalTransactions: 0,
          totalAmount: 0,
          totalFees: 0,
          netAmount: 0,
          avgTransactionAmount: 0,
          completedTransactions: 0,
          failedTransactions: 0,
          pendingTransactions: 0
        },
        byType: transactionsByType,
        byStatus: transactionsByStatus,
        monthlyTrend,
        timeRange
      };
    } catch (error) {
      console.error('Error getting transaction stats:', error);
      throw error;
    }
  }

  // Get transaction by ID
  async getTransactionById(transactionId, userId) {
    try {
      const transaction = await TransactionLog.findOne({
        _id: transactionId,
        user: userId
      })
        .populate('goal', 'name targetAmount currentAmount')
        .populate('group', 'name targetAmount currentAmount')
        .populate('createdBy', 'name email')
        .populate('approvedBy', 'name email');

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      console.error('Error getting transaction by ID:', error);
      throw error;
    }
  }

  // Update transaction status
  async updateTransactionStatus(transactionId, status, userId, metadata = {}) {
    try {
      const updateData = { status };
      
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }
      
      if (metadata.approvedBy) {
        updateData.approvedBy = metadata.approvedBy;
        updateData.approvedAt = new Date();
      }

      const transaction = await TransactionLog.findOneAndUpdate(
        { _id: transactionId, user: userId },
        updateData,
        { new: true }
      );

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      console.log('📝 Transaction status updated:', {
        id: transaction._id,
        transactionId: transaction.transactionId,
        status: transaction.status
      });

      return transaction;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  // Create transaction from payment
  async createTransactionFromPayment(payment) {
    try {
      const transactionData = {
        transactionId: payment.reference,
        type: this.mapPaymentTypeToTransactionType(payment.type),
        status: payment.status === 'successful' ? 'completed' : 'failed',
        amount: payment.amount / 100, // Convert from kobo
        currency: payment.currency || 'NGN',
        fee: payment.metadata?.processingFee || 0,
        user: payment.userId,
        goal: payment.metadata?.goalId,
        group: payment.metadata?.groupId,
        paymentMethod: 'card',
        paymentProvider: 'paystack',
        providerTransactionId: payment.reference,
        providerReference: payment.reference,
        description: payment.metadata?.description || 'Payment transaction',
        metadata: {
          paymentId: payment._id,
          customerEmail: payment.metadata?.customerEmail,
          customerName: payment.metadata?.customerName
        },
        initiatedAt: payment.createdAt,
        processedAt: payment.updatedAt,
        completedAt: payment.status === 'successful' ? payment.updatedAt : null
      };

      const transaction = await this.createTransaction(transactionData);
      return transaction;
    } catch (error) {
      console.error('Error creating transaction from payment:', error);
      throw error;
    }
  }

  // Map payment type to transaction type
  mapPaymentTypeToTransactionType(paymentType) {
    const mapping = {
      'group_creation': 'contribution',
      'group_contribution': 'contribution',
      'goal_creation': 'contribution',
      'goal_contribution': 'contribution',
      'premium_upgrade': 'fee',
      'challenge_access': 'fee',
      'other': 'contribution'
    };
    
    return mapping[paymentType] || 'contribution';
  }

  // Get recent transactions
  async getRecentTransactions(userId, limit = 10) {
    try {
      const transactions = await TransactionLog.find({ user: userId })
        .populate('goal', 'name')
        .populate('group', 'name')
        .sort({ createdAt: -1 })
        .limit(limit);

      return transactions;
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      throw error;
    }
  }

  // Get transactions by date range
  async getTransactionsByDateRange(userId, startDate, endDate) {
    try {
      const transactions = await TransactionLog.find({
        user: userId,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
        .populate('goal', 'name')
        .populate('group', 'name')
        .sort({ createdAt: -1 });

      return transactions;
    } catch (error) {
      console.error('Error getting transactions by date range:', error);
      throw error;
    }
  }

  // Export transactions to CSV
  async exportTransactions(userId, options = {}) {
    try {
      const { startDate, endDate, type, status } = options;
      
      const query = { user: userId };
      if (startDate) query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
      if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
      if (type) query.type = type;
      if (status) query.status = status;

      const transactions = await TransactionLog.find(query)
        .populate('goal', 'name')
        .populate('group', 'name')
        .sort({ createdAt: -1 });

      return transactions;
    } catch (error) {
      console.error('Error exporting transactions:', error);
      throw error;
    }
  }

  // Helper function to get start date based on time range
  getStartDate(timeRange) {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90':
        startDate.setDate(now.getDate() - 90);
        break;
      case '365':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    return startDate;
  }
}

module.exports = new TransactionService();
