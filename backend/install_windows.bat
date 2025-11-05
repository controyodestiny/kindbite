@echo off
echo 🌍 KindBite Backend - Windows Installation
echo ==========================================

echo.
echo 📦 Installing core requirements...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Installation failed. Trying individual packages...
    pip install Django==4.2.7
    pip install djangorestframework==3.14.0
    pip install djangorestframework-simplejwt==5.3.0
    pip install django-cors-headers==4.3.1
    pip install python-decouple==3.8
)

echo.
echo 🗃️ Setting up database...
python manage.py makemigrations
python manage.py migrate

echo.
echo 👤 Creating demo users...
python manage.py create_demo_users

echo.
echo ✅ Installation complete!
echo.
echo 🚀 To start the server:
echo    python manage.py runserver
echo.
echo 🔗 API will be available at:
echo    http://localhost:8000/api/v1/
echo.
echo 📊 Admin interface:
echo    http://localhost:8000/admin/
echo.
echo 📝 Demo login credentials in WINDOWS_SETUP.md

pause































