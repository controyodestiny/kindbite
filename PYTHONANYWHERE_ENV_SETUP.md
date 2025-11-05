# Setting Up Environment Variables on PythonAnywhere

## The Problem
PythonAnywhere doesn't automatically load `.env` files in production. You need to set environment variables in the Web app configuration.

## Solution: Set Environment Variables in PythonAnywhere Web App

### Method 1: Using PythonAnywhere Web App Interface (Recommended)

1. **Log into PythonAnywhere Dashboard**
   - Go to https://www.pythonanywhere.com
   - Log in to your account

2. **Navigate to Web App Configuration**
   - Click on **"Web"** in the top menu
   - Find your web app (kindbite.pythonanywhere.com)
   - Click on it to open configuration

3. **Add Environment Variables**
   - Scroll down to **"Environment variables"** section
   - Click **"Add a new environment variable"**
   - Add each variable one by one:

   ```
   GOOGLE_CLIENT_ID = 45566622885-ggkc1...your-full-client-id
   GOOGLE_CLIENT_SECRET = your-google-client-secret
   GOOGLE_REDIRECT_URI = https://kindbite.pythonanywhere.com/
   ```

4. **Reload Web App**
   - After adding all variables, click **"Reload"** button (green button at the top)
   - Wait for the reload to complete

### Method 2: Using WSGI Configuration File

If Method 1 doesn't work, you can set them in the WSGI file:

1. **Open WSGI Configuration File**
   - In PythonAnywhere Dashboard, go to **"Web"** tab
   - Click on your web app
   - Click on **"WSGI configuration file"** link
   - This opens the WSGI file in an editor

2. **Add Environment Variables Before Django Setup**
   Add these lines **before** `os.environ.setdefault('DJANGO_SETTINGS_MODULE', ...)`:

   ```python
   import os
   
   # Set Google OAuth environment variables
   os.environ['GOOGLE_CLIENT_ID'] = '45566622885-ggkc1...your-full-client-id'
   os.environ['GOOGLE_CLIENT_SECRET'] = 'your-google-client-secret'
   os.environ['GOOGLE_REDIRECT_URI'] = 'https://kindbite.pythonanywhere.com/'
   
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kindbite.settings')
   ```

3. **Save and Reload**
   - Click **"Save"** button
   - Go back to Web app configuration
   - Click **"Reload"** button

### Method 3: Using .env File (If you have file access)

If you have access to the file system:

1. **Create/Edit .env file**
   - Navigate to your project directory: `/home/yourusername/kindbite/backend/`
   - Create or edit `.env` file
   - Add:
   ```
   GOOGLE_CLIENT_ID=45566622885-ggkc1...your-full-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=https://kindbite.pythonanywhere.com/
   ```

2. **Reload Web App**

## Verify Environment Variables Are Loaded

After setting up, you can verify by:

1. **Check Django Shell**
   - Go to **"Consoles"** tab in PythonAnywhere
   - Start a Django console
   - Run:
   ```python
   import os
   print(os.environ.get('GOOGLE_CLIENT_ID'))
   ```
   - Should print your Client ID (not empty)

2. **Check Error Logs**
   - Go to **"Web"** tab
   - Click on **"Error log"** link
   - Check if there are any errors about missing environment variables

## Important Notes

- **No quotes needed**: When setting in PythonAnywhere interface, don't use quotes around values
- **Full Client ID**: Make sure you copy the complete Client ID (not truncated)
- **Reload required**: Always reload the web app after changing environment variables
- **Case sensitive**: Variable names are case-sensitive (`GOOGLE_CLIENT_ID` not `google_client_id`)

## Troubleshooting

### Still getting "Google OAuth is not configured" error?

1. **Double-check variable names**: Must be exactly `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
2. **Check for typos**: Make sure there are no extra spaces
3. **Reload web app**: Always reload after making changes
4. **Check error logs**: Look for any Python errors in the error log
5. **Test in Django shell**: Use the verification method above

### Getting 500 errors?

- Check the error log in PythonAnywhere Web tab
- Make sure all required packages are installed (`python-dotenv`, `google-auth`, `requests`)
- Verify the `.env` file path is correct if using Method 3

