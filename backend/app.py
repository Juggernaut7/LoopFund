from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from datetime import datetime

# Add the AI module to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai'))

from ai.financial_advisor import FinancialAdvisor

app = Flask(__name__)
CORS(app)

# Initialize the AI Financial Advisor
try:
    advisor = FinancialAdvisor()
    print("🚀 AI Financial Advisor loaded successfully!")
except Exception as e:
    print(f"❌ Error loading AI: {e}")
    advisor = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ai_service': 'available' if advisor else 'unavailable',
        'service': 'LoopFund AI Backend'
    })

@app.route('/api/ai/advice', methods=['POST'])
def get_ai_advice():
    """Get AI-powered financial advice"""
    try:
        data = request.json
        user_query = data.get('query', '')
        user_profile = data.get('user_profile', {})
        
        if not user_query:
            return jsonify({'error': 'Query is required'}), 400
        
        if not advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        # Get AI advice
        advice = advisor.get_financial_advice(user_query, user_profile)
        
        return jsonify({
            'success': True,
            'advice': advice,
            'query': user_query,
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        print(f"Error in advice endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/ai/savings-plan', methods=['POST'])
def get_savings_plan():
    """Get AI-generated savings plan"""
    try:
        data = request.json
        goal_amount = float(data.get('goal_amount', 0))
        timeline_months = int(data.get('timeline_months', 12))
        monthly_income = float(data.get('monthly_income', 0))
        monthly_expenses = float(data.get('monthly_expenses', 0))
        
        if not all([goal_amount, timeline_months, monthly_income, monthly_expenses]):
            return jsonify({'error': 'All parameters are required'}), 400
        
        if not advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        # Get savings plan
        plan = advisor.get_savings_plan(
            goal_amount, 
            timeline_months, 
            monthly_income, 
            monthly_expenses
        )
        
        return jsonify({
            'success': True,
            'plan': plan,
            'parameters': {
                'goal_amount': goal_amount,
                'timeline_months': timeline_months,
                'monthly_income': monthly_income,
                'monthly_expenses': monthly_expenses
            },
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        print(f"Error in savings plan endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/ai/budget-analysis', methods=['POST'])
def get_budget_analysis():
    """Get AI-powered budget analysis"""
    try:
        data = request.json
        income = float(data.get('income', 0))
        expenses = data.get('expenses', {})
        goals = data.get('goals', [])
        
        if not income or not expenses:
            return jsonify({'error': 'Income and expenses are required'}), 400
        
        if not advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        # Get budget advice
        advice = advisor.get_budget_advice(income, expenses, goals)
        
        return jsonify({
            'success': True,
            'advice': advice,
            'analysis': {
                'total_expenses': sum(expenses.values()),
                'savings_rate': ((income - sum(expenses.values())) / income) * 100 if income > 0 else 0
            },
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        print(f"Error in budget analysis endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/ai/investment-advice', methods=['POST'])
def get_investment_advice():
    """Get AI-powered investment advice"""
    try:
        data = request.json
        age = int(data.get('age', 25))
        risk_tolerance = data.get('risk_tolerance', 'moderate')
        investment_amount = float(data.get('investment_amount', 1000))
        
        if not all([age, investment_amount]):
            return jsonify({'error': 'Age and investment amount are required'}), 400
        
        if not advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        # Get investment advice
        advice = advisor.get_investment_advice(age, risk_tolerance, investment_amount)
        
        return jsonify({
            'success': True,
            'advice': advice,
            'parameters': {
                'age': age,
                'risk_tolerance': risk_tolerance,
                'investment_amount': investment_amount
            },
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        print(f"Error in investment advice endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/ai/quick-tips', methods=['GET'])
def get_quick_tips():
    """Get quick financial tips"""
    tips = [
        "💰 Pay yourself first - save 20% of your income before spending",
        "📊 Track your expenses for 30 days to identify spending patterns",
        "🎯 Set SMART financial goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
        "💳 Use credit cards responsibly - pay off the full balance each month",
        "🏦 Build an emergency fund covering 3-6 months of expenses",
        "📈 Start investing early - compound interest is your friend",
        "🎉 Celebrate small financial wins to stay motivated",
        "📱 Use apps like LoopFund to automate your savings",
        "🏠 Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
        "🔄 Review and adjust your financial plan quarterly"
    ]
    
    return jsonify({
        'success': True,
        'tips': tips,
        'count': len(tips)
    })

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """General AI chat endpoint for financial questions"""
    try:
        data = request.json
        message = data.get('message', '')
        conversation_history = data.get('history', [])
        user_context = data.get('user_context', {})
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        # Build context from conversation history
        context = ""
        if conversation_history:
            context = "Previous conversation:\n" + "\n".join([
                f"User: {msg['user']}\nAI: {msg['ai']}" 
                for msg in conversation_history[-3:]  # Last 3 messages
            ]) + "\n\n"
        
        # Add user context
        if user_context:
            context += f"User Context: {user_context}\n\n"
        
        # Combine with current message
        full_query = context + f"Current question: {message}"
        
        # Get AI response
        response = advisor.get_financial_advice(full_query, user_context)
        
        return jsonify({
            'success': True,
            'response': response,
            'message': message,
            'timestamp': str(datetime.now())
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting LoopFund AI Backend...")
    print("📱 AI Financial Advisor: Ready to help with your finances!")
    print("🌐 Server will run on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
