# Google OAuth Setup Guide for Slug Board

This guide will help you enable Google login for your Slug Board application.

## Prerequisites

1. A Google Cloud Console account
2. Access to your Supabase project dashboard
3. Your application domain (for OAuth redirect URLs)

## Step 1: Set up Google OAuth in Google Cloud Console

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Slug Board"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users (your email addresses for testing)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://xzbgwpckoyvlgzfecnmo.supabase.co/auth/v1/callback`
   - `http://localhost:4028/auth/v1/callback` (for local development)
5. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase Authentication

### 2.1 Enable Google Provider in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" > "Providers"
4. Find "Google" and click "Enable"
5. Enter the Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Save the configuration

### 2.2 Configure Redirect URLs
1. In Supabase Dashboard, go to "Authentication" > "URL Configuration"
2. Set the Site URL to your application URL:
   - Production: `https://your-domain.com`
   - Development: `http://localhost:4028`
3. Add redirect URLs:
   - `https://your-domain.com/home`
   - `http://localhost:4028/home`

## Step 3: Test Google Login

### 3.1 Local Development Testing
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Go to `http://localhost:4028/login`
3. Click the Google login button
4. Complete the OAuth flow
5. You should be redirected to `/home` after successful authentication

### 3.2 Production Testing
1. Deploy your application
2. Test the Google login flow on your production domain
3. Verify that users are properly redirected and authenticated

## Step 4: Handle User Data (Optional)

The application automatically stores user data when they sign in with Google. You can customize this behavior by modifying the `signInWithProvider` method in `src/services/authService.js`.

### User Data Stored:
- Email address
- Provider (google)
- Creation timestamp
- Last sign-in timestamp

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Check that the Supabase callback URL is correct

2. **"OAuth consent screen not configured"**
   - Complete the OAuth consent screen setup in Google Cloud Console
   - Add your email as a test user

3. **"Provider not enabled" error**
   - Make sure Google provider is enabled in Supabase Dashboard
   - Verify the Client ID and Client Secret are correct

4. **Redirect not working**
   - Check that the Site URL and redirect URLs are configured correctly in Supabase
   - Ensure your application is running on the correct port/domain

### Debug Steps:
1. Check browser console for error messages
2. Verify network requests in browser dev tools
3. Check Supabase logs in the dashboard
4. Test with a different browser or incognito mode

## Security Considerations

1. **Client Secret**: Never expose your Google OAuth Client Secret in client-side code
2. **HTTPS**: Always use HTTPS in production
3. **Domain Verification**: Verify your domain in Google Cloud Console for production
4. **Rate Limiting**: Be aware of Google's OAuth rate limits

## Additional Providers

The same setup process can be used for other OAuth providers:
- LinkedIn
- Apple
- GitHub
- Discord

Each provider will need its own OAuth application setup in their respective developer consoles.

## Support

If you encounter issues:
1. Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Review [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check the browser console and Supabase logs for error messages 