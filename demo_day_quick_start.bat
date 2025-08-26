@echo off
chcp 65001 >nul
echo 🚀 LoopFund AI - Demo Day Quick Start
echo ======================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Python and Node.js found!

REM Start backend
echo.
echo 🔧 Starting AI Backend...
cd backend

REM Check if requirements are installed
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    echo 📦 Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Start Flask backend
echo 🚀 Starting Flask backend...
start "LoopFund AI Backend" python app.py

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

REM Test backend
echo 🧪 Testing backend...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running!
) else (
    echo ❌ Backend failed to start. Check the logs above.
    pause
    exit /b 1
)

REM Start frontend
echo.
echo 🎨 Starting React Frontend...
cd ..\frontend

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start React app
echo 🚀 Starting React app...
start "LoopFund Frontend" npm start

REM Wait for frontend to start
echo ⏳ Waiting for frontend to start...
timeout /t 15 /nobreak >nul

echo.
echo 🎉 LoopFund AI is ready for demo day!
echo ======================================
echo 🌐 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo 🤖 AI Chat: Click the floating AI button (🤖)
echo.
echo 📋 Demo Day Checklist:
echo 1. ✅ Backend running
echo 2. ✅ Frontend running
echo 3. ✅ AI service available
echo 4. ✅ Test the AI chat
echo.
echo 🎭 Demo Script:
echo - Click the floating AI button
echo - Ask: 'How much should I save for a house?'
echo - Show personalized advice
echo - Highlight the professional UI
echo.
echo 💡 Quick Test:
echo curl http://localhost:5000/api/health
echo.
echo 🚀 Your AI is ready to impress investors!
echo.
pause
