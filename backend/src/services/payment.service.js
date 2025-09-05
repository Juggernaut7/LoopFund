const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Group = require('../models/Group');
const User = require('../models/User');
const paystackConfig = require('../config/paystack');

class PaymentService {
  constructor() {
    this.secretKey = paystackConfig.secretKey;
    this.publicKey = paystackConfig.publicKey;
    this.baseURL = paystackConfig.baseURL;
    this.currency = paystackConfig.currency;
    this.webhookSecret = paystackConfig.webhookSecret;
  }

  // Verify webhook signature for security
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) {
      console.warn('⚠️ Webhook secret not configured, skipping signature verification');
      return true; // Allow in development
    }

    try {
      const hash = crypto
        .createHmac('sha512', this.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      return hash === signature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  // Calculate dynamic fee based on amount and duration
  calculateGroupCreationFee(targetAmount, durationMonths = 1) {
    // Base fee: 2% of target amount
    let baseFee = targetAmount * paystackConfig.feeSettings.basePercentage;
    
    // Duration multiplier
    let durationMultiplier = 0;
    if (durationMonths <= 1) {
      durationMultiplier = paystackConfig.feeSettings.durationMultipliers[1];
    } else if (durationMonths <= 3) {
      durationMultiplier = paystackConfig.feeSettings.durationMultipliers[3];
    } else if (durationMonths <= 6) {
      durationMultiplier = paystackConfig.feeSettings.durationMultipliers[6];
    } else if (durationMonths <= 12) {
      durationMultiplier = paystackConfig.feeSettings.durationMultipliers[12];
    } else {
      durationMultiplier = paystackConfig.feeSettings.durationMultipliers[24];
    }
    
    const durationFee = targetAmount * durationMultiplier;
    const totalFee = baseFee + durationFee;
    
    // Apply min/max constraints
    const finalFee = Math.max(
      paystackConfig.feeSettings.minFee, 
      Math.min(paystackConfig.feeSettings.maxFee, totalFee)
    );
    
    return {
      baseFee: Math.round(baseFee),
      durationFee: Math.round(durationFee),
      totalFee: Math.round(finalFee),
      percentage: ((finalFee / targetAmount) * 100).toFixed(1),
      durationMonths,
      breakdown: {
        basePercentage: (paystackConfig.feeSettings.basePercentage * 100).toFixed(1),
        durationPercentage: (durationMultiplier * 100).toFixed(1),
        totalPercentage: ((finalFee / targetAmount) * 100).toFixed(1)
      }
    };
  }

  // Initialize payment for group creation
  async initializeGroupPayment(userId, groupData) {
    try {
      const { targetAmount, durationMonths = 1 } = groupData;
      const feeCalculation = this.calculateGroupCreationFee(targetAmount, durationMonths);
      
      // Validate minimum amount
      if (targetAmount < 1000) {
        return {
          success: false,
          error: 'Minimum target amount is ₦1,000'
        };
      }

      // Validate maximum amount
      if (targetAmount > 10000000) {
        return {
          success: false,
          error: 'Maximum target amount is ₦10,000,000'
        };
      }

      // Validate required fields
      if (!groupData.userEmail && !groupData.userName) {
        return {
          success: false,
          error: 'User email or name is required for payment initialization'
        };
      }

      // Create payment record in database
      const payment = new Payment({
        userId,
        reference: `GROUP_${Date.now()}_${userId}`,
        amount: feeCalculation.totalFee * 100, // Convert to kobo for Paystack
        currency: this.currency,
        type: 'group_creation',
        status: 'pending',
        metadata: {
          groupName: groupData.name,
          groupTarget: groupData.targetAmount,
          description: groupData.description,
          customerEmail: groupData.userEmail,
          customerName: groupData.userName || 'User',
          durationMonths: groupData.durationMonths,
          feeBreakdown: feeCalculation
        }
      });

      await payment.save();
      
      const paymentData = {
        amount: feeCalculation.totalFee * 100, // Convert to kobo for Paystack
        email: groupData.userEmail || groupData.userName || 'user@example.com',
        reference: payment.reference,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/verify`,
        metadata: {
          userId,
          groupName: groupData.name,
          groupTarget: groupData.targetAmount,
          durationMonths: groupData.durationMonths,
          feeBreakdown: feeCalculation,
          type: 'group_creation',
          paymentId: payment._id.toString(),
          custom_fields: [
            {
              display_name: 'Group Name',
              variable_name: 'group_name',
              value: groupData.name
            },
            {
              display_name: 'Target Amount',
              variable_name: 'target_amount',
              value: `₦${groupData.targetAmount.toLocaleString()}`
            },
            {
              display_name: 'Duration',
              variable_name: 'duration',
              value: `${groupData.durationMonths} months`
            },
            {
              display_name: 'Creation Fee',
              variable_name: 'fee',
              value: `₦${feeCalculation.totalFee.toLocaleString()}`
            },
            {
              display_name: 'Fee Breakdown',
              variable_name: 'fee_breakdown',
              value: `Base: ${feeCalculation.breakdown.basePercentage}% + Duration: ${feeCalculation.breakdown.durationPercentage}%`
            }
          ]
        }
      };

      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update payment with Paystack data
      payment.paystackData = {
        accessCode: response.data.data.access_code,
        authorizationUrl: response.data.data.authorization_url
      };
      await payment.save();

      return {
        success: true,
        data: {
          authorizationUrl: response.data.data.authorization_url,
          reference: response.data.data.reference,
          accessCode: response.data.data.access_code,
          feeCalculation,
          paymentId: payment._id,
          amount: feeCalculation.totalFee,
          currency: this.currency
        }
      };
    } catch (error) {
      console.error('Payment initialization failed:', error.response?.data || error.message);
      
      // Handle specific Paystack errors
      if (error.response?.data?.message) {
        return {
          success: false,
          error: `Paystack Error: ${error.response.data.message}`
        };
      }
      
      return {
        success: false,
        error: 'Payment initialization failed. Please try again.'
      };
    }
  }

  // Verify payment and create group if successful
  async verifyPayment(reference) {
    try {
      // First check if we have this payment in our database
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found in our system'
        };
      }

      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      const transaction = response.data.data;
      
      if (transaction.status === 'success') {
        // Update payment status
        await payment.markSuccessful({
          customerId: transaction.customer?.id,
          paidAt: transaction.paid_at,
          channel: transaction.channel,
          ipAddress: transaction.ip_address,
          fees: transaction.fees
        });

        // Create group if this is a group creation payment
        if (payment.type === 'group_creation' && payment.metadata.groupName) {
          try {
            const group = new Group({
              name: payment.metadata.groupName,
              description: payment.metadata.description || '',
              targetAmount: payment.metadata.groupTarget,
              durationMonths: 1, // Default duration
              createdBy: payment.userId,
              members: [{
                user: payment.userId,
                role: 'owner',
                joinedAt: new Date(),
                isActive: true
              }],
              settings: {
                isPublic: false,
                allowInvites: true,
                requireApproval: false,
                maxMembers: 10
              },
              startDate: new Date(),
              endDate: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)) // 6 months from now
            });

            await group.save();

            // Update payment with group ID
            payment.metadata.groupId = group._id;
            await payment.save();

            return {
              success: true,
              data: {
                status: transaction.status,
                amount: transaction.amount,
                reference: transaction.reference,
                metadata: transaction.metadata,
                customer: transaction.customer,
                paidAt: transaction.paid_at,
                groupId: group._id,
                groupName: group.name
              }
            };
          } catch (groupError) {
            console.error('Failed to create group after payment:', groupError);
            // Payment was successful but group creation failed
            return {
              success: true,
              data: {
                status: transaction.status,
                amount: transaction.amount,
                reference: transaction.reference,
                metadata: transaction.metadata,
                customer: transaction.customer,
                paidAt: transaction.paid_at,
                warning: 'Payment successful but group creation failed. Please contact support.'
              }
            };
          }
        }

        return {
          success: true,
          data: {
            status: transaction.status,
            amount: transaction.amount,
            reference: transaction.reference,
            metadata: transaction.metadata,
            customer: transaction.customer,
            paidAt: transaction.paid_at
          }
        };
      } else {
        // Payment failed or pending
        await payment.markFailed();
        return {
          success: false,
          error: `Payment status: ${transaction.status}`,
          data: {
            status: transaction.status,
            amount: transaction.amount,
            reference: transaction.reference
          }
        };
      }
    } catch (error) {
      console.error('Payment verification failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed'
      };
    }
  }

  // Process webhook from Paystack
  async processWebhook(event) {
    try {
      console.log(`📨 Processing webhook event: ${event.event}`);
      
      switch (event.event) {
        case 'charge.success':
          const transaction = event.data;
          const reference = transaction.reference;
          
          console.log(`💰 Processing successful charge for: ${reference}`);
          
          // Verify the payment
          const verificationResult = await this.verifyPayment(reference);
          
          if (verificationResult.success) {
            console.log('✅ Webhook processed successfully for:', reference);
            return {
              success: true,
              message: 'Payment processed and group created successfully'
            };
          } else {
            console.error('❌ Webhook verification failed for:', reference, verificationResult.error);
            return {
              success: false,
              error: verificationResult.error
            };
          }
          
        case 'charge.failed':
          console.log(`❌ Charge failed for: ${event.data.reference}`);
          // Update payment status to failed
          try {
            const payment = await Payment.findOne({ reference: event.data.reference });
            if (payment) {
              await payment.markFailed();
              console.log(`✅ Payment marked as failed: ${event.data.reference}`);
            }
          } catch (error) {
            console.error('Failed to update payment status:', error);
          }
          return {
            success: true,
            message: 'Payment failure processed'
          };
          
        case 'transfer.success':
          console.log(`✅ Transfer successful: ${event.data.reference}`);
          return {
            success: true,
            message: 'Transfer success processed'
          };
          
        case 'transfer.failed':
          console.log(`❌ Transfer failed: ${event.data.reference}`);
          return {
            success: true,
            message: 'Transfer failure processed'
          };
          
        default:
          console.log(`ℹ️ Unhandled webhook event: ${event.event}`);
          return {
            success: true,
            message: 'Webhook event processed (unhandled)'
          };
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Failed to get payment details:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get payment details'
      };
    }
  }

  // Get payment by reference from our database
  async getPaymentByReference(reference) {
    try {
      const payment = await Payment.findOne({ reference }).populate('userId', 'email name');
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found'
        };
      }
      
      return {
        success: true,
        data: payment
      };
    } catch (error) {
      console.error('Failed to get payment from database:', error);
      return {
        success: false,
        error: 'Failed to get payment details'
      };
    }
  }

  // Get public key for frontend
  getPublicKey() {
    return this.publicKey;
  }

  // Calculate fees (Paystack charges 1.5% + ₦100)
  calculateFees(amount) {
    const percentage = 0.015; // 1.5%
    const fixedFee = 100; // ₦100
    return Math.ceil(amount * percentage + fixedFee);
  }

  // Retry failed payment
  async retryPayment(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found'
        };
      }

      if (payment.status !== 'failed') {
        return {
          success: false,
          error: 'Payment cannot be retried (not failed)'
        };
      }

      // Generate new reference
      const newReference = `GROUP_${Date.now()}_${payment.userId}`;
      payment.reference = newReference;
      payment.status = 'pending';
      payment.updatedAt = new Date();
      await payment.save();

      // Reinitialize payment with Paystack
      const groupData = {
        name: payment.metadata.groupName,
        targetAmount: payment.metadata.groupTarget,
        durationMonths: payment.metadata.durationMonths || 1,
        description: payment.metadata.description,
        userEmail: payment.metadata.customerEmail,
        userName: payment.metadata.customerName
      };

      return await this.initializeGroupPayment(payment.userId, groupData);
    } catch (error) {
      console.error('Payment retry failed:', error);
      return {
        success: false,
        error: 'Payment retry failed'
      };
    }
  }

  // Get payment analytics
  async getPaymentAnalytics(startDate, endDate) {
    try {
      const matchStage = {};
      
      if (startDate && endDate) {
        matchStage.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const analytics = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              status: '$status'
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Failed to get payment analytics:', error);
      return {
        success: false,
        error: 'Failed to get payment analytics'
      };
    }
  }
}

module.exports = new PaymentService(); 