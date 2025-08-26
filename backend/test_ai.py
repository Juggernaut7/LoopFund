#!/usr/bin/env python3
"""
LoopFund AI Test Script
Test the AI Financial Advisor before demo day
"""

import requests
import json
import time

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get('http://localhost:5000/api/health')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_ai_chat():
    """Test the AI chat functionality"""
    print("\n💬 Testing AI chat...")
    try:
        test_message = "How much should I save each month if my goal is $5,000 in 10 months?"
        payload = {
            "message": test_message,
            "history": [],
            "user_context": {}
        }
        
        response = requests.post(
            'http://localhost:5000/api/ai/chat',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ AI chat test passed!")
            print(f"🤖 AI Response: {data['response'][:200]}...")
            return True
        else:
            print(f"❌ AI chat failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ AI chat error: {e}")
        return False

def test_savings_plan():
    """Test the savings plan generation"""
    print("\n🎯 Testing savings plan generation...")
    try:
        payload = {
            "goal_amount": 5000,
            "timeline_months": 10,
            "monthly_income": 4000,
            "monthly_expenses": 2500
        }
        
        response = requests.post(
            'http://localhost:5000/api/ai/savings-plan',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Savings plan test passed!")
            print(f"📋 Plan: {data['plan'][:200]}...")
            return True
        else:
            print(f"❌ Savings plan failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Savings plan error: {e}")
        return False

def test_budget_analysis():
    """Test the budget analysis functionality"""
    print("\n📊 Testing budget analysis...")
    try:
        payload = {
            "income": 5000,
            "expenses": {
                "Rent": 1500,
                "Food": 500,
                "Transport": 300,
                "Entertainment": 200
            },
            "goals": ["Emergency Fund", "Vacation"]
        }
        
        response = requests.post(
            'http://localhost:5000/api/ai/budget-analysis',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Budget analysis test passed!")
            print(f"💰 Analysis: {data['advice'][:200]}...")
            return True
        else:
            print(f"❌ Budget analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Budget analysis error: {e}")
        return False

def test_quick_tips():
    """Test the quick tips endpoint"""
    print("\n💡 Testing quick tips...")
    try:
        response = requests.get('http://localhost:5000/api/ai/quick-tips')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Quick tips test passed!")
            print(f"📚 Found {data['count']} tips")
            return True
        else:
            print(f"❌ Quick tips failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Quick tips error: {e}")
        return False

def run_demo_scenario():
    """Run a complete demo scenario"""
    print("\n🎭 Running Demo Scenario...")
    print("=" * 50)
    
    # Test all endpoints
    tests = [
        ("Health Check", test_health_endpoint),
        ("AI Chat", test_ai_chat),
        ("Savings Plan", test_savings_plan),
        ("Budget Analysis", test_budget_analysis),
        ("Quick Tips", test_quick_tips)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🧪 {test_name}...")
        if test_func():
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 50)
    print(f"🎯 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your AI is ready for demo day!")
        print("\n🚀 Demo Day Script:")
        print("1. Click the floating AI button (🤖)")
        print("2. Ask: 'How much should I save for a house?'")
        print("3. Show the personalized advice")
        print("4. Demonstrate the savings plan generator")
        print("5. Highlight the professional UI and animations")
    else:
        print("⚠️ Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    print("🤖 LoopFund AI Test Suite")
    print("Testing your AI Financial Advisor before demo day...")
    
    # Wait for backend to be ready
    print("\n⏳ Waiting for backend to start...")
    time.sleep(3)
    
    # Run all tests
    success = run_demo_scenario()
    
    if success:
        print("\n🎊 CONGRATULATIONS! Your AI is ready to impress investors!")
    else:
        print("\n🔧 Please fix the issues above before demo day.")
