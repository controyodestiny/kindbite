@echo off
echo 🗃️ Setting up KindBite Database
echo ===============================

echo.
echo 📝 Creating database migrations...
python manage.py makemigrations

echo.
echo 🏗️ Applying migrations to create tables...
python manage.py migrate

echo.
echo 👤 Creating demo users...
python manage.py create_demo_users

echo.
echo ✅ Database setup complete!
echo.
echo 🚀 Your backend is ready at: http://localhost:8002/api/v1/
echo 📊 Admin interface at: http://localhost:8002/admin/
echo.
pause

