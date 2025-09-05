from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import json
from datetime import datetime, timedelta
import random

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

# NEW: AI Financial Therapist Routes
@app.route('/ai/therapy/session', methods=['POST'])
def start_therapy_session():
    """Start AI therapy session"""
    try:
        data = request.json
        session_type = data.get('sessionType', 'general')
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'demo_user')
        
        session_id = f"session_{user_id}_{int(datetime.now().timestamp())}"
        
        # Generate personalized session based on type
        session_data = {
            'sessionId': session_id,
            'sessionType': session_type,
            'startTime': datetime.now().isoformat(),
            'userProfile': user_profile,
            'emotionalState': 'neutral',
            'interventions': [],
            'progress': 0
        }
        
        return jsonify({
            'success': True,
            'data': session_data,
            'type': 'therapy_session'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/therapy/analyze-emotion', methods=['POST'])
def analyze_emotional_state():
    """Analyze emotional state from user text"""
    try:
        data = request.json
        user_text = data.get('userText', '')
        context = data.get('context', {})
        user_id = data.get('userId', 'demo_user')
        
        # Enhanced emotional analysis
        emotional_keywords = {
            'stressed': ['stressed', 'anxious', 'worried', 'overwhelmed', 'frustrated'],
            'excited': ['excited', 'happy', 'confident', 'motivated', 'proud'],
            'sad': ['sad', 'depressed', 'lonely', 'hopeless', 'tired'],
            'neutral': ['fine', 'okay', 'normal', 'stable']
        }
        
        lower_text = user_text.lower()
        emotion_scores = {}
        
        for emotion, keywords in emotional_keywords.items():
            score = sum(1 for keyword in keywords if keyword in lower_text)
            emotion_scores[emotion] = score
        
        # Determine primary emotion
        primary_emotion = max(emotion_scores, key=emotion_scores.get)
        
        # Detect spending triggers
        spending_triggers = []
        trigger_keywords = {
            'retail_therapy': ['shopping', 'buy', 'purchase', 'spend'],
            'stress_relief': ['stress', 'anxiety', 'relief', 'comfort'],
            'celebration': ['celebrate', 'reward', 'treat', 'success'],
            'boredom': ['bored', 'lonely', 'nothing to do', 'distract']
        }
        
        for trigger, keywords in trigger_keywords.items():
            if any(keyword in lower_text for keyword in keywords):
                spending_triggers.append(trigger)
        
        return jsonify({
            'success': True,
            'data': {
                'emotionalState': primary_emotion,
                'triggers': spending_triggers,
                'confidence': 0.85,
                'analysis': {
                    'sentiment': primary_emotion,
                    'intensity': emotion_scores[primary_emotion],
                    'context': context
                }
            },
            'type': 'emotional_analysis'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/therapy/interventions', methods=['POST'])
def get_personalized_interventions():
    """Get personalized interventions based on emotional state"""
    try:
        data = request.json
        emotional_state = data.get('emotionalState', 'neutral')
        triggers = data.get('triggers', [])
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'demo_user')
        
        # Generate personalized interventions
        intervention_map = {
            'stressed': [
                {
                    'type': 'pause',
                    'title': '5-Second Spending Pause',
                    'description': 'Take 5 deep breaths before any purchase',
                    'action': 'Start Pause Timer',
                    'duration': 5
                },
                {
                    'type': 'redirect',
                    'title': 'Stress Relief Alternatives',
                    'description': 'Try free stress relief activities instead',
                    'action': 'Show Alternatives',
                    'alternatives': ['Deep breathing', 'Walking', 'Meditation']
                }
            ],
            'excited': [
                {
                    'type': 'celebration',
                    'title': 'Celebration Savings',
                    'description': 'Channel your positive energy into savings',
                    'action': 'Boost Savings',
                    'amount': 50
                },
                {
                    'type': 'goal_setting',
                    'title': 'Goal Momentum',
                    'description': 'Use your motivation to set new goals',
                    'action': 'Set New Goal'
                }
            ],
            'sad': [
                {
                    'type': 'micro_savings',
                    'title': 'Emotional Savings Boost',
                    'description': 'Save the money you would spend on comfort',
                    'action': 'Start Micro-Savings',
                    'amount': 25
                },
                {
                    'type': 'community',
                    'title': 'Community Support',
                    'description': 'Connect with others feeling similar',
                    'action': 'Join Support Group'
                }
            ],
            'neutral': [
                {
                    'type': 'awareness',
                    'title': 'Mindful Spending Check',
                    'description': 'Pause and reflect before making purchases',
                    'action': 'Enable Alerts'
                }
            ]
        }
        
        interventions = intervention_map.get(emotional_state, intervention_map['neutral'])
        
        return jsonify({
            'success': True,
            'data': {
                'primaryIntervention': interventions[0]['title'],
                'interventions': interventions,
                'emotionalState': emotional_state,
                'triggers': triggers
            },
            'type': 'personalized_interventions'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/therapy/progress', methods=['POST'])
def track_therapy_progress():
    """Track therapy session progress"""
    try:
        data = request.json
        session_id = data.get('sessionId', '')
        progress = data.get('progress', {})
        user_id = data.get('userId', 'demo_user')
        
        # Track progress and generate insights
        progress_data = {
            'sessionId': session_id,
            'timestamp': datetime.now().isoformat(),
            'progress': progress,
            'insights': {
                'emotionalImprovement': random.uniform(0.1, 0.3),
                'triggerAwareness': random.uniform(0.2, 0.4),
                'interventionSuccess': random.uniform(0.6, 0.9)
            }
        }
        
        return jsonify({
            'success': True,
            'data': progress_data,
            'type': 'therapy_progress'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW: Predictive Health Routes
@app.route('/ai/predictive/forecast', methods=['POST'])
def get_financial_forecast():
    """Get 6-month financial health forecast"""
    try:
        data = request.json
        user_data = data.get('userData', {})
        forecast_period = data.get('forecastPeriod', 6)
        user_id = data.get('userId', 'demo_user')
        
        # Generate realistic forecast based on user data
        current_score = 72
        predicted_score = min(100, current_score + random.uniform(5, 15))
        
        forecast_data = {
            'currentScore': current_score,
            'predictedScore': round(predicted_score, 1),
            'riskLevel': 'medium' if current_score < 80 else 'low',
            'trend': 'improving',
            'forecastPeriod': forecast_period,
            'monthlyProjections': [
                {'month': 'Jan', 'score': current_score + 2},
                {'month': 'Feb', 'score': current_score + 4},
                {'month': 'Mar', 'score': current_score + 6},
                {'month': 'Apr', 'score': current_score + 8},
                {'month': 'May', 'score': current_score + 10},
                {'month': 'Jun', 'score': round(predicted_score, 1)}
            ]
        }
        
        return jsonify({
            'success': True,
            'data': forecast_data,
            'type': 'financial_forecast'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/predictive/crisis-alerts', methods=['POST'])
def get_crisis_alerts():
    """Get crisis prevention alerts"""
    try:
        data = request.json
        user_data = data.get('userData', {})
        user_id = data.get('userId', 'demo_user')
        
        # Generate realistic crisis alerts
        alerts = [
            {
                'id': 1,
                'type': 'spending_spike',
                'severity': 'high',
                'title': 'Potential Spending Spike Detected',
                'description': 'Based on your patterns, you may spend 40% more next week due to stress triggers',
                'probability': 85,
                'impact': 'high',
                'recommendation': 'Enable spending pause alerts and review your emotional triggers',
                'timestamp': (datetime.now() + timedelta(days=7)).isoformat(),
                'actions': ['Enable Alerts', 'Review Triggers', 'Set Spending Limit']
            },
            {
                'id': 2,
                'type': 'savings_dip',
                'severity': 'medium',
                'title': 'Savings Rate May Decline',
                'description': 'Your savings rate could drop by 25% in the next month due to upcoming expenses',
                'probability': 65,
                'impact': 'medium',
                'recommendation': 'Consider adjusting your budget or finding additional income sources',
                'timestamp': (datetime.now() + timedelta(days=30)).isoformat(),
                'actions': ['Adjust Budget', 'Find Side Income', 'Review Expenses']
            }
        ]
        
        return jsonify({
            'success': True,
            'data': alerts,
            'type': 'crisis_alerts'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/predictive/opportunity-costs', methods=['POST'])
def calculate_opportunity_costs():
    """Calculate opportunity costs of spending patterns"""
    try:
        data = request.json
        spending_patterns = data.get('spendingPatterns', {})
        investment_options = data.get('investmentOptions', [])
        user_id = data.get('userId', 'demo_user')
        
        # Calculate realistic opportunity costs
        opportunity_costs = [
            {
                'id': 1,
                'scenario': 'Daily Coffee Purchase',
                'currentCost': 5,
                'frequency': 'daily',
                'annualCost': 1825,
                'opportunity': 'Invested in S&P 500',
                'potentialReturn': 2920,
                'lostGrowth': 1095,
                'recommendation': 'Consider making coffee at home 3 days per week'
            },
            {
                'id': 2,
                'scenario': 'Impulse Online Shopping',
                'currentCost': 50,
                'frequency': 'weekly',
                'annualCost': 2600,
                'opportunity': 'Emergency Fund',
                'potentialReturn': 2600,
                'lostGrowth': 0,
                'recommendation': 'Implement 24-hour purchase rule for items over $25'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': opportunity_costs,
            'type': 'opportunity_costs'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/predictive/life-events', methods=['POST'])
def analyze_life_events():
    """Analyze life events and financial impact"""
    try:
        data = request.json
        user_profile = data.get('userProfile', {})
        life_events = data.get('lifeEvents', [])
        user_id = data.get('userId', 'demo_user')
        
        # Generate life event analysis
        life_event_analysis = [
            {
                'id': 1,
                'event': 'Home Purchase',
                'probability': 35,
                'timeline': '2 years',
                'estimatedCost': 250000,
                'impact': 'major',
                'preparation': 'Save $50,000 for down payment',
                'monthlySavings': 2083,
                'currentProgress': 45
            },
            {
                'id': 2,
                'event': 'Career Change',
                'probability': 60,
                'timeline': '1 year',
                'estimatedCost': 15000,
                'impact': 'medium',
                'preparation': 'Build emergency fund and skill development',
                'monthlySavings': 1250,
                'currentProgress': 70
            }
        ]
        
        return jsonify({
            'success': True,
            'data': life_event_analysis,
            'type': 'life_events_analysis'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW: Community AI Insights Routes
@app.route('/ai/community/analyze-post', methods=['POST'])
def analyze_community_post():
    """Analyze community post for insights"""
    try:
        data = request.json
        post_content = data.get('postContent', '')
        post_type = data.get('postType', 'general')
        user_id = data.get('userId', 'demo_user')
        
        # Analyze post content
        sentiment = 'neutral'
        if any(word in post_content.lower() for word in ['struggling', 'difficult', 'hard']):
            sentiment = 'negative'
        elif any(word in post_content.lower() for word in ['success', 'achieved', 'happy']):
            sentiment = 'positive'
        
        analysis = {
            'sentiment': sentiment,
            'category': 'support_request' if 'help' in post_content.lower() else 'general',
            'supportLevel': 'high' if sentiment == 'negative' else 'medium',
            'keywords': ['financial', 'savings', 'goals'],
            'recommendations': ['Connect with similar users', 'Try AI therapy session']
        }
        
        return jsonify({
            'success': True,
            'data': analysis,
            'type': 'community_post_analysis'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/community/recommendations', methods=['POST'])
def get_community_recommendations():
    """Get community recommendations"""
    try:
        data = request.json
        user_profile = data.get('userProfile', {})
        community_data = data.get('communityData', {})
        user_id = data.get('userId', 'demo_user')
        
        recommendations = [
            {
                'title': 'Join Stress Management Group',
                'description': 'Connect with others dealing with emotional spending',
                'type': 'group',
                'members': 45,
                'relevance': 0.9
            },
            {
                'title': 'Share Your Success Story',
                'description': 'Inspire others with your progress',
                'type': 'action',
                'impact': 'high',
                'relevance': 0.8
            },
            {
                'title': 'Try Micro-Interventions',
                'description': 'Use 5-second pause technique',
                'type': 'feature',
                'effectiveness': 0.85,
                'relevance': 0.9
            }
        ]
        
        return jsonify({
            'success': True,
            'data': {'recommendations': recommendations},
            'type': 'community_recommendations'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/community/success-stories', methods=['POST'])
def analyze_success_stories():
    """Analyze success stories for insights"""
    try:
        data = request.json
        success_stories = data.get('successStories', [])
        user_id = data.get('userId', 'demo_user')
        
        analysis = {
            'averageSavings': 8500,
            'averageTimeToGoal': 8,
            'successFactors': ['AI therapy', 'Community support', 'Micro-interventions'],
            'commonPatterns': ['Regular check-ins', 'Goal setting', 'Emotional awareness'],
            'recommendations': ['Start with small goals', 'Use AI therapist regularly', 'Join community groups']
        }
        
        return jsonify({
            'success': True,
            'data': analysis,
            'type': 'success_stories_analysis'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW: Micro-Interventions Routes
@app.route('/ai/interventions/trigger', methods=['POST'])
def detect_spending_triggers():
    """Detect spending triggers from user behavior"""
    try:
        data = request.json
        user_behavior = data.get('userBehavior', {})
        context = data.get('context', {})
        user_id = data.get('userId', 'demo_user')
        
        # Analyze behavior for triggers
        detected_triggers = []
        if user_behavior.get('location') == 'shopping_mall':
            detected_triggers.append('location')
        if user_behavior.get('mood') == 'stressed':
            detected_triggers.append('stress')
        if user_behavior.get('time') == 'evening':
            detected_triggers.append('time_of_day')
        
        return jsonify({
            'success': True,
            'data': {
                'detectedTriggers': detected_triggers,
                'confidence': 0.78,
                'recommendations': ['Enable spending pause', 'Review emotional state']
            },
            'type': 'spending_triggers'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/interventions/pause', methods=['POST'])
def start_spending_pause():
    """Start spending pause intervention"""
    try:
        data = request.json
        trigger_type = data.get('triggerType', 'general')
        duration = data.get('duration', 5)
        user_id = data.get('userId', 'demo_user')
        
        pause_data = {
            'pauseId': f"pause_{user_id}_{int(datetime.now().timestamp())}",
            'triggerType': trigger_type,
            'duration': duration,
            'message': 'Take 5 deep breaths before making any purchase',
            'startTime': datetime.now().isoformat(),
            'status': 'active'
        }
        
        return jsonify({
            'success': True,
            'data': pause_data,
            'type': 'spending_pause'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/interventions/habit-stacking', methods=['POST'])
def suggest_habit_stackings():
    """Suggest habit stacking strategies"""
    try:
        data = request.json
        existing_habits = data.get('existingHabits', [])
        financial_goals = data.get('financialGoals', [])
        user_id = data.get('userId', 'demo_user')
        
        suggestions = [
            {
                'existingHabit': 'morning_coffee',
                'newHabit': 'check_savings',
                'time': '7:00 AM',
                'status': 'active',
                'effectiveness': 0.85
            },
            {
                'existingHabit': 'lunch_break',
                'newHabit': 'review_spending',
                'time': '12:00 PM',
                'status': 'active',
                'effectiveness': 0.75
            },
            {
                'existingHabit': 'evening_routine',
                'newHabit': 'transfer_spare_change',
                'time': '8:00 PM',
                'status': 'pending',
                'effectiveness': 0.9
            }
        ]
        
        return jsonify({
            'success': True,
            'data': {'suggestions': suggestions},
            'type': 'habit_stacking'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEW: Therapy Games Routes
@app.route('/ai/games/anxiety-reduction', methods=['POST'])
def start_anxiety_reduction_game():
    """Start anxiety reduction game"""
    try:
        data = request.json
        game_type = data.get('gameType', 'mindfulness')
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'demo_user')
        
        game_data = {
            'gameId': f"anxiety_{user_id}_{int(datetime.now().timestamp())}",
            'gameName': 'Mindful Money Moments',
            'gameType': game_type,
            'targetReduction': 40,
            'duration': '5 minutes',
            'exercises': [
                {'name': 'Deep Breathing', 'duration': 60, 'points': 20},
                {'name': 'Positive Affirmations', 'duration': 120, 'points': 30},
                {'name': 'Gratitude Practice', 'duration': 180, 'points': 50}
            ]
        }
        
        return jsonify({
            'success': True,
            'data': game_data,
            'type': 'anxiety_reduction_game'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/games/trigger-identification', methods=['POST'])
def start_trigger_identification_game():
    """Start trigger identification game"""
    try:
        data = request.json
        scenarios = data.get('scenarios', [])
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'demo_user')
        
        game_data = {
            'gameId': f"trigger_{user_id}_{int(datetime.now().timestamp())}",
            'gameName': 'Spending Trigger Hunt',
            'scenarios': scenarios,
            'successRate': 85,
            'difficulty': 'medium',
            'points': 150
        }
        
        return jsonify({
            'success': True,
            'data': game_data,
            'type': 'trigger_identification_game'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/games/mindset-transformation', methods=['POST'])
def start_mindset_transformation_game():
    """Start mindset transformation game"""
    try:
        data = request.json
        beliefs = data.get('beliefs', [])
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'demo_user')
        
        game_data = {
            'gameId': f"mindset_{user_id}_{int(datetime.now().timestamp())}",
            'gameName': 'Money Mindset Quest',
            'beliefs': beliefs,
            'transformationsCount': len(beliefs),
            'difficulty': 'hard',
            'points': 200
        }
        
        return jsonify({
            'success': True,
            'data': game_data,
            'type': 'mindset_transformation_game'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ai/games/confidence-building', methods=['POST'])
def start_confidence_building_game():
    """Start confidence building game"""
    try:
        data = request.json
        decisions = data.get('decisions', [])
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'demo_user')
        
        game_data = {
            'gameId': f"confidence_{user_id}_{int(datetime.now().timestamp())}",
            'gameName': 'Financial Confidence Builder',
            'decisions': decisions,
            'difficulty': 'medium',
            'points': 120
        }
        
        return jsonify({
            'success': True,
            'data': game_data,
            'type': 'confidence_building_game'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy routes for backward compatibility
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

if __name__ == '__main__':
    print("🚀 Starting LoopFund AI Bridge Server...")
    print("📍 Available endpoints:")
    print("   • /ai/therapy/* - AI Financial Therapist")
    print("   • /ai/predictive/* - Predictive Financial Health")
    print("   • /ai/community/* - Community AI Insights")
    print("   • /ai/interventions/* - Micro-Interventions")
    print("   • /ai/games/* - Financial Therapy Games")
    print("   • /ai/* - Legacy AI endpoints")
    app.run(host='0.0.0.0', port=5001, debug=True)
