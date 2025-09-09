const { validationResult } = require('express-validator');
const { body, param, query } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Common validation rules
const commonValidations = {
  // User validations
  validateUserSignup: [
    body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
    validateRequest
  ],

  validateUserLogin: [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
  ],

  validateUserUpdate: [
    body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
    body('preferences.currency').optional().isIn(['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES']).withMessage('Invalid currency'),
    body('preferences.timezone').optional().isString().withMessage('Invalid timezone'),
    validateRequest
  ],

  // Goal validations
  validateGoalCreation: [
    body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Goal name must be between 3 and 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('targetAmount').isFloat({ min: 0.01 }).withMessage('Target amount must be greater than 0'),
    body('endDate').isISO8601().withMessage('Please provide a valid end date')
      .custom((value) => {
        const endDate = new Date(value);
        const now = new Date();
        if (endDate <= now) {
          throw new Error('End date must be in the future');
        }
        return true;
      }),
    body('contributionSchedule.frequency').isIn(['daily', 'weekly', 'monthly', 'custom']).withMessage('Invalid contribution frequency'),
    body('contributionSchedule.amount').isFloat({ min: 0.01 }).withMessage('Contribution amount must be greater than 0'),
    body('category').optional().isIn(['personal', 'business', 'education', 'travel', 'emergency', 'other']).withMessage('Invalid category'),
    body('isGroupGoal').optional().isBoolean().withMessage('isGroupGoal must be a boolean'),
    validateRequest
  ],

  validateGoalUpdate: [
    body('name').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Goal name must be between 3 and 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('targetAmount').optional().isFloat({ min: 0.01 }).withMessage('Target amount must be greater than 0'),
    body('endDate').optional().isISO8601().withMessage('Please provide a valid end date')
      .custom((value) => {
        const endDate = new Date(value);
        const now = new Date();
        if (endDate <= now) {
          throw new Error('End date must be in the future');
        }
        return true;
      }),
    body('status').optional().isIn(['active', 'paused', 'completed', 'cancelled']).withMessage('Invalid status'),
    validateRequest
  ],

  // Group validations
  validateGroupCreation: [
    body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Group name must be between 3 and 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('targetAmount').optional().isFloat({ min: 0.01 }).withMessage('Target amount must be greater than 0'),
    body('endDate').optional().isISO8601().withMessage('Please provide a valid end date'),
    body('category').optional().isIn(['family', 'friends', 'business', 'community', 'other']).withMessage('Invalid category'),
    body('settings.maxMembers').optional().isInt({ min: 2, max: 100 }).withMessage('Max members must be between 2 and 100'),
    validateRequest
  ],

  // Contribution validations
  validateContributionCreation: [
    body('goalId').isMongoId().withMessage('Please provide a valid goal ID'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Contribution amount must be greater than 0'),
    body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES']).withMessage('Invalid currency'),
    body('paymentMethod').optional().isIn(['bank_transfer', 'card', 'mobile_money', 'crypto', 'manual']).withMessage('Invalid payment method'),
    body('notes').optional().trim().isLength({ max: 200 }).withMessage('Notes must not exceed 200 characters'),
    validateRequest
  ],

  // Notification validations
  validateNotificationPreferences: [
    body('notificationPreferences.email').optional().isBoolean().withMessage('Email preference must be a boolean'),
    body('notificationPreferences.sms').optional().isBoolean().withMessage('SMS preference must be a boolean'),
    body('notificationPreferences.push').optional().isBoolean().withMessage('Push preference must be a boolean'),
    body('notificationPreferences.reminderFrequency').optional().isIn(['immediate', 'daily', 'weekly']).withMessage('Invalid reminder frequency'),
    validateRequest
  ],

  // ID validations
  validateMongoId: (paramName) => [
    param(paramName).isMongoId().withMessage(`Please provide a valid ${paramName}`),
    validateRequest
  ],

  // Pagination validations
  validatePagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortBy').optional().isString().withMessage('Sort by must be a string'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    validateRequest
  ]
};

module.exports = { validateRequest, commonValidations };