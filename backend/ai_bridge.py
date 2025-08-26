from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the AI module to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai'))

from ai.financial_advisor import FinancialAdvisor
from ai.savings_predictor import SavingsPredictor
from ai.behavioral_analyzer import BehavioralAnalyzer

app = Flask(__name__)
CORS(app)

# Initialize AI models
try:
    financial_advisor = FinancialAdvisor()
    savings_predictor = SavingsPredictor()
    behavioral_analyzer = BehavioralAnalyzer()
    print("✅ All AI models initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing AI models: {e}")
    financial_advisor = None
    savings_predictor = None
    behavioral_analyzer = None

@app.route('/ai/financial-advice', methods=['POST'])
def get_financial_advice():
    """Get AI financial advice"""
    try:
        data = request.json
        user_query = data.get('query', '')
        user_profile = data.get('userProfile', {})
        
        if not user_query:
            return jsonify({'error': 'Query is required'}), 400
        
        if not financial_advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        advice = financial_advisor.getAdvice(user_query, user_profile)
        
        return jsonify({
            'success': True,
            'data': advice,
            'type': 'financial_advice'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/savings-prediction', methods=['POST'])
def get_savings_prediction():
    """Get savings prediction"""
    try:
        data = request.json
        user_data = data.get('userData', {})
        
        if not savings_predictor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        prediction = savings_predictor.predictGoalCompletion(user_data)
        
        return jsonify(prediction)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/behavioral-analysis', methods=['POST'])
def get_behavioral_analysis():
    """Get behavioral analysis"""
    try:
        data = request.json
        user_text = data.get('userText', '')
        user_history = data.get('userHistory', [])
        
        if not behavioral_analyzer:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        analysis = behavioral_analyzer.analyze(user_text, user_history)
        
        return jsonify(analysis)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/goal-recommendations', methods=['POST'])
def get_goal_recommendations():
    """Get smart goal recommendations"""
    try:
        data = request.json
        user_profile = data.get('userProfile', {})
        
        if not financial_advisor:
            return jsonify({'error': 'AI service unavailable'}), 503
        
        recommendations = financial_advisor.recommendGoals(user_profile)
        
        return jsonify(recommendations)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/health', methods=['GET'])
def health_check():
    """Health check for AI services"""
    return jsonify({
        'status': 'healthy',
        'services': {
            'financial_advisor': financial_advisor is not None,
            'savings_predictor': savings_predictor is not None,
            'behavioral_analyzer': behavioral_analyzer is not None
        }
    })

if __name__ == '__main__':
    print("🚀 Starting AI Bridge Service...")
    print("📱 AI models are ready to serve!")
    print("🌐 Server will run on http://localhost:5001")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
