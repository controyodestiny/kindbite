@echo off
echo 🌍 Starting KindBite Development Environment
echo ==========================================

echo.
echo 🔧 Starting Backend Server...
start "KindBite Backend" cmd /k "cd /d backend && python manage.py runserver"

echo.
echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo 🎨 Starting Frontend Server...
start "KindBite Frontend" cmd /k "npm start"

echo.
echo ✅ Development servers starting...
echo.
echo 📊 Backend: http://localhost:8000
echo 🎨 Frontend: http://localhost:3000
echo 📖 Admin: http://localhost:8000/admin
echo.
echo 💡 Tip: Use the WiFi icon in the frontend header to test API connection!
echo.
pause





















