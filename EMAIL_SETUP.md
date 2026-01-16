# Email Configuration Setup

To enable email functionality, you need to add the following environment variables to your `.env` file in the Backend directory.

## Required Environment Variables

Add these to your `.env` file:

```env
# Server Configuration
PORT=5000

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here

# Guide URLs (optional)
DOWNLOAD_GUIDE_URL=https://supersheldon.com/guide
DEMO_URL=https://supersheldon.com/demo
```

## Gmail Setup Instructions

If you're using Gmail, follow these steps:

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Or: Google Account > Security > 2-Step Verification > App passwords
   - Select "Mail" as the app
   - Select "Other" as the device and name it (e.g., "Super Sheldon Backend")
   - Click "Generate"
   - Copy the 16-character password

3. **Update your .env file**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # (use the generated app password)
   ```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password  # Generate from Yahoo account settings
```

### Custom SMTP Server
If you're using a custom SMTP server, you'll need to modify the `emailService.js` file to include custom SMTP configuration.

## Testing

After setting up your environment variables:

1. Restart your backend server
2. Test the guide download endpoint by submitting an email through the frontend
3. Check the backend logs for any email sending errors
4. Verify the email arrives in the recipient's inbox

## Troubleshooting

- **"Email service not configured"**: Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env
- **Authentication failed**: For Gmail, ensure you're using an App Password, not your regular password
- **Connection timeout**: Check your firewall settings and ensure SMTP ports (465/587) are not blocked
- **Email not received**: Check spam folder and verify the email address is correct

