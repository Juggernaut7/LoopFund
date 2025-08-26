#!/bin/bash

echo "🚀 LoopFund AI - Demo Day Quick Start"
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python and Node.js found!"

# Start backend
echo ""
echo "🔧 Starting AI Backend..."
cd backend

# Check if requirements are installed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Start Flask backend in background
echo "🚀 Starting Flask backend..."
python app.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:5000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start. Check the logs above."
    exit 1
fi

# Start frontend
echo ""
echo "🎨 Starting React Frontend..."
cd ../frontend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start React app in background
echo "🚀 Starting React app..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 15

echo ""
echo "🎉 LoopFund AI is ready for demo day!"
echo "======================================"
echo "🌐 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo "🤖 AI Chat: Click the floating AI button (🤖)"
echo ""
echo "📋 Demo Day Checklist:"
echo "1. ✅ Backend running"
echo "2. ✅ Frontend running"
echo "3. ✅ AI service available"
echo "4. ✅ Test the AI chat"
echo ""
echo "🎭 Demo Script:"
echo "- Click the floating AI button"
echo "- Ask: 'How much should I save for a house?'"
echo "- Show personalized advice"
echo "- Highlight the professional UI"
echo ""
echo "💡 Quick Test:"
echo "curl http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped. Good luck with your demo! 🚀"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Keep script running
wait
