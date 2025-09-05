const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:4000/api';
const TEST_USER_TOKEN = 'your-test-token-here'; // Replace with actual test token

// Test data
const testGroupData = {
  groupName: 'Test Savings Group',
  targetAmount: 50000,
  durationMonths: 1,
  description: 'Test group for payment integration',
  userEmail: 'test@example.com'
};

// Test functions
async function testFeeCalculation() {
  console.log('\n🧮 Testing Fee Calculation...');
  
  try {
    const response = await axios.post(`${BASE_URL}/payments/calculate-fee`, {
      targetAmount: testGroupData.targetAmount,
      durationMonths: testGroupData.durationMonths
    });
    
    if (response.data.success) {
      console.log('✅ Fee calculation successful');
      console.log('📊 Fee breakdown:', response.data.data);
    } else {
      console.log('❌ Fee calculation failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Fee calculation error:', error.response?.data || error.message);
  }
}

async function testFeeStructure() {
  console.log('\n📋 Testing Fee Structure...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/fee-structure`);
    
    if (response.data.success) {
      console.log('✅ Fee structure retrieved successfully');
      console.log('📊 Structure:', response.data.data);
    } else {
      console.log('❌ Fee structure failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Fee structure error:', error.response?.data || error.message);
  }
}

async function testPaymentInitialization() {
  console.log('\n💳 Testing Payment Initialization...');
  
  try {
    const response = await axios.post(`${BASE_URL}/payments/initialize`, testGroupData, {
      headers: {
        'Authorization': `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Payment initialization successful');
      console.log('🔗 Authorization URL:', response.data.data.authorizationUrl);
      console.log('📝 Reference:', response.data.data.reference);
      console.log('💰 Amount:', response.data.data.amount);
      return response.data.data.reference;
    } else {
      console.log('❌ Payment initialization failed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Payment initialization error:', error.response?.data || error.message);
    return null;
  }
}

async function testPaymentVerification(reference) {
  if (!reference) {
    console.log('⚠️ Skipping payment verification - no reference');
    return;
  }
  
  console.log('\n🔍 Testing Payment Verification...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/verify/${reference}`);
    
    if (response.data.success) {
      console.log('✅ Payment verification successful');
      console.log('📊 Payment data:', response.data.data);
    } else {
      console.log('❌ Payment verification failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Payment verification error:', error.response?.data || error.message);
  }
}

async function testPublicKey() {
  console.log('\n🔑 Testing Public Key Retrieval...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/public-key`);
    
    if (response.data.success) {
      console.log('✅ Public key retrieved successfully');
      console.log('🔑 Key:', response.data.data.publicKey);
    } else {
      console.log('❌ Public key retrieval failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Public key error:', error.response?.data || error.message);
  }
}

async function testPaymentHistory() {
  console.log('\n📚 Testing Payment History...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/history`, {
      headers: {
        'Authorization': `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Payment history retrieved successfully');
      console.log('📊 History count:', response.data.data.length);
    } else {
      console.log('❌ Payment history failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Payment history error:', error.response?.data || error.message);
  }
}

async function testPaymentStats() {
  console.log('\n📊 Testing Payment Statistics...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/stats`, {
      headers: {
        'Authorization': `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Payment stats retrieved successfully');
      console.log('📊 Stats:', response.data.data.stats);
      console.log('📝 Recent payments:', response.data.data.recentPayments.length);
    } else {
      console.log('❌ Payment stats failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Payment stats error:', error.response?.data || error.message);
  }
}

async function testPaymentAnalytics() {
  console.log('\n📈 Testing Payment Analytics...');
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/analytics`, {
      headers: {
        'Authorization': `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Payment analytics retrieved successfully');
      console.log('📊 Analytics data count:', response.data.data.length);
    } else {
      console.log('❌ Payment analytics failed:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Payment analytics error:', error.response?.data || error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Payment Integration Tests...\n');
  
  try {
    // Test basic functionality
    await testFeeCalculation();
    await testFeeStructure();
    await testPublicKey();
    
    // Test authenticated endpoints
    await testPaymentHistory();
    await testPaymentStats();
    await testPaymentAnalytics();
    
    // Test payment flow
    const reference = await testPaymentInitialization();
    await testPaymentVerification(reference);
    
    console.log('\n✨ All tests completed!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testFeeCalculation,
  testFeeStructure,
  testPaymentInitialization,
  testPaymentVerification,
  testPublicKey,
  testPaymentHistory,
  testPaymentStats,
  testPaymentAnalytics,
  runAllTests
}; 