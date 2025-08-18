# 🔐 Google OAuth Setup Guide

## 📋 Prerequisites
- Google Cloud Console account
- MongoDB Atlas connection working

## 🚀 Step-by-Step Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google OAuth2 API**

### 2. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set **Authorized redirect URIs**:
   ```
   http://localhost:4000/api/auth/google/callback
   ```
5. Copy your **Client ID** and **Client Secret**

### 3. Update Environment Variables
Update your `.env` file with the real credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
FRONTEND_URL=http://localhost:5173
```

### 4. Test the Setup
1. Start your backend server: `npm start`
2. Start your frontend: `npm run dev`
3. Try signing in with Google on the frontend

## 🔧 Troubleshooting

### Common Issues:
- **"Invalid redirect URI"** - Check the callback URL in Google Console
- **"Client ID not found"** - Verify GOOGLE_CLIENT_ID in .env
- **"Invalid client secret"** - Verify GOOGLE_CLIENT_SECRET in .env

### Testing:
- Backend health: `http://localhost:4000/api/health`
- Google OAuth: `http://localhost:4000/api/auth/google`

## 📱 What Happens During OAuth Flow:

1. **User clicks "Continue with Google"**
2. **Frontend redirects to**: `http://localhost:4000/api/auth/google`
3. **Google shows login page**
4. **User logs in with Google**
5. **Google redirects to**: `http://localhost:4000/api/auth/google/callback`
6. **Backend creates/updates user**
7. **Backend redirects to**: `http://localhost:3000/auth/callback?token=JWT_TOKEN&userId=USER_ID`
8. **Frontend stores token and redirects to dashboard**

## 🎯 Next Steps:
- Test the complete OAuth flow
- Implement protected routes with JWT
- Add user profile management
- Connect to real database operations 