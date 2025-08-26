#!/usr/bin/env python3
"""
Test script for AI Bridge Service
Run this to verify your AI models are working correctly
"""

import requests
import json

def test_ai_bridge():
    """Test the AI bridge service endpoints"""
    base_url = "http://localhost:5001"
    
    print("🧪 Testing AI Bridge Service...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("\n1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/ai/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health Check: PASSED")
            print(f"   Status: {data['status']}")
            print(f"   Services: {data['services']}")
        else:
            print("❌ Health Check: FAILED")
            print(f"   Status Code: {response.status_code}")
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
    
    # Test 2: Financial Advice
    print("\n2️⃣ Testing Financial Advice...")
    try:
        test_query = "How much should I save each month if my goal is $5,000 in 10 months?"
        payload = {
            "query": test_query,
            "userProfile": {
                "income": 5000,
                "age": 25,
                "current_savings": 1000
            }
        }
        
        response = requests.post(f"{base_url}/ai/financial-advice", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Financial Advice: PASSED")
            print(f"   Success: {data.get('success', False)}")
            print(f"   Response Length: {len(data.get('data', ''))} characters")
            print(f"   Sample Response: {data.get('data', '')[:100]}...")
        else:
            print("❌ Financial Advice: FAILED")
            print(f"   Status Code: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Financial Advice Error: {e}")
    
    # Test 3: Savings Prediction
    print("\n3️⃣ Testing Savings Prediction...")
    try:
        payload = {
            "userData": {
                "goal_amount": 5000,
                "current_savings": 1000,
                "monthly_income": 5000,
                "monthly_expenses": 3000
            }
        }
        
        response = requests.post(f"{base_url}/ai/savings-prediction", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Savings Prediction: PASSED")
            print(f"   Success: {data.get('success', False)}")
            if data.get('prediction'):
                print(f"   Months to Goal: {data['prediction'].get('months_to_goal', 'N/A')}")
        else:
            print("❌ Savings Prediction: FAILED")
            print(f"   Status Code: {response.status_code}")
    except Exception as e:
        print(f"❌ Savings Prediction Error: {e}")
    
    # Test 4: Behavioral Analysis
    print("\n4️⃣ Testing Behavioral Analysis...")
    try:
        payload = {
            "userText": "I want to save more money but I keep spending on shopping",
            "userHistory": [
                {"type": "contribution", "amount": 100},
                {"type": "goal", "status": "active"}
            ]
        }
        
        response = requests.post(f"{base_url}/ai/behavioral-analysis", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Behavioral Analysis: PASSED")
            print(f"   Success: {data.get('success', False)}")
        else:
            print("❌ Behavioral Analysis: FAILED")
            print(f"   Status Code: {response.status_code}")
    except Exception as e:
        print(f"❌ Behavioral Analysis Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Testing Complete!")

if __name__ == "__main__":
    test_ai_bridge()
