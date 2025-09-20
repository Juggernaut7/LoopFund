const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Group = require('../models/Group');
const User = require('../models/User');
const paystackConfig = require('../config/paystack');
const notificationService = require('./notification.service');
const transactionService = require('./transaction.service');

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

  // Calculate fee for goal creation (2.5% with min/max limits)
  calculateGoalFee(targetAmount) {
    const baseFee = targetAmount * 0.025; // 2.5% fee
    const minFee = 500; // Minimum ₦500
    const maxFee = 10000; // Maximum ₦10,000
    return Math.max(minFee, Math.min(maxFee, baseFee));
  }

  // Calculate contribution processing fee (1% with min/max limits)
  calculateContributionFee(contributionAmount) {
    const baseFee = contributionAmount * 0.01; // 1% fee for contributions
    const minFee = 50; // Minimum ₦50
    const maxFee = 500; // Maximum ₦500
    return Math.max(minFee, Math.min(maxFee, baseFee));
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
        amount: Math.round(feeCalculation.totalFee * 100), // Convert to kobo for Paystack and round to integer
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
          accountInfo: groupData.accountInfo,
          feeBreakdown: feeCalculation
        }
      });

      await payment.save();
      
      const paymentData = {
        amount: Math.round(feeCalculation.totalFee * 100), // Convert to kobo for Paystack and round to integer
        email: groupData.userEmail || groupData.userName || 'user@example.com',
        reference: payment.reference,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/verify/${payment.reference}`,
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

  // Initialize payment for goal creation
  async initializeGoalPayment(userId, goalData) {
    try {
      console.log('Goal payment data received:', goalData);
      console.log('UserId received:', userId, typeof userId);
      
      // Ensure targetAmount is a number
      const targetAmount = parseFloat(goalData.targetAmount);
      console.log('Parsed target amount:', targetAmount);
      
      if (isNaN(targetAmount)) {
        return {
          success: false,
          error: 'Invalid target amount provided'
        };
      }

      // Calculate fee for goal creation
      const fee = this.calculateGoalFee(targetAmount);
      console.log('Calculated fee:', fee);

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

      // Create payment record in database
      const payment = new Payment({
        userId: userId,
        reference: `GOAL_${Date.now()}_${userId}`,
        amount: Math.round(fee * 100), // Convert to kobo for Paystack and round to integer
        currency: this.currency,
        type: 'goal_creation',
        status: 'pending',
        metadata: {
          goalName: goalData.name,
          goalTarget: targetAmount,
          description: goalData.description,
          category: goalData.category,
          endDate: goalData.endDate,
          frequency: goalData.frequency,
          amount: goalData.amount,
          fee: fee
        }
      });

      await payment.save();
      
      // Get user email from database
      const user = await User.findById(userId);
      const userEmail = user?.email || 'user@example.com';
      
      const paymentData = {
        amount: Math.round(fee * 100), // Convert to kobo for Paystack and round to integer
        email: userEmail,
        reference: payment.reference,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/verify/${payment.reference}`,
        metadata: {
          userId,
          goalName: goalData.name,
          goalTarget: targetAmount,
          category: goalData.category,
          endDate: goalData.endDate,
          frequency: goalData.frequency,
          amount: goalData.amount,
          fee: fee,
          type: 'goal_creation',
          paymentId: payment._id
        }
      };

      // Initialize payment with Paystack
      const paystackResponse = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (paystackResponse.data.status) {
        return {
          success: true,
          data: {
            reference: payment.reference,
            authorizationUrl: paystackResponse.data.data.authorization_url,
            accessCode: paystackResponse.data.data.access_code,
            fee: fee,
            goalData: goalData
          }
        };
      } else {
        return {
          success: false,
          error: 'Failed to initialize payment with Paystack'
        };
      }
    } catch (error) {
      console.error('Goal payment initialization error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed'
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
            // Check if group already exists for this payment
            if (payment.metadata.groupId) {
              const existingGroup = await Group.findById(payment.metadata.groupId);
              if (existingGroup) {
                console.log('Group already exists for this payment:', payment.metadata.groupId);
                return {
                  success: true,
                  data: {
                    status: transaction.status,
                    amount: transaction.amount,
                    reference: transaction.reference,
                    metadata: transaction.metadata,
                    customer: transaction.customer,
                    paidAt: transaction.paid_at,
                    groupId: existingGroup._id,
                    groupName: existingGroup.name
                  }
                };
              }
            }

            // Check if a group with the same name already exists for this user
            const existingGroupByName = await Group.findOne({
              name: payment.metadata.groupName,
              createdBy: payment.userId
            });
            
            if (existingGroupByName) {
              console.log('Group with same name already exists for this user:', payment.metadata.groupName);
              return {
                success: true,
                data: {
                  status: transaction.status,
                  amount: transaction.amount,
                  reference: transaction.reference,
                  metadata: transaction.metadata,
                  customer: transaction.customer,
                  paidAt: transaction.paid_at,
                  groupId: existingGroupByName._id,
                  groupName: existingGroupByName.name
                }
              };
            }

            const durationMonths = payment.metadata.durationMonths || 1;
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + durationMonths);

            const group = new Group({
              name: payment.metadata.groupName,
              description: payment.metadata.description || '',
              targetAmount: payment.metadata.groupTarget,
              durationMonths: durationMonths,
              createdBy: payment.userId,
              accountInfo: payment.metadata.accountInfo || {},
              members: [{
                user: payment.userId,
                role: 'owner',
                joinedAt: new Date(),
                isActive: true,
                totalContributed: 0
              }],
              settings: {
                isPublic: false,
                allowInvites: true,
                requireApproval: false,
                maxMembers: 10
              },
              startDate: new Date(),
              endDate: endDate
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

        // Create goal if this is a goal creation payment
        if (payment.type === 'goal_creation' && payment.metadata.goalName) {
          try {
            console.log('Creating goal for payment:', payment.reference);
            console.log('Goal metadata:', payment.metadata);
            
            const Goal = require('../models/Goal');
            const goal = new Goal({
              user: payment.userId,
              name: payment.metadata.goalName,
              description: payment.metadata.description || '',
              targetAmount: payment.metadata.goalTarget,
              currentAmount: payment.metadata.amount || 0,
              deadline: new Date(payment.metadata.endDate),
              category: payment.metadata.category || 'personal',
              type: 'individual',
              isActive: true
            });

            await goal.save();
            console.log('Goal created successfully:', goal._id);
            
            // Update payment with goal ID
            payment.metadata.goalId = goal._id;
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
                goalId: goal._id,
                goalName: goal.name
              }
            };
          } catch (goalError) {
            console.error('Failed to create goal after payment:', goalError);
            // Payment was successful but goal creation failed
            return {
              success: true,
              data: {
                status: transaction.status,
                amount: transaction.amount,
                reference: transaction.reference,
                metadata: transaction.metadata,
                customer: transaction.customer,
                paidAt: transaction.paid_at,
                warning: 'Payment successful but goal creation failed. Please contact support.'
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

  // Initialize payment for group contribution
  async initializeContributionPayment(userId, groupId, contributionData) {
    try {
      const { amount, description = '' } = contributionData;
      const contributionAmount = parseFloat(amount);
      
      // Validate minimum amount
      if (contributionAmount < 100) {
        return {
          success: false,
          error: 'Minimum contribution amount is ₦100'
        };
      }

      // Get group details
      const group = await Group.findById(groupId);
      if (!group) {
        return {
          success: false,
          error: 'Group not found'
        };
      }

      // Check if user is a member of the group
      const isMember = group.members.some(member => 
        member.user.toString() === userId.toString()
      );
      
      if (!isMember) {
        return {
          success: false,
          error: 'You must be a member of this group to contribute'
        };
      }

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Calculate processing fee
      const processingFee = this.calculateContributionFee(contributionAmount);
      const totalAmount = contributionAmount + processingFee;

      // Generate unique reference
      const reference = `CONTRIB_${Date.now()}_${userId}_${groupId}`;

      // Create payment record
      const payment = new Payment({
        userId,
        reference,
        amount: totalAmount * 100, // Convert to kobo
        currency: this.currency,
        status: 'pending',
        type: 'group_contribution',
        metadata: {
          groupId,
          groupName: group.name,
          contributionAmount,
          processingFee,
          description,
          customerEmail: user.email,
          customerName: user.name || user.email
        }
      });

      console.log('🔍 Payment initialization debug:', {
        reference: payment.reference,
        contributionAmount: contributionAmount,
        totalAmount: totalAmount,
        metadata: payment.metadata
      });

      await payment.save();

      // Initialize Paystack payment
      const paystackData = {
        email: user.email,
        amount: totalAmount * 100, // Convert to kobo
        reference,
        currency: this.currency,
        channels: paystackConfig.channels,
        metadata: {
          custom_fields: [
            {
              display_name: 'Group Name',
              variable_name: 'group_name',
              value: group.name
            },
            {
              display_name: 'Contribution Amount',
              variable_name: 'contribution_amount',
              value: contributionAmount
            }
          ]
        },
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/groups/${groupId}?payment=success`,
        redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/groups/${groupId}?payment=success`
      };

      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        paystackData,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
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
            reference,
            accessCode: response.data.data.access_code,
            amount: totalAmount,
            contributionAmount,
            processingFee,
            currency: this.currency,
            paymentId: payment._id
          }
        };
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Failed to initialize contribution payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to initialize payment'
      };
    }
  }

  // Verify contribution payment and update group
  async verifyContributionPayment(reference) {
    try {
      // Get payment from database
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found'
        };
      }

      if (payment.status === 'successful') {
        return {
          success: true,
          data: {
            status: 'success',
            amount: payment.amount / 100,
            reference: payment.reference,
            groupId: payment.metadata.groupId,
            contributionAmount: payment.metadata.contributionAmount
          }
        };
      }

      // Verify with Paystack
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      if (response.data.status && response.data.data.status === 'success') {
        // Update payment status
        payment.status = 'successful';
        payment.paystackData.paidAt = new Date(response.data.data.paid_at);
        payment.paystackData.channel = response.data.data.channel;
        payment.paystackData.ipAddress = response.data.data.ip_address;
        payment.paystackData.fees = response.data.data.fees;
        await payment.save();

        // Get contribution amount from metadata or calculate from payment amount
        let contributionAmount = payment.metadata.contributionAmount;
        
        // If contributionAmount is not available in metadata, calculate it
        if (!contributionAmount || isNaN(contributionAmount)) {
          // For group contributions, the payment amount includes processing fee
          // We need to subtract the processing fee to get the actual contribution amount
          const processingFee = payment.metadata.processingFee || 0;
          contributionAmount = (payment.amount / 100) - processingFee;
        }
        
        // Ensure contributionAmount is a valid number
        contributionAmount = parseFloat(contributionAmount) || 0;
        
        console.log('🔍 Contribution amount calculation:', {
          metadataContributionAmount: payment.metadata.contributionAmount,
          processingFee: payment.metadata.processingFee,
          paymentAmount: payment.amount,
          finalContributionAmount: contributionAmount
        });

        // Update group with contribution
        const group = await Group.findById(payment.metadata.groupId);
        if (group) {
          
          console.log('🔍 Payment verification debug:', {
            paymentId: payment._id,
            metadata: payment.metadata,
            contributionAmount: contributionAmount,
            paymentAmount: payment.amount,
            groupId: payment.metadata.groupId
          });
          
          // Add contribution to group
          const contribution = {
            userId: payment.userId,
            amount: parseFloat(contributionAmount) || 0,
            description: payment.metadata.description || 'Group contribution',
            paymentId: payment._id,
            paidAt: new Date(),
            status: 'completed'
          };
          
          console.log('🔍 Contribution object:', contribution);

          if (!group.contributions) {
            group.contributions = [];
          }
          group.contributions.push(contribution);

          // Update current amount - ensure it's a valid number
          const currentAmount = parseFloat(group.currentAmount) || 0;
          const newAmount = parseFloat(contributionAmount) || 0;
          const updatedAmount = currentAmount + newAmount;
          
          // Ensure the result is a valid number
          group.currentAmount = isNaN(updatedAmount) ? currentAmount : updatedAmount;
          
          console.log('🔍 Amount calculation:', {
            currentAmount: currentAmount,
            newAmount: newAmount,
            updatedAmount: updatedAmount,
            finalAmount: group.currentAmount
          });
          
          await group.save();

          // Send notifications
          try {
            // Notify the contributor about successful payment
            await notificationService.notifyPaymentSuccess(
              payment.userId,
              contributionAmount,
              'group contribution',
              group.name
            );

            // Notify all group members about the new contribution
            await notificationService.notifyGroupContribution(
              groupId,
              payment.userId,
              contributionAmount,
              payment.metadata.description || ''
            );

            // Check if group target is reached
            if (group.currentAmount >= group.targetAmount) {
              await notificationService.notifyGroupTargetReached(groupId);
            }
          } catch (notificationError) {
            console.error('Error sending notifications:', notificationError);
            // Don't fail the payment if notifications fail
          }

          // Create transaction log
          try {
            await transactionService.createTransactionFromPayment(payment);
          } catch (transactionError) {
            console.error('Error creating transaction log:', transactionError);
            // Don't fail the payment if transaction logging fails
          }
        }

        return {
          success: true,
          data: {
            status: 'success',
            amount: payment.amount / 100,
            reference: payment.reference,
            groupId: payment.metadata.groupId,
            contributionAmount: contributionAmount
          }
        };
      } else {
        // Payment failed
        payment.status = 'failed';
        await payment.save();

        return {
          success: false,
          error: 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('Failed to verify contribution payment:', error);
      return {
        success: false,
        error: 'Failed to verify payment'
      };
    }
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

  // Initialize payment for goal contribution
  async initializeGoalContributionPayment(userId, goalId, contributionData) {
    try {
      const { amount: contributionAmount, description } = contributionData;

      // Validate input
      if (!goalId || !contributionAmount || contributionAmount <= 0) {
        return {
          success: false,
          error: 'Invalid contribution data'
        };
      }

      // Get goal details
      const Goal = require('../models/Goal');
      const goal = await Goal.findById(goalId);
      if (!goal) {
        return {
          success: false,
          error: 'Goal not found'
        };
      }

      // Check if user owns the goal
      if (goal.user.toString() !== userId.toString()) {
        return {
          success: false,
          error: 'You can only contribute to your own goals'
        };
      }

      // Get user details
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Calculate processing fee (same as group contributions)
      const processingFee = this.calculateContributionFee(contributionAmount);
      const totalAmount = contributionAmount + processingFee;

      // Generate unique reference
      const reference = `GOAL_CONTRIB_${Date.now()}_${userId}_${goalId}`;

      // Create payment record
      const payment = new Payment({
        userId,
        reference,
        amount: totalAmount * 100, // Convert to kobo
        currency: this.currency,
        status: 'pending',
        type: 'goal_contribution',
        metadata: {
          goalId,
          goalName: goal.name,
          contributionAmount,
          processingFee,
          description,
          customerEmail: user.email,
          customerName: user.name || user.email
        }
      });

      console.log('🔍 Goal contribution payment initialization debug:', {
        reference: payment.reference,
        contributionAmount: contributionAmount,
        processingFee: processingFee,
        totalAmount: totalAmount,
        metadata: payment.metadata
      });

      await payment.save();

      // Initialize Paystack payment
      const paystackData = {
        email: user.email,
        amount: totalAmount * 100, // Convert to kobo
        reference: payment.reference,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/goals?payment=success&reference=${payment.reference}`,
        redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/goals?payment=success&reference=${payment.reference}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Goal Name",
              variable_name: "goal_name",
              value: goal.name
            },
            {
              display_name: "Contribution Amount",
              variable_name: "contribution_amount",
              value: contributionAmount
            }
          ]
        }
      };

      const response = await axios.post(`${this.baseURL}/transaction/initialize`, paystackData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status) {
        // Store Paystack data
        payment.paystackData = {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference
        };
        await payment.save();

        return {
          success: true,
          data: {
            authorizationUrl: response.data.data.authorization_url,
            accessCode: response.data.data.access_code,
            reference: payment.reference,
            amount: totalAmount,
            contributionAmount,
            processingFee
          }
        };
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Failed to initialize goal contribution payment:', error);
      return {
        success: false,
        error: 'Payment initialization failed. Please try again.'
      };
    }
  }

  // Verify goal contribution payment
  async verifyGoalContributionPayment(reference) {
    try {
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found'
        };
      }

      if (payment.status === 'successful') {
        // Payment already verified, but ensure goal is updated
        console.log('🔍 Payment already successful, checking goal update...');
        
        // Get contribution amount from metadata
        let contributionAmount = payment.metadata.contributionAmount;
        if (!contributionAmount || isNaN(contributionAmount)) {
          const processingFee = payment.metadata.processingFee || 0;
          contributionAmount = (payment.amount / 100) - processingFee;
        }
        contributionAmount = parseFloat(contributionAmount) || 0;
        
        // Check if goal needs updating
        const Goal = require('../models/Goal');
        const goal = await Goal.findById(payment.metadata.goalId);
        if (goal) {
          // Check if this contribution is already logged
          const existingContribution = goal.contributions.find(contrib => 
            contrib.paymentId && contrib.paymentId.toString() === payment._id.toString()
          );
          
          if (!existingContribution) {
            console.log('🔍 Adding missing contribution to goal...');
            // Add contribution to the contributions array
            goal.contributions.push({
              userId: payment.userId,
              amount: contributionAmount,
              description: payment.metadata.description || '',
              paymentId: payment._id,
              paidAt: new Date(),
              status: 'completed'
            });
            
            // Update last contribution date
            goal.lastContributionDate = new Date();
            
            await goal.save();
            console.log('✅ Goal updated with missing contribution');
          }
        }
        
        return {
          success: true,
          data: {
            status: 'success',
            amount: payment.amount / 100,
            reference: payment.reference,
            goalId: payment.metadata.goalId,
            contributionAmount: contributionAmount
          }
        };
      }

      // Verify with Paystack
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );

      if (response.data.status && response.data.data.status === 'success') {
        // Update payment status
        payment.status = 'successful';
        payment.paystackData.paidAt = new Date(response.data.data.paid_at);
        payment.paystackData.channel = response.data.data.channel;
        payment.paystackData.ipAddress = response.data.data.ip_address;
        payment.paystackData.fees = response.data.data.fees;
        await payment.save();

        // Get contribution amount from metadata or calculate from payment amount
        let contributionAmount = payment.metadata.contributionAmount;
        
        // If contributionAmount is not available in metadata, calculate it
        if (!contributionAmount || isNaN(contributionAmount)) {
          // For goal contributions, the payment amount includes processing fee
          // We need to subtract the processing fee to get the actual contribution amount
          const processingFee = payment.metadata.processingFee || 0;
          contributionAmount = (payment.amount / 100) - processingFee;
        }
        
        // Ensure contributionAmount is a valid number
        contributionAmount = parseFloat(contributionAmount) || 0;
        
        console.log('🔍 Goal contribution amount calculation:', {
          metadataContributionAmount: payment.metadata.contributionAmount,
          processingFee: payment.metadata.processingFee,
          paymentAmount: payment.amount,
          finalContributionAmount: contributionAmount
        });

        // Update goal with contribution
        const Goal = require('../models/Goal');
        const goal = await Goal.findById(payment.metadata.goalId);
        if (goal) {
          // Update goal's current amount
          const currentAmount = parseFloat(goal.currentAmount) || 0;
          const newAmount = parseFloat(contributionAmount) || 0;
          const updatedAmount = currentAmount + newAmount;
          
          // Ensure the result is a valid number
          goal.currentAmount = isNaN(updatedAmount) ? currentAmount : updatedAmount;
          
          // Add contribution to the contributions array
          goal.contributions.push({
            userId: payment.userId,
            amount: contributionAmount,
            description: payment.metadata.description || '',
            paymentId: payment._id,
            paidAt: new Date(),
            status: 'completed'
          });
          
          // Update last contribution date
          goal.lastContributionDate = new Date();
          
          console.log('🔍 Goal amount calculation:', {
            currentAmount: currentAmount,
            newAmount: newAmount,
            updatedAmount: updatedAmount,
            finalAmount: goal.currentAmount,
            contributionAdded: {
              userId: payment.userId,
              amount: contributionAmount,
              paymentId: payment._id
            }
          });
          
          await goal.save();

          // Send notifications
          try {
            // Notify the contributor about successful payment
            await notificationService.notifyPaymentSuccess(
              payment.userId,
              contributionAmount,
              'goal contribution',
              goal.name
            );

            // Notify about goal contribution
            await notificationService.notifyGoalContribution(
              goalId,
              payment.userId,
              contributionAmount,
              payment.metadata.description || ''
            );

            // Check for milestone achievements
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount * 100) : 0;
            const milestones = [25, 50, 75, 90, 100];
            const reachedMilestone = milestones.find(milestone => 
              progress >= milestone && progress < milestone + 1
            );
            
            if (reachedMilestone) {
              await notificationService.notifyGoalMilestone(
                goalId,
                reachedMilestone,
                payment.userId
              );
            }
          } catch (notificationError) {
            console.error('Error sending goal notifications:', notificationError);
            // Don't fail the payment if notifications fail
          }

          // Create transaction log
          try {
            await transactionService.createTransactionFromPayment(payment);
          } catch (transactionError) {
            console.error('Error creating transaction log:', transactionError);
            // Don't fail the payment if transaction logging fails
          }
        }

        return {
          success: true,
          data: {
            status: 'success',
            amount: payment.amount / 100,
            reference: payment.reference,
            goalId: payment.metadata.goalId,
            contributionAmount: contributionAmount
          }
        };
      } else {
        // Payment failed
        payment.status = 'failed';
        await payment.save();

        return {
          success: false,
          error: 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('Failed to verify goal contribution payment:', error);
      return {
        success: false,
        error: 'Failed to verify payment'
      };
    }
  }

  // Initialize wallet deposit payment
  async initializeWalletDeposit(userId, depositData) {
    try {
      const { amount, description, reference, userEmail, userName } = depositData;
      
      // Generate unique reference if not provided
      const paymentReference = reference || `WALLET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment record
      const payment = new Payment({
        userId,
        reference: paymentReference,
        amount,
        currency: 'NGN',
        status: 'pending',
        type: 'wallet_deposit',
        metadata: {
          description: description || 'Wallet deposit',
          customerEmail: userEmail,
          customerName: userName,
          amount,
          fee: 0 // No fee for wallet deposits
        }
      });

      await payment.save();

      // Initialize Paystack payment
      const paystackData = {
        email: userEmail,
        amount: amount * 100, // Convert to kobo
        reference: paymentReference,
        currency: 'NGN',
        metadata: {
          paymentId: payment._id,
          type: 'wallet_deposit',
          userId: userId.toString()
        }
      };

      const response = await axios.post(`${this.baseURL}/transaction/initialize`, paystackData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const paystackResponse = response.data;

      if (paystackResponse.status) {
        // Update payment with Paystack data
        payment.paystackData = {
          accessCode: paystackResponse.data.access_code,
          authorizationUrl: paystackResponse.data.authorization_url
        };
        await payment.save();

        return {
          success: true,
          data: {
            reference: paymentReference,
            authorizationUrl: paystackResponse.data.authorization_url,
            accessCode: paystackResponse.data.access_code,
            amount,
            currency: 'NGN'
          }
        };
      } else {
        throw new Error(paystackResponse.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Initialize wallet deposit error:', error);
      throw error;
    }
  }

  // Verify wallet deposit payment
  async verifyWalletDeposit(reference) {
    try {
      // Find payment record
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status === 'successful') {
        return {
          success: true,
          data: {
            payment,
            message: 'Payment already verified'
          }
        };
      }

      // Verify with Paystack
      const verificationResponse = await axios.get(`${this.baseURL}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      const verificationResult = verificationResponse.data;
      
      if (verificationResult.status && verificationResult.data.status === 'success') {
        // Update payment status
        payment.status = 'successful';
        payment.paystackData.paidAt = new Date(verificationResult.data.paid_at);
        payment.paystackData.channel = verificationResult.data.channel;
        payment.paystackData.ipAddress = verificationResult.data.ip_address;
        payment.paystackData.fees = verificationResult.data.fees;
        await payment.save();

        // Add money to user's wallet
        const Wallet = require('../models/Wallet');
        let wallet = await Wallet.findOne({ user: payment.userId });
        
        console.log('🔍 Current wallet before update:', wallet);
        
        if (!wallet) {
          wallet = new Wallet({ user: payment.userId, balance: 0 });
          console.log('🆕 Created new wallet for user:', payment.userId);
        }

        // Add to wallet balance
        const oldBalance = wallet.balance;
        wallet.balance += payment.amount;
        console.log(`💰 Wallet balance: ${oldBalance} + ${payment.amount} = ${wallet.balance}`);
        
        // Add transaction record
        wallet.transactions.push({
          type: 'deposit',
          amount: payment.amount,
          description: payment.metadata.description || 'Wallet deposit',
          reference: payment.reference,
          status: 'completed'
        });

        await wallet.save();
        console.log('✅ Wallet saved successfully:', wallet);

        // Send success notification
        try {
          await notificationService.notifyPaymentSuccess(
            payment.userId,
            payment.amount,
            'wallet deposit',
            'Wallet'
          );
        } catch (notificationError) {
          console.error('Notification error:', notificationError);
        }

        return {
          success: true,
          data: {
            payment,
            wallet,
            message: 'Wallet deposit successful'
          }
        };
      } else {
        // Payment failed
        payment.status = 'failed';
        await payment.save();
        
        throw new Error(verificationResult.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verify wallet deposit error:', error);
      throw error;
    }
  }

}

module.exports = new PaymentService(); 