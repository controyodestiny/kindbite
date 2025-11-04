# KindBite Backend - Windows Setup Guide

## 🚨 Windows Installation Issues & Solutions

### Problem
You're encountering compilation errors with `Pillow` and `psycopg2-binary` on Windows with Python 3.13. This is common due to missing C++ build tools.

## 🛠️ Quick Solution (Recommended)

### Step 1: Install Core Requirements
```bash
cd backend
pip install -r requirements.txt
```

This will install only the essential packages needed to run the Django backend.

### Step 2: Install Optional Packages (if needed)
```bash
# For image handling (profile pictures)
pip install Pillow

# For development tools
pip install django-extensions

# For PostgreSQL (optional - SQLite works for development)
pip install psycopg2-binary

# For background tasks (optional)
pip install celery redis
```

## 🚀 Start Development Server

```bash
# Create database tables
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Create demo users (optional)
python manage.py create_demo_users

# Start server
python manage.py runserver
```

## 🔧 Alternative Solutions

### Option 1: Use Pre-compiled Wheels
```bash
pip install --only-binary=all Pillow psycopg2-binary
```

### Option 2: Use Different PostgreSQL Adapter
```bash
pip install psycopg2-binary==2.9.3  # Older version
# OR
pip install pg8000  # Pure Python PostgreSQL adapter
```

### Option 3: Skip Problematic Packages
For development, you can skip these packages:
- **Pillow**: Profile images will be text-only
- **psycopg2**: Use SQLite (default) instead of PostgreSQL
- **celery/redis**: Skip background tasks for now

## 📊 Database Options

### SQLite (Default - No setup needed)
```python
# Already configured in settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### PostgreSQL (Optional)
If you want PostgreSQL:
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Install psycopg2: `pip install psycopg2-binary`
3. Update your `.env` file:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=kindbite
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## 🧪 Test Your Setup

```bash
# Test core functionality
python manage.py check

# Test API
python test_api.py

# Access admin
# http://localhost:8000/admin/

# API endpoints
# http://localhost:8000/api/v1/auth/status/
```

## 🔍 Troubleshooting

### Python 3.13 Compatibility Issues
Some packages haven't been updated for Python 3.13 yet. Solutions:

1. **Downgrade Python** (Recommended):
   ```bash
   # Use Python 3.11 or 3.12
   python -m venv venv --python=python3.11
   ```

2. **Use Development Versions**:
   ```bash
   pip install --pre Pillow
   pip install psycopg2-binary --no-binary psycopg2-binary
   ```

### Missing Visual Studio Build Tools
If you get C++ compilation errors:

1. Install **Visual Studio Build Tools 2022**
2. Or install **Visual Studio Community** with C++ workload
3. Or use pre-compiled wheels: `pip install --only-binary=all package_name`

## ✅ Minimal Working Setup

This will get you a fully functional backend:

```bash
cd backend
pip install Django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Your API will be available at `http://localhost:8000/api/v1/`

## 🎯 What Works Without Optional Packages

- ✅ User authentication (JWT)
- ✅ User registration/login
- ✅ Role-based access control
- ✅ Admin interface
- ✅ All API endpoints
- ✅ SQLite database
- ❌ Profile image uploads (Pillow needed)
- ❌ PostgreSQL support (psycopg2 needed)
- ❌ Background tasks (Celery/Redis needed)

## 🚀 Next Steps

Once you have the basic setup working:
1. Connect your React frontend to `http://localhost:8000/api/v1/auth/`
2. Test authentication endpoints
3. Add optional packages as needed
4. Consider using Docker for easier dependency management

## 📞 Need Help?

If you're still having issues:
1. Check Python version: `python --version`
2. Check pip version: `pip --version`
3. Try the minimal setup above
4. Consider using Docker for consistent environment






























