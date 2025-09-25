const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Initialize wallet funding payment
router.post('/initialize-wallet-funding', requireAuth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { amount, description } = req.body;
    const userId = req.user.userId;

    const result = await paymentService.initializeWalletFunding(
      userId, 
      parseFloat(amount), 
      description || 'Wallet funding'
    );

    res.json(result);
  } catch (error) {
    console.error('Wallet funding initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize wallet funding'
    });
  }
});

// Initialize payment for goal creation
router.post('/initialize-goal', requireAuth, [
  body('goalName').notEmpty().withMessage('Goal name is required'),
  body('targetAmount').isNumeric().withMessage('Target amount must be a number'),
  body('description').optional().isString(),
  body('category').optional().isString(),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('frequency').optional().isString(),
  body('amount').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { goalName, targetAmount, description, category, endDate, frequency, amount } = req.body;
    const userId = req.user.userId;

    console.log('Route received data:', req.body);
    console.log('Req.user object:', req.user);
    console.log('UserId from req.user.userId:', userId, typeof userId);
    console.log('Parsed targetAmount:', parseFloat(targetAmount));

    const goalData = {
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      description,
      category: category || 'personal',
      endDate,
      frequency: frequency || 'monthly',
      amount: parseFloat(amount) || 0
    };

    console.log('Goal data being passed to service:', goalData);

    const paymentResult = await paymentService.initializeGoalPayment(userId, goalData);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }

    res.json({
      success: true,
      message: 'Goal payment initialized successfully',
      data: paymentResult.data
    });
  } catch (error) {
    console.error('Goal payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Calculate fee for goal creation
router.post('/calculate-goal-fee', requireAuth, [
  body('targetAmount').isNumeric().withMessage('Target amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { targetAmount } = req.body;
    const fee = paymentService.calculateGoalFee(parseFloat(targetAmount));

    res.json({
      success: true,
      data: {
        targetAmount: parseFloat(targetAmount),
        fee: fee,
        percentage: 2.5
      }
    });
  } catch (error) {
    console.error('Goal fee calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Initialize payment for group creation
router.post('/initialize', requireAuth, [
  body('groupName').notEmpty().withMessage('Group name is required'),
  body('targetAmount').isNumeric().withMessage('Target amount must be a number'),
  body('durationMonths').optional().isNumeric().withMessage('Duration must be a number'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { groupName, targetAmount, description, durationMonths = 1 } = req.body;
    const userId = req.user.userId;

    // Get user email from request or user object
    const userEmail = req.body.userEmail || req.user.email;

    const groupData = {
      name: groupName,
      targetAmount: parseFloat(targetAmount),
      durationMonths: parseInt(durationMonths),
      description,
      userEmail,
      userName: req.user.name || req.user.email || userEmail
    };

    const paymentResult = await paymentService.initializeGroupPayment(userId, groupData);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }

    res.json({
      success: true,
      message: 'Payment initialized successfully',
      data: paymentResult.data
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    console.log('🔍 Payment verification request for reference:', reference);
    console.log('🔍 Request headers:', req.headers);
    
    if (!reference) {
      console.log('❌ No reference provided');
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    // Debug: List recent payments to see what's in the database
    console.log('🔍 Checking recent payments in database...');
    const recentPayments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('reference paystackData.paystackReference type status amount createdAt');
    console.log('📊 Recent payments:', recentPayments);

    console.log('🔍 Calling paymentService.verifyPayment...');
    const verificationResult = await paymentService.verifyPayment(reference);
    console.log('📊 Verification result:', verificationResult);

    if (!verificationResult.success) {
      console.log('❌ Verification failed:', verificationResult.error);
      return res.status(400).json({
        success: false,
        message: verificationResult.error
      });
    }

    console.log('✅ Verification successful');
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: verificationResult.data
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment details from Paystack
router.get('/details/:reference', requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    const paymentDetails = await paymentService.getPaymentDetails(reference);

    if (!paymentDetails.success) {
      return res.status(400).json({
        success: false,
        message: paymentDetails.error
      });
    }

    res.json({
      success: true,
      data: paymentDetails.data
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment details from our database
router.get('/status/:reference', requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    const paymentResult = await paymentService.getPaymentByReference(reference);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error
      });
    }

    res.json({
      success: true,
      data: paymentResult.data
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Calculate fee for group creation
router.post('/calculate-fee', [
  body('targetAmount').isNumeric().withMessage('Target amount must be a number'),
  body('durationMonths').optional().isNumeric().withMessage('Duration must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { targetAmount, durationMonths = 1 } = req.body;
    
    // Validate input
    if (targetAmount < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Minimum target amount is ₦1,000'
      });
    }

    if (targetAmount > 10000000) {
      return res.status(400).json({
        success: false,
        message: 'Maximum target amount is ₦10,000,000'
      });
    }

    const feeCalculation = paymentService.calculateGroupCreationFee(
      parseFloat(targetAmount), 
      parseInt(durationMonths)
    );

    res.json({
      success: true,
      data: feeCalculation
    });

  } catch (error) {
    console.error('Fee calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fee structure and pricing information
router.get('/fee-structure', (req, res) => {
  try {
    const feeStructure = {
      basePercentage: 2.0, // 2% base fee
      durationMultipliers: {
        1: { months: 1, percentage: 0.2, description: 'Very Short-term (1 month)' },
        3: { months: 3, percentage: 0.5, description: 'Short-term (3 months)' },
        6: { months: 6, percentage: 1.0, description: 'Medium-term (6 months)' },
        12: { months: 12, percentage: 1.5, description: 'Long-term (12 months)' },
        24: { months: 24, percentage: 2.0, description: 'Extended-term (24 months)' }
      },
      minAmount: 1000,
      maxAmount: 10000000,
      minFee: 500,
      maxFee: 10000,
      currency: 'NGN',
      examples: [
        {
          targetAmount: 25000,
          durationMonths: 1,
          baseFee: 500,
          durationFee: 50,
          totalFee: 550,
          percentage: 2.2
        },
        {
          targetAmount: 50000,
          durationMonths: 1,
          baseFee: 1000,
          durationFee: 500,
          totalFee: 1500,
          percentage: 3.0
        },
        {
          targetAmount: 100000,
          durationMonths: 12,
          baseFee: 2000,
          durationFee: 1500,
          totalFee: 3500,
          percentage: 3.5
        },
        {
          targetAmount: 500000,
          durationMonths: 24,
          baseFee: 10000,
          durationFee: 10000,
          totalFee: 10000, // Capped at max fee
          percentage: 2.0
        }
      ]
    };

    res.json({
      success: true,
      data: feeStructure
    });
  } catch (error) {
    console.error('Get fee structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Paystack public key
router.get('/public-key', (req, res) => {
  try {
    const publicKey = paymentService.getPublicKey();
    res.json({
      success: true,
      data: { publicKey }
    });
  } catch (error) {
    console.error('Get public key error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment statistics (admin only)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // Check if user is admin (you can add admin check middleware here)
    const stats = await Payment.getPaymentStats();
    const recentPayments = await Payment.getRecentPayments(5);
    
    res.json({
      success: true,
      data: {
        stats,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's payment history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .select('reference amount status type createdAt metadata');
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Retry failed payment
router.post('/retry/:paymentId', requireAuth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.userId;
    
    // Verify payment belongs to user
    const payment = await Payment.findOne({ _id: paymentId, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const retryResult = await paymentService.retryPayment(paymentId);
    
    if (!retryResult.success) {
      return res.status(400).json({
        success: false,
        message: retryResult.error
      });
    }
    
    res.json({
      success: true,
      message: 'Payment retry initiated successfully',
      data: retryResult.data
    });
    
  } catch (error) {
    console.error('Payment retry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment analytics (admin only)
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const analyticsResult = await paymentService.getPaymentAnalytics(startDate, endDate);
    
    if (!analyticsResult.success) {
      return res.status(400).json({
        success: false,
        message: analyticsResult.error
      });
    }
    
    res.json({
      success: true,
      data: analyticsResult.data
    });
    
  } catch (error) {
    console.error('Get payment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Initialize contribution payment
router.post('/initialize-contribution', requireAuth, [
  body('groupId').isMongoId().withMessage('Valid group ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { groupId, amount, description } = req.body;
    const userId = req.user.userId;

    const paymentResult = await paymentService.initializeContributionPayment(userId, groupId, {
      amount,
      description
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: paymentResult.error
      });
    }

    res.json({
      success: true,
      data: paymentResult.data
    });
  } catch (error) {
    console.error('Contribution payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify contribution payment
router.get('/verify-contribution/:reference', requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.user.userId;

    // Verify the payment belongs to the user
    const payment = await Payment.findOne({ reference, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    const verificationResult = await paymentService.verifyContributionPayment(reference);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        error: verificationResult.error
      });
    }

    res.json({
      success: true,
      data: verificationResult.data
    });
  } catch (error) {
    console.error('Contribution payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Initialize goal contribution payment
router.post('/initialize-goal-contribution', requireAuth, [
  body('goalId').notEmpty().withMessage('Goal ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().isString().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const userId = req.user.userId;
    const { goalId, amount, description } = req.body;

    const paymentResult = await paymentService.initializeGoalContributionPayment(userId, goalId, {
      amount: parseFloat(amount),
      description: description || ''
    });

    if (paymentResult.success) {
      res.json({
        success: true,
        data: paymentResult.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: paymentResult.error
      });
    }
  } catch (error) {
    console.error('Goal contribution payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify goal contribution payment
router.get('/verify-goal-contribution/:reference', requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.user.userId;

    // Verify the payment belongs to the user
    const payment = await Payment.findOne({ reference, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    const verificationResult = await paymentService.verifyGoalContributionPayment(reference);

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        error: verificationResult.error
      });
    }

    res.json({
      success: true,
      data: verificationResult.data
    });
  } catch (error) {
    console.error('Goal contribution payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Manual payment verification endpoint (for debugging)
router.post('/verify-payment-manual', requireAuth, [
  body('reference').notEmpty().withMessage('Payment reference is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { reference } = req.body;
    const userId = req.user.userId;

    console.log('🔍 Manual verification request for reference:', reference);

    // Check if it's a goal contribution
    if (reference.startsWith('GOAL_CONTRIB_')) {
      const verificationResult = await paymentService.verifyGoalContributionPayment(reference);
      
      if (verificationResult.success) {
        res.json({
          success: true,
          data: verificationResult.data,
          message: 'Goal contribution verified successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: verificationResult.error
        });
      }
    } else if (reference.startsWith('GROUP_CONTRIB_')) {
      const verificationResult = await paymentService.verifyContributionPayment(reference);
      
      if (verificationResult.success) {
        res.json({
          success: true,
          data: verificationResult.data,
          message: 'Group contribution verified successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: verificationResult.error
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'Unknown payment type'
      });
    }
  } catch (error) {
    console.error('Manual payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Webhook endpoint for Paystack
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    
    // Verify webhook signature for security
    const isValidSignature = paymentService.verifyWebhookSignature(req.body, signature);
    if (!isValidSignature) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const event = req.body;
    console.log('📨 Received webhook event:', event.event);
    
    // Process the webhook
    const result = await paymentService.processWebhook(event);
    
    if (result.success) {
      console.log('✅ Webhook processed successfully');
      res.json({ received: true, message: result.message });
    } else {
      console.error('❌ Webhook processing failed:', result.error);
      res.status(400).json({ received: false, error: result.error });
    }
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ received: false, error: error.message });
  }
});

// Initialize wallet deposit payment
router.post('/initialize-wallet-deposit', requireAuth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').optional().isString(),
  body('reference').optional().isString(),
  body('userEmail').isEmail().withMessage('Valid email is required'),
  body('userName').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { amount, description, reference, userEmail, userName } = req.body;
    const userId = req.user.userId;

    const depositData = {
      amount: parseFloat(amount),
      description,
      reference,
      userEmail,
      userName
    };

    const result = await paymentService.initializeWalletDeposit(userId, depositData);

    res.json({
      success: true,
      message: 'Wallet deposit payment initialized successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Wallet deposit initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Verify wallet deposit payment
router.post('/verify-wallet-deposit', requireAuth, [
  body('reference').notEmpty().withMessage('Payment reference is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { reference } = req.body;
    const result = await paymentService.verifyWalletDeposit(reference);

    res.json({
      success: true,
      message: 'Wallet deposit verified successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Wallet deposit verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

module.exports = router; 