# LoopFund Payment Integration Guide

## Overview

This document describes the complete payment integration system for LoopFund, which handles group creation fees through Paystack payment gateway. The system calculates dynamic fees based on target amount and duration, processes payments securely, and automatically creates groups upon successful payment.

## Features

- **Dynamic Fee Calculation**: Fees are calculated based on target amount and duration
- **Secure Payment Processing**: Uses Paystack's secure payment gateway
- **Webhook Integration**: Real-time payment status updates
- **Automatic Group Creation**: Groups are created automatically after successful payment
- **Comprehensive Error Handling**: Robust error handling and validation
- **Payment Retry System**: Failed payments can be retried
- **Analytics & Reporting**: Detailed payment analytics and statistics

## Fee Structure

### Base Fee
- **2%** of target amount (minimum ₦500, maximum ₦10,000)

### Duration Multipliers
- **3 months**: +0.5% additional fee
- **6 months**: +1.0% additional fee  
- **12 months**: +1.5% additional fee
- **24 months**: +2.0% additional fee

### Examples
- Target: ₦50,000, Duration: 6 months
  - Base fee: ₦1,000 (2%)
  - Duration fee: ₦500 (1%)
  - Total fee: ₦1,500 (3%)

- Target: ₦100,000, Duration: 12 months
  - Base fee: ₦2,000 (2%)
  - Duration fee: ₦1,500 (1.5%)
  - Total fee: ₦3,500 (3.5%)

## API Endpoints

### 1. Calculate Fee
```
POST /api/payments/calculate-fee
```
Calculate the fee for group creation without initiating payment.

**Request Body:**
```json
{
  "targetAmount": 50000,
  "durationMonths": 6
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseFee": 1000,
    "durationFee": 500,
    "totalFee": 1500,
    "percentage": "3.0",
    "durationMonths": 6,
    "breakdown": {
      "basePercentage": "2.0",
      "durationPercentage": "1.0",
      "totalPercentage": "3.0"
    }
  }
}
```

### 2. Initialize Payment
```
POST /api/payments/initialize
```
Initialize payment for group creation.

**Request Body:**
```json
{
  "groupName": "My Savings Group",
  "targetAmount": 50000,
  "durationMonths": 6,
  "description": "Group description",
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorizationUrl": "https://checkout.paystack.com/...",
    "reference": "GROUP_1234567890_userId",
    "accessCode": "access_code_here",
    "feeCalculation": { ... },
    "paymentId": "payment_id_here",
    "amount": 1500,
    "currency": "NGN"
  }
}
```

### 3. Verify Payment
```
GET /api/payments/verify/:reference
```
Verify payment status and create group if successful.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "amount": 1500,
    "reference": "GROUP_1234567890_userId",
    "groupId": "group_id_here",
    "groupName": "My Savings Group"
  }
}
```

### 4. Get Fee Structure
```
GET /api/payments/fee-structure
```
Get complete fee structure and examples.

### 5. Get Public Key
```
GET /api/payments/public-key
```
Get Paystack public key for frontend integration.

### 6. Payment History
```
GET /api/payments/history
```
Get user's payment history (requires authentication).

### 7. Payment Statistics
```
GET /api/payments/stats
```
Get payment statistics (requires authentication).

### 8. Retry Payment
```
POST /api/payments/retry/:paymentId
```
Retry a failed payment (requires authentication).

### 9. Payment Analytics
```
GET /api/payments/analytics?startDate=2024-01-01&endDate=2024-12-31
```
Get payment analytics for date range (requires authentication).

## Webhook Integration

### Webhook Endpoint
```
POST /api/payments/webhook
```

### Supported Events
- `charge.success` - Payment successful
- `charge.failed` - Payment failed
- `transfer.success` - Transfer successful
- `transfer.failed` - Transfer failed

### Webhook Security
Webhooks are secured with HMAC-SHA512 signature verification using the `PAYSTACK_WEBHOOK_SECRET` environment variable.

## Environment Variables

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_WEBHOOK_SECRET=whsec_...

# Frontend URL for callbacks
FRONTEND_URL=http://localhost:3000
```

## Database Schema

### Payment Model
```javascript
{
  userId: ObjectId,
  reference: String,
  amount: Number, // Amount in kobo (smallest currency unit)
  currency: String,
  status: String, // 'pending', 'successful', 'failed', 'cancelled'
  type: String, // 'group_creation', 'premium_upgrade', etc.
  metadata: {
    groupName: String,
    groupTarget: Number,
    groupId: ObjectId,
    description: String,
    customerEmail: String,
    customerName: String,
    durationMonths: Number,
    feeBreakdown: Object
  },
  paystackData: {
    accessCode: String,
    authorizationUrl: String,
    customerId: String,
    paidAt: Date,
    channel: String,
    ipAddress: String,
    fees: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Payment Flow

1. **User initiates group creation** with target amount and duration
2. **System calculates fee** based on amount and duration
3. **Payment is initialized** with Paystack
4. **User is redirected** to Paystack payment page
5. **Payment is processed** by Paystack
6. **Webhook notification** is sent to our system
7. **Payment is verified** with Paystack API
8. **Group is created** automatically if payment successful
9. **User is notified** of success/failure

## Error Handling

### Common Errors
- **Invalid amount**: Target amount must be between ₦1,000 and ₦10,000,000
- **Payment initialization failed**: Network or Paystack API issues
- **Invalid webhook signature**: Security verification failed
- **Group creation failed**: Database or validation errors

### Error Responses
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message"
}
```

## Testing

### Run Test Suite
```bash
cd backend
node test-payment-integration.js
```

### Test Individual Functions
```javascript
const { testFeeCalculation, testPaymentInitialization } = require('./test-payment-integration');

// Test fee calculation
await testFeeCalculation();

// Test payment initialization
await testPaymentInitialization();
```

## Security Features

1. **Webhook Signature Verification**: HMAC-SHA512 verification
2. **Input Validation**: Comprehensive request validation
3. **Authentication**: JWT-based authentication for protected endpoints
4. **Rate Limiting**: API rate limiting to prevent abuse
5. **Error Logging**: Secure error logging without exposing sensitive data

## Monitoring & Analytics

### Payment Statistics
- Total payments count
- Successful vs failed payments
- Revenue tracking
- Payment trends over time

### Recent Payments
- Latest payment activities
- Payment status tracking
- User payment history

### Analytics
- Monthly payment trends
- Revenue by payment type
- Success rate analysis

## Troubleshooting

### Common Issues

1. **Webhook not received**
   - Check webhook URL configuration in Paystack dashboard
   - Verify webhook secret is correct
   - Check server logs for errors

2. **Payment verification fails**
   - Verify Paystack secret key is correct
   - Check network connectivity to Paystack API
   - Verify payment reference exists

3. **Group creation fails after payment**
   - Check database connection
   - Verify user permissions
   - Check group validation rules

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG=payment:*
```

## Support

For payment integration issues:
1. Check server logs for detailed error messages
2. Verify Paystack dashboard configuration
3. Test with Paystack test keys first
4. Check environment variables are set correctly

## Future Enhancements

- **Multiple Payment Methods**: Support for cards, bank transfers, USSD
- **Subscription Payments**: Recurring payment support
- **Refund System**: Automated refund processing
- **Payment Plans**: Installment payment options
- **Advanced Analytics**: Real-time dashboard with charts
- **Mobile SDK**: Native mobile payment integration 