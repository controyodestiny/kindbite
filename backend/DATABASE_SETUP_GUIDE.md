# 🗃️ KindBite Database Setup Guide

## 🚨 **Current Issue**
Your Django server is running but the database tables haven't been created yet. This is causing the "no such table: users" errors.

## 🔧 **Quick Fix - Step by Step**

### Step 1: Stop Your Django Server
In your current terminal where the server is running:
- Press **Ctrl+C** to stop the server

### Step 2: Reset Database (Recommended)
Run the reset script:
```bash
reset_database.bat
```

**OR** do it manually:

```bash
# Delete old database (if exists)
del db.sqlite3

# Create fresh migrations
python manage.py makemigrations users
python manage.py makemigrations

# Create database tables
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Create demo users
python manage.py create_demo_users
```

### Step 3: Start Server Again
```bash
python manage.py runserver 8002
```

## 🎯 **What This Will Do**

✅ **Create User Tables**: `users`, `user_profiles`, `business_profiles`  
✅ **Create Demo Users**: Ready-to-use test accounts  
✅ **Fix API Errors**: No more "table doesn't exist" errors  
✅ **Enable Authentication**: Login/register will work  

## 🧪 **Demo Users Created**

| Role | Email | Password | KindCoins |
|------|-------|----------|-----------|
| Admin | admin@kindbite.demo | admin123 | 1000 |
| End User | user@kindbite.demo | demo123 | 245 |
| Restaurant | restaurant@kindbite.demo | demo123 | 340 |
| Factory | factory@kindbite.demo | demo123 | 2840 |
| Home Kitchen | home@kindbite.demo | demo123 | 340 |
| Supermarket | supermarket@kindbite.demo | demo123 | 1560 |
| Verifier | verifier@kindbite.demo | demo123 | 150 |
| Ambassador | ambassador@kindbite.demo | demo123 | 320 |

## 🔍 **Verify Setup**

After setup, test these endpoints:
- ✅ `GET http://localhost:8002/api/v1/auth/status/` → Should return 200
- ✅ `POST http://localhost:8002/api/v1/auth/login/` → Test with demo credentials
- ✅ `GET http://localhost:8002/admin/` → Django admin interface

## 🚀 **Next Steps After Database Setup**

1. **Start your React frontend**: `npm start`
2. **Update .env.local**: Set `REACT_APP_API_BASE_URL=http://localhost:8002/api/v1`
3. **Test API connection**: Use WiFi icon in frontend header
4. **Try authentication**: Login with demo credentials

## 🆘 **If You Still Have Issues**

**Migration Conflicts:**
```bash
python manage.py migrate --fake-initial
```

**Start Completely Fresh:**
```bash
del db.sqlite3
rmdir /s /q apps\users\migrations\__pycache__
del apps\users\migrations\0001_initial.py
python manage.py makemigrations users
python manage.py migrate
```

**Check What Tables Exist:**
```bash
python manage.py dbshell
.tables
.exit
```

Your backend is almost ready! Just need to create those database tables. 🌟






























