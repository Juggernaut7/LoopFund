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
}

module.exports = new EmailService();