# 🔗 KindBite Frontend-Backend Connection Guide

## 🎯 What We've Done

I've successfully connected your React frontend to the Django backend with:

### ✅ **Frontend Changes**
- **API Configuration** (`src/config/api.js`) - Centralized API settings
- **API Service** (`src/services/apiService.js`) - HTTP request handler with JWT auth
- **Updated AuthContext** - Now uses real backend API instead of mock data
- **Environment Variables** - `.env.local` for configuration
- **Connection Tester** - Visual API connection testing component

### ✅ **Backend Ready**
- JWT authentication endpoints
- User management API
- Role-based access control
- CORS configured for frontend
- Demo users available

## 🚀 **Setup Instructions**

### 1. **Start Backend Server**
```bash
# In backend directory
cd backend
python manage.py runserver
```
Backend will run on: `http://localhost:8000`

### 2. **Start Frontend Server**
```bash
# In project root
npm start
```
Frontend will run on: `http://localhost:3000`

### 3. **Test Connection**
1. Open your frontend: `http://localhost:3000`
2. Click the **WiFi icon** in the header (next to the bot icon)
3. Run the connection test to verify backend communication

## 🔧 **Configuration Files**

### Frontend Environment (`.env.local`)
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_API_TIMEOUT=10000
REACT_APP_TOKEN_STORAGE_KEY=kindbite_tokens
REACT_APP_USER_STORAGE_KEY=kindbite_user
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

### Backend Environment (`backend/.env`)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🧪 **Testing the Connection**

### Demo Login Credentials
Use these to test authentication:

| Role | Email | Password |
|------|--------|----------|
| End User | user@kindbite.demo | demo123 |
| Restaurant | restaurant@kindbite.demo | demo123 |
| Factory | factory@kindbite.demo | demo123 |
| Home Kitchen | home@kindbite.demo | demo123 |
| Supermarket | supermarket@kindbite.demo | demo123 |

### API Endpoints Available
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/register/` - Registration
- `GET /api/v1/auth/me/` - Current user
- `GET /api/v1/users/providers/` - Food providers
- `GET /api/v1/auth/status/` - Connection test

## 🔍 **What's Changed in Frontend**

### 1. **AuthContext Updates**
- Now calls real backend API
- Handles JWT tokens (access + refresh)
- Automatic token refresh
- Proper error handling

### 2. **API Service**
- Centralized HTTP requests
- JWT authentication headers
- Token refresh logic
- Error handling with status codes

### 3. **Environment Configuration**
- API base URL configurable
- Storage keys customizable
- Development/production ready

## 🎯 **How Authentication Works Now**

1. **Login Flow:**
   ```
   User enters credentials → API call to /auth/login/ → 
   Backend returns JWT tokens + user data → 
   Frontend stores tokens + user info → 
   User authenticated
   ```

2. **Protected Requests:**
   ```
   Frontend adds "Authorization: Bearer <token>" header → 
   Backend validates JWT → 
   Returns requested data
   ```

3. **Token Refresh:**
   ```
   Access token expires → 
   Frontend automatically uses refresh token → 
   Gets new access token → 
   Retries original request
   ```

## 🛠️ **Troubleshooting**

### Backend Not Running
```
Error: Connection failed
Solution: Start Django server with `python manage.py runserver`
```

### CORS Errors
```
Error: CORS policy blocked
Solution: Check CORS_ALLOWED_ORIGINS in backend settings includes http://localhost:3000
```

### Authentication Errors
```
Error: 401 Unauthorized
Solution: Check if tokens are being stored and sent correctly
```

### Connection Test Failed
1. Verify backend is running on port 8000
2. Check `.env.local` has correct API_BASE_URL
3. Ensure CORS is configured in Django settings

## 🎉 **What Works Now**

### ✅ **Full Authentication**
- Registration with all user roles
- Login with JWT tokens
- Automatic token refresh
- Secure logout

### ✅ **Real User Data**
- User profiles from database
- Role-based dashboards
- KindCoins tracking
- Business profiles

### ✅ **API Integration**
- All requests go to Django backend
- No more mock data
- Real database storage
- Production-ready architecture

## 🚀 **Next Steps**

1. **Test Registration** - Create new accounts through the frontend
2. **Test Login** - Use demo credentials or newly created accounts
3. **Verify User Roles** - Check different dashboards for different roles
4. **Add Food Management** - Next feature to connect to backend
5. **Deploy** - Ready for production deployment

## 📞 **Need Help?**

If you encounter issues:

1. **Check Connection Test** - Use the WiFi icon in header
2. **Browser Console** - Look for error messages
3. **Backend Logs** - Check Django server output
4. **Network Tab** - Inspect API requests in browser dev tools

Your KindBite app now has a fully functional frontend-backend connection! 🌟

