# Email Setup Guide for LoopFund

This guide will help you set up real email functionality using Nodemailer for the LoopFund application.

## Prerequisites

- Node.js and npm installed
- A Gmail account (recommended for development) or any SMTP email service

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to Security
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "LoopFund" as the app name
5. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=noreply@loopfund.com
```

## Alternative Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
```

## Testing Email Functionality

### Development Mode
If no email credentials are provided, the application will run in development mode and log emails to the console instead of sending them.

### Production Mode
With proper email credentials configured, the application will send real emails.

## Email Templates

The application includes three email templates:

1. **Email Verification** - Sent when users sign up
2. **Welcome Email** - Sent after successful email verification
3. **Password Reset** - Sent when users request password reset

## API Endpoints

### Email Verification
- `POST /api/email/send-verification` - Send verification code
- `POST /api/email/verify` - Verify email with code
- `POST /api/email/resend-verification` - Resend verification code

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your email credentials
   - Ensure 2FA is enabled and app password is used (for Gmail)
   - Verify SMTP settings

2. **"Connection timeout"**
   - Check your internet connection
   - Verify SMTP host and port
   - Check firewall settings

3. **"Emails not received"**
   - Check spam/junk folder
   - Verify email address is correct
   - Check email provider's sending limits

### Gmail Specific Issues

- Use App Passwords, not your regular Gmail password
- Ensure "Less secure app access" is disabled (use App Passwords instead)
- Check Gmail's sending limits (500 emails/day for free accounts)

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive information
- Consider using a dedicated email service for production (SendGrid, Mailgun, etc.)
- Implement rate limiting for email sending endpoints

## Production Recommendations

For production environments, consider using dedicated email services:

- **SendGrid** - Reliable, scalable email service
- **Mailgun** - Developer-friendly email API
- **Amazon SES** - Cost-effective for high volume
- **Postmark** - Great for transactional emails

These services provide better deliverability, analytics, and support compared to personal email accounts.
