@echo off
echo 🔄 Resetting KindBite Database
echo ==============================

echo.
echo ⚠️  Please STOP your Django server (Ctrl+C) before running this script!
echo.
pause

echo.
echo 🗑️ Removing old database...
if exist db.sqlite3 del db.sqlite3
if exist apps\users\migrations\0001_initial.py del apps\users\migrations\0001_initial.py
if exist apps\users\migrations\__pycache__ rmdir /s /q apps\users\migrations\__pycache__

echo.
echo 📝 Creating fresh migrations...
python manage.py makemigrations users
python manage.py makemigrations

echo.
echo 🏗️ Creating database tables...
python manage.py migrate

echo.
echo 👤 Creating superuser...
echo Please create an admin user:
python manage.py createsuperuser

echo.
echo 👥 Creating demo users...
python manage.py create_demo_users

echo.
echo ✅ Database reset complete!
echo.
echo 🚀 Start your server with: python manage.py runserver 8002
echo 📊 Admin interface: http://localhost:8002/admin/
echo.
pause




