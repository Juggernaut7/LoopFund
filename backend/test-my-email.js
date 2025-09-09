#!/usr/bin/env node

/**
 * Quick Email Test Script
 * 
 * Run this to test your email configuration:
 * node test-my-email.js your-email@gmail.com
 */

const emailService = require('./src/services/emailService');

async function testMyEmail() {
  const testEmail = process.argv[2];
  
  if (!testEmail) {
    console.log('❌ Please provide an email address to test');
    console.log('Usage: node test-my-email.js your-email@gmail.com');
    process.exit(1);
  }

  console.log('🧪 Testing email configuration...');
  console.log(`📧 Sending test email to: ${testEmail}\n`);

  try {
    const result = await emailService.sendVerificationCode(
      testEmail,
      '123456',
      'Test User'
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Check your email inbox (and spam folder)');
    } else {
      console.log('❌ Failed to send email:', result.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMyEmail();
