# 🚀 LoopFund Payment Integration Guide

## Overview
This guide covers the complete payment integration system for LoopFund, built with Paystack for secure payment processing in Nigeria.

## 🏗️ Architecture

### Backend Components
- **Payment Service** (`backend/src/services/payment.service.js`) - Core payment logic
- **Payment Model** (`backend/src/models/Payment.js`) - Database schema
- **Payment Routes** (`backend/src/routes/payment.route.js`) - API endpoints
- **Paystack Config** (`backend/src/config/paystack.js`) - Configuration management

### Frontend Components
- **PaymentModal** (`frontend/src/components/payment/PaymentModal.jsx`) - Payment initiation
- **FeeCalculator** (`frontend/src/components/payment/FeeCalculator.jsx`) - Dynamic fee calculation
- **PaymentStatusChecker** (`frontend/src/components/payment/PaymentStatusChecker.jsx`) - Status monitoring
- **PaymentVerificationPage** (`frontend/src/pages/PaymentVerificationPage.jsx`) - Payment verification

## 💳 Payment Flow

### 1. Group Creation with Payment
```
User → Create Group Form → Fee Calculation → Payment Modal → Paystack → Verification → Group Created
```

### 2. Dynamic Fee Structure
- **Base Fee**: 2% of target amount
- **Duration Multiplier**: 
  - 3 months: +0.5%
  - 6 months: +1%
  - 12 months: +1.5%
  - 24 months: +2%
- **Constraints**: Minimum ₦500, Maximum ₦10,000

### 3. Payment Process
1. User fills group creation form
2. System calculates dynamic fee
3. Payment is initialized with Paystack
4. User redirected to Paystack payment page
5. After payment, user returns to verification page
6. System verifies payment and creates group
7. Webhook processes payment confirmation

## 🔧 Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory:

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here

# Other required variables
MONGODB_URI=mongodb://localhost:27017/loopfund
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### 2. Paystack Dashboard Setup
1. Log into your Paystack dashboard
2. Go to Settings → API Keys & Webhooks
3. Copy your test/live keys
4. Set webhook URL: `https://yourdomain.com/api/payments/webhook`
5. Select events: `charge.success`, `charge.failed`

### 3. Database Setup
The system automatically creates the Payment collection with proper indexes:
- `userId` + `status` for user payment queries
- `reference` for payment lookup
- `metadata.groupId` for group association

## 📱 API Endpoints

### Payment Initialization
```http
POST /api/payments/initialize
Authorization: Bearer <token>
Content-Type: application/json

{
  "groupName": "Vacation Fund 2024",
  "targetAmount": 50000,
  "durationMonths": 6,
  "description": "Saving for summer vacation",
  "userEmail": "user@example.com"
}
```

### Payment Verification
```http
GET /api/payments/verify/:reference
```

### Payment Status
```http
GET /api/payments/status/:reference
Authorization: Bearer <token>
```

### Fee Calculation
```http
POST /api/payments/calculate-fee
Content-Type: application/json

{
  "targetAmount": 50000,
  "durationMonths": 6
}
```

### Webhook
```http
POST /api/payments/webhook
X-Paystack-Signature: <signature>
Content-Type: application/json
```

## 🔒 Security Features

### 1. Webhook Signature Verification
```javascript
// TODO: Implement in payment service
const isValidSignature = paymentService.verifyWebhookSignature(req.body, signature);
if (!isValidSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### 2. Payment Reference Validation
- Unique reference generation: `GROUP_${timestamp}_${userId}`
- Database validation before processing
- User ownership verification

### 3. Amount Validation
- Server-side fee calculation
- Minimum/maximum constraints
- Currency validation (NGN only)

## 🧪 Testing

### 1. Test Cards (Paystack Test Mode)
- **Visa**: 4084 0840 8408 4081
- **Mastercard**: 5043 8500 0000 0008
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **PIN**: Any 4 digits

### 2. Test Scenarios
```bash
# Test fee calculation
curl -X POST http://localhost:4000/api/payments/calculate-fee \
  -H "Content-Type: application/json" \
  -d '{"targetAmount": 50000, "durationMonths": 6}'

# Test payment initialization (requires auth)
curl -X POST http://localhost:4000/api/payments/initialize \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"groupName": "Test Group", "targetAmount": 10000}'
```

## 🚨 Error Handling

### Common Error Scenarios
1. **Payment Initialization Failed**
   - Check Paystack keys
   - Verify network connectivity
   - Check request payload

2. **Payment Verification Failed**
   - Verify payment reference exists
   - Check Paystack transaction status
   - Validate webhook processing

3. **Group Creation Failed**
   - Check database connectivity
   - Verify user permissions
   - Check group data validation

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 📊 Monitoring & Analytics

### 1. Payment Metrics
- Total revenue by period
- Payment success/failure rates
- Fee breakdown by group size
- User payment patterns

### 2. Logging
```javascript
// Payment events are logged with emojis for easy identification
console.log('📨 Received webhook event:', event.event);
console.log('✅ Webhook processed successfully for:', reference);
console.log('❌ Webhook verification failed for:', reference, error);
```

## 🔄 Webhook Processing

### 1. Event Types
- `charge.success` - Payment successful
- `charge.failed` - Payment failed
- `transfer.success` - Transfer successful
- `transfer.failed` - Transfer failed

### 2. Processing Flow
```javascript
// 1. Receive webhook
// 2. Verify signature (TODO)
// 3. Process event
// 4. Update payment status
// 5. Create group (if applicable)
// 6. Send confirmation
// 7. Update analytics
```

## 🚀 Production Deployment

### 1. Environment Setup
- Use live Paystack keys
- Set proper webhook URLs
- Configure SSL certificates
- Set up monitoring

### 2. Security Checklist
- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] Error logging configured
- [ ] Database backups scheduled

### 3. Monitoring
- Payment success rates
- Webhook delivery status
- Database performance
- API response times

## 🆘 Support & Troubleshooting

### 1. Common Issues
- **Payment not processing**: Check Paystack dashboard for transaction status
- **Webhook not received**: Verify webhook URL and network configuration
- **Group not created**: Check payment verification logs and database

### 2. Debug Mode
Enable debug logging in development:
```javascript
// In payment service
console.log('🔍 Debug: Payment data:', paymentData);
console.log('🔍 Debug: Paystack response:', response.data);
```

### 3. Contact Information
- **Paystack Support**: support@paystack.com
- **Technical Issues**: Check application logs
- **Business Questions**: Contact LoopFund team

## 📈 Future Enhancements

### 1. Planned Features
- [ ] Multiple payment methods (cards, bank transfer, USSD)
- [ ] Recurring payments for premium features
- [ ] Payment installment plans
- [ ] Advanced analytics dashboard
- [ ] Automated refund processing

### 2. Integration Opportunities
- [ ] SMS notifications
- [ ] Email confirmations
- [ ] Mobile money integration
- [ ] International payment support

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: LoopFund Development Team 