const nodemailer = require('nodemailer');
const { env } = require('../config/env');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: env.email?.host || 'smtp.gmail.com',
        port: env.email?.port || 587,
        secure: env.email?.secure || false,
        auth: {
          user: env.email?.user,
          pass: env.email?.password
        }
      });

      if (env.email?.user && env.email?.password) {
        await this.transporter.verify();
        console.log('✅ Email service initialized successfully');
      } else {
        console.log('⚠️ Email service not configured - using development mode');
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  async sendVerificationCode(email, code, firstName) {
    const mailOptions = {
      from: env.email?.from || env.email?.user || 'noreply@loopfund.com',
      to: email,
      subject: 'LoopFund - Email Verification Code',
      html: this.getVerificationEmailTemplate(code, firstName),
      text: `Your LoopFund verification code is: ${code}. This code expires in 10 minutes.`
    };

    try {
      if (this.transporter && env.email?.user && env.email?.password) {
        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Verification code sent to ${email}`);
        return { success: true, message: 'Verification code sent successfully' };
      } else {
        console.log('📧 EMAIL VERIFICATION CODE (Development Mode):');
        console.log(`To: ${email}`);
        console.log(`Code: ${code}`);
        console.log(`Subject: LoopFund - Email Verification Code`);
        console.log('Expires: 10 minutes');
        return { success: true, message: 'Verification code logged to console (development mode)' };
      }
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      return { success: false, message: 'Failed to send verification email' };
    }
  }

  async sendWelcomeEmail(email, firstName) {
    const mailOptions = {
      from: env.email?.from || env.email?.user || 'noreply@loopfund.com',
      to: email,
      subject: 'Welcome to LoopFund - Your Smart Savings Journey Begins!',
      html: this.getWelcomeEmailTemplate(firstName),
      text: `Welcome to LoopFund, ${firstName}! Your account has been successfully verified. Start your smart savings journey today.`
    };

    try {
      if (this.transporter && env.email?.user && env.email?.password) {
        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
        return { success: true, message: 'Welcome email sent successfully' };
      } else {
        console.log('📧 WELCOME EMAIL (Development Mode):');
        console.log(`To: ${email}`);
        console.log(`Subject: Welcome to LoopFund - Your Smart Savings Journey Begins!`);
        return { success: true, message: 'Welcome email logged to console (development mode)' };
      }
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return { success: false, message: 'Failed to send welcome email' };
    }
  }

  async sendPasswordResetEmail(email, resetToken, firstName) {
    const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: env.email?.from || env.email?.user || 'noreply@loopfund.com',
      to: email,
      subject: 'LoopFund - Password Reset Request',
      html: this.getPasswordResetEmailTemplate(resetUrl, firstName),
      text: `Hi ${firstName}, you requested a password reset. Click this link to reset your password: ${resetUrl}. This link expires in 1 hour.`
    };

    try {
      if (this.transporter && env.email?.user && env.email?.password) {
        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${email}`);
        return { success: true, message: 'Password reset email sent successfully' };
      } else {
        console.log('📧 PASSWORD RESET EMAIL (Development Mode):');
        console.log(`To: ${email}`);
        console.log(`Subject: LoopFund - Password Reset Request`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log(`Expires: 1 hour`);
        return { success: true, message: 'Password reset email logged to console (development mode)' };
      }
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return { success: false, message: 'Failed to send password reset email' };
    }
  }

  async sendPasswordResetEmail(email, resetCode, firstName) {
    const mailOptions = {
      from: env.email?.from || env.email?.user || 'noreply@loopfund.com',
      to: email,
      subject: 'LoopFund - Password Reset Code',
      html: this.getPasswordResetEmailTemplate(resetCode, firstName),
      text: `Your LoopFund password reset code is: ${resetCode}. This code expires in 15 minutes.`
    };

    try {
      if (this.transporter && env.email?.user && env.email?.password) {
        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Password reset code sent to ${email}`);
        return { success: true, message: 'Password reset code sent successfully' };
      } else {
        console.log('📧 PASSWORD RESET CODE (Development Mode):');
        console.log(`To: ${email}`);
        console.log(`Code: ${resetCode}`);
        console.log(`Subject: LoopFund - Password Reset Code`);
        console.log('Expires: 15 minutes');
        return { success: true, message: 'Password reset code logged to console (development mode)' };
      }
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return { success: false, message: 'Failed to send password reset email' };
    }
  }

  getVerificationEmailTemplate(code, firstName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>LoopFund Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .code-box { background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .verification-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>🎯 LoopFund</h1>
            <p>Smart Savings Platform</p>
          </div>
          <div class='content'>
            <h2>Hello ${firstName}!</h2>
            <p>Welcome to LoopFund! To complete your registration and start your smart savings journey, please verify your email address.</p>
            
            <div class='code-box'>
              <p style='margin: 0 0 10px 0; font-weight: bold;'>Your verification code is:</p>
              <div class='verification-code'>${code}</div>
            </div>
            
            <div class='warning'>
              <strong>Important:</strong>
              <ul style='margin: 10px 0; padding-left: 20px;'>
                <li>This code expires in 10 minutes</li>
                <li>Enter this code in the verification form</li>
                <li>Do not share this code with anyone</li>
              </ul>
            </div>
            
            <p>If you didn't create an account with LoopFund, please ignore this email.</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getWelcomeEmailTemplate(firstName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Welcome to LoopFund</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
          .features { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>🎉 Welcome to LoopFund!</h1>
            <p>Your Smart Savings Journey Begins Now</p>
          </div>
          <div class='content'>
            <h2>Hello ${firstName}!</h2>
            <p>Congratulations! Your email has been successfully verified and your LoopFund account is now active.</p>
            
            <div class='features'>
              <h3>🚀 What you can do now:</h3>
              <ul>
                <li>Create or join savings groups</li>
                <li>Set financial goals and track progress</li>
                <li>Get AI-powered financial advice</li>
                <li>Connect with a supportive community</li>
                <li>Access premium financial tools</li>
              </ul>
            </div>
            
            <div style='text-align: center;'>
              <a href='${env.frontendUrl}/dashboard' class='cta-button'>Start Your Journey</a>
            </div>
            
            <p>If you have any questions, our support team is here to help. Happy saving!</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getPasswordResetEmailTemplate(resetCode, firstName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>LoopFund Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .code-box { background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .verification-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>🔐 LoopFund</h1>
            <p>Password Reset Request</p>
          </div>
          <div class='content'>
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your LoopFund account password. Use the code below to reset your password.</p>
            
            <div class='code-box'>
              <p style='margin: 0 0 10px 0; font-weight: bold;'>Your password reset code is:</p>
              <div class='verification-code'>${resetCode}</div>
            </div>
            
            <div class='warning'>
              <strong>Important:</strong>
              <ul style='margin: 10px 0; padding-left: 20px;'>
                <li>This code expires in 15 minutes</li>
                <li>Enter this code in the password reset form</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generic email sending method for notifications
  async sendEmail(emailData) {
    const { to, subject, template, data } = emailData;
    
    let htmlContent = '';
    let textContent = '';

    // Handle different email templates
    switch (template) {
      case 'payment-reminder':
        htmlContent = this.getPaymentReminderEmailTemplate(data);
        textContent = `Hi ${data.userName}, this is a reminder that your payment of ₦${data.amount.toLocaleString()} is due for your goal "${data.goalName}".`;
        break;
      case 'goal-update':
        htmlContent = this.getGoalUpdateEmailTemplate(data);
        textContent = `Hi ${data.userName}, your goal "${data.goalName}" has been updated. Progress: ${data.progress}%`;
        break;
      case 'achievement':
        htmlContent = this.getAchievementEmailTemplate(data);
        textContent = `Congratulations ${data.userName}! You've earned the "${data.achievementName}" achievement!`;
        break;
      default:
        htmlContent = emailData.html || '';
        textContent = emailData.text || '';
    }

    const mailOptions = {
      from: env.email?.from || env.email?.user || 'noreply@loopfund.com',
      to,
      subject,
      html: htmlContent,
      text: textContent
    };

    try {
      if (this.transporter && env.email?.user && env.email?.password) {
        await this.transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${subject}`);
        return { success: true, message: 'Email sent successfully' };
      } else {
        console.log('📧 EMAIL (Development Mode):');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Template: ${template}`);
        return { success: true, message: 'Email logged to console (development mode)' };
      }
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

  // Send group invitation email
  async sendGroupInvitationEmail(email, inviterName, groupName, invitationToken) {
    const invitationUrl = `${env.frontendUrl}/join-group?token=${invitationToken}`;
    
    const mailOptions = {
      from: env.email?.from || env.email?.user || 'noreply@loopfund.com',
      to: email,
      subject: `🎯 You're invited to join "${groupName}" on LoopFund!`,
      html: this.getGroupInvitationEmailTemplate(inviterName, groupName, invitationUrl)
    };

    if (!this.transporter) {
      console.log('📧 Email service not available - would send:', mailOptions);
      return { success: true, message: 'Email service not configured' };
    }

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Group invitation email sent to: ${email}`);
      return { success: true, message: 'Group invitation email sent successfully' };
    } catch (error) {
      console.error('❌ Failed to send group invitation email:', error);
      return { success: false, error: error.message };
    }
  }

  getGroupInvitationEmailTemplate(inviterName, groupName, invitationUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Group Invitation - LoopFund</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { padding: 30px; }
          .content h2 { color: #1e293b; margin-bottom: 20px; font-size: 24px; }
          .content p { color: #475569; line-height: 1.6; margin-bottom: 20px; }
          .invitation-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
          .invitation-box h3 { color: #0369a1; margin: 0 0 15px 0; font-size: 20px; }
          .invitation-box p { color: #0c4a6e; margin: 0 0 20px 0; font-size: 16px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 10px 0; }
          .cta-button:hover { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); }
          .benefits { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .benefits h4 { color: #1e293b; margin: 0 0 15px 0; font-size: 18px; }
          .benefits ul { color: #475569; margin: 0; padding-left: 20px; }
          .benefits li { margin-bottom: 8px; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .footer p { margin: 5px 0; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .highlight p { margin: 0; color: #92400e; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>🎯 LoopFund</h1>
            <p>You're Invited to Join a Savings Group!</p>
          </div>
          <div class='content'>
            <h2>Hello there!</h2>
            <p><strong>${inviterName}</strong> has invited you to join the <strong>"${groupName}"</strong> savings group on LoopFund!</p>
            
            <div class='invitation-box'>
              <h3>🎉 You're Invited!</h3>
              <p><strong>${inviterName}</strong> wants you to be part of their savings journey</p>
              <a href="${invitationUrl}" class='cta-button'>Join Group Now</a>
            </div>

            <div class='benefits'>
              <h4>🚀 What you'll get:</h4>
              <ul>
                <li><strong>Shared Goals:</strong> Work together towards common financial objectives</li>
                <li><strong>Group Support:</strong> Get motivation and accountability from your peers</li>
                <li><strong>Smart Analytics:</strong> Track your progress with AI-powered insights</li>
                <li><strong>Flexible Contributions:</strong> Contribute at your own pace and comfort level</li>
                <li><strong>Community Chat:</strong> Connect and share tips with group members</li>
              </ul>
            </div>

            <div class='highlight'>
              <p>💡 <strong>New to LoopFund?</strong> No worries! Click the button above to create your account and automatically join the group.</p>
            </div>

            <p>Join thousands of people who are already achieving their financial goals together on LoopFund!</p>
            
            <p>If you have any questions, feel free to reach out to <strong>${inviterName}</strong> or contact our support team.</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This invitation was sent by ${inviterName}. If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Payment reminder email template
  getPaymentReminderEmailTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Payment Reminder - LoopFund</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .reminder-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .amount { font-size: 36px; font-weight: bold; color: #d97706; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>💰 Payment Reminder</h1>
            <p>Time to contribute to your goal!</p>
          </div>
          <div class='content'>
            <h2>Hello ${data.userName}!</h2>
            <p>This is a friendly reminder that your payment is due for your goal.</p>
            
            <div class='reminder-box'>
              <h3>Goal: ${data.goalName}</h3>
              <div class='amount'>₦${data.amount.toLocaleString()}</div>
              <p>Frequency: ${data.frequency}</p>
            </div>
            
            <div style='text-align: center;'>
              <a href='${env.frontendUrl}/goals' class='cta-button'>Make Payment Now</a>
            </div>
            
            <p>Keep up the great work on your financial journey!</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This is an automated reminder, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Goal update email template
  getGoalUpdateEmailTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Goal Update - LoopFund</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .progress-box { background: #d1fae5; border: 2px solid #10b981; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .progress { font-size: 36px; font-weight: bold; color: #059669; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>🎯 Goal Update</h1>
            <p>Your progress is looking great!</p>
          </div>
          <div class='content'>
            <h2>Hello ${data.userName}!</h2>
            <p>Great news! Your goal has been updated with new progress.</p>
            
            <div class='progress-box'>
              <h3>${data.goalName}</h3>
              <div class='progress'>${data.progress}% Complete</div>
              <p>Keep up the excellent work!</p>
            </div>
            
            <p>You're making fantastic progress towards your financial goals!</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This is an automated update, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Achievement email template
  getAchievementEmailTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <title>Achievement Unlocked - LoopFund</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .achievement-box { background: #f3e8ff; border: 2px solid #8b5cf6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .achievement-name { font-size: 24px; font-weight: bold; color: #7c3aed; margin: 10px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>🏆 Achievement Unlocked!</h1>
            <p>Congratulations on your success!</p>
          </div>
          <div class='content'>
            <h2>Hello ${data.userName}!</h2>
            <p>Amazing news! You've just earned a new achievement.</p>
            
            <div class='achievement-box'>
              <h3>🏆 ${data.achievementName}</h3>
              <p>${data.description}</p>
            </div>
            
            <p>Your dedication to your financial goals is truly inspiring!</p>
          </div>
          <div class='footer'>
            <p>© 2024 LoopFund. All rights reserved.</p>
            <p>This is an automated achievement notification, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();