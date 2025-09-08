# LoopFund Revolutionary Features Demo Script
# This script demonstrates the AI-powered financial wellness platform

import requests
import json
import time
from datetime import datetime, timedelta

class LoopFundDemo:
    def __init__(self):
        self.base_url = "http://localhost:3000"  # Frontend URL
        self.api_url = "http://localhost:5000"  # Backend URL
        self.ai_bridge_url = "http://localhost:5001"  # AI Bridge URL
        
    def run_demo(self):
        print("🚀 LoopFund Revolutionary Features Demo")
        print("=" * 50)
        
        # Demo user data
        demo_user = {
            "userId": "demo_user_001",
            "name": "Sarah Johnson",
            "email": "sarah@demo.com",
            "financialProfile": {
                "income": 65000,
                "expenses": 45000,
                "savings": 15000,
                "debt": 25000,
                "goals": [
                    {"name": "Emergency Fund", "target": 25000, "current": 15000},
                    {"name": "Home Down Payment", "target": 50000, "current": 5000},
                    {"name": "Vacation Fund", "target": 8000, "current": 2000}
                ]
            }
        }
        
        print(f"👤 Demo User: {demo_user['name']}")
        print(f"💰 Income: ${demo_user['financialProfile']['income']:,}")
        print(f"💸 Expenses: ${demo_user['financialProfile']['expenses']:,}")
        print(f"🏦 Savings: ${demo_user['financialProfile']['savings']:,}")
        print()
        
        # 1. AI Financial Therapist Demo
        self.demo_ai_therapist(demo_user)
        
        # 2. Predictive Financial Health Demo
        self.demo_predictive_health(demo_user)
        
        # 3. Behavioral Micro-Interventions Demo
        self.demo_micro_interventions(demo_user)
        
        # 4. Financial Therapy Games Demo
        self.demo_therapy_games(demo_user)
        
        # 5. Community Features Demo
        self.demo_community_features(demo_user)
        
        print("\n🎉 Demo Completed Successfully!")
        print("LoopFund is ready for grant presentation!")
        
    def demo_ai_therapist(self, user):
        print("🧠 AI Financial Therapist Demo")
        print("-" * 30)
        
        # Simulate emotional spending analysis
        emotional_texts = [
            "I'm feeling really stressed about work and want to buy something to feel better",
            "I'm so excited about my promotion, I want to celebrate with a big purchase",
            "I'm feeling lonely and want to shop online to distract myself"
        ]
        
        for i, text in enumerate(emotional_texts, 1):
            print(f"📝 User Input {i}: {text}")
            
            # Analyze emotional state
            analysis = self.analyze_emotional_state(text, user)
            print(f"🎭 Detected Emotion: {analysis['emotionalState']}")
            print(f"⚠️  Spending Triggers: {', '.join(analysis['triggers'])}")
            
            # Get personalized interventions
            interventions = self.get_personalized_interventions(
                analysis['emotionalState'], 
                analysis['triggers'], 
                user
            )
            print(f"💡 Recommended Intervention: {interventions['primaryIntervention']}")
            print()
            
    def demo_predictive_health(self, user):
        print("🔮 Predictive Financial Health Demo")
        print("-" * 35)
        
        # Get 6-month forecast
        forecast = self.get_financial_forecast(user['financialProfile'], 6)
        print(f"📊 Current Health Score: {forecast['currentScore']}/100")
        print(f"📈 Predicted Score (6 months): {forecast['predictedScore']}/100")
        print(f"📉 Risk Level: {forecast['riskLevel']}")
        
        # Get crisis alerts
        alerts = self.get_crisis_alerts(user['financialProfile'])
        print(f"\n🚨 Active Crisis Alerts: {len(alerts)}")
        for alert in alerts[:2]:  # Show first 2 alerts
            print(f"   • {alert['title']} (Probability: {alert['probability']}%)")
            
        # Calculate opportunity costs
        opportunity_costs = self.calculate_opportunity_costs(
            user['financialProfile']['expenses'],
            ["S&P 500", "High-Yield Savings", "Emergency Fund"]
        )
        print(f"\n💡 Opportunity Cost Analysis:")
        print(f"   • Daily coffee habit: ${opportunity_costs['dailyCoffee']:,} lost annually")
        print(f"   • Impulse shopping: ${opportunity_costs['impulseShopping']:,} lost annually")
        print()
        
    def demo_micro_interventions(self, user):
        print("🛡️ Behavioral Micro-Interventions Demo")
        print("-" * 35)
        
        # Detect spending triggers
        triggers = self.detect_spending_triggers(
            {"location": "shopping_mall", "time": "evening", "mood": "stressed"},
            {"recentExpenses": 500, "budgetRemaining": 200}
        )
        print(f"🎯 Detected Triggers: {', '.join(triggers['detectedTriggers'])}")
        
        # Start spending pause
        pause = self.start_spending_pause("stress_shopping", 5)
        print(f"⏸️  Spending Pause Activated: {pause['duration']} seconds")
        print(f"💭 Pause Message: {pause['message']}")
        
        # Suggest habit stacking
        habits = self.suggest_habit_stackings(
            ["morning_coffee", "lunch_break", "evening_routine"],
            ["check_savings", "review_spending", "transfer_spare_change"]
        )
        print(f"\n🔄 Habit Stacking Suggestions:")
        for habit in habits['suggestions']:
            print(f"   • {habit['existingHabit']} → {habit['newHabit']}")
        print()
        
    def demo_therapy_games(self, user):
        print("🎮 Financial Therapy Games Demo")
        print("-" * 30)
        
        # Anxiety reduction game
        anxiety_game = self.start_anxiety_reduction_game("mindfulness", user)
        print(f"🧘 Anxiety Reduction Game: {anxiety_game['gameName']}")
        print(f"🎯 Target: Reduce financial anxiety by {anxiety_game['targetReduction']}%")
        
        # Trigger identification game
        trigger_game = self.start_trigger_identification_game(
            ["work_stress", "celebration", "loneliness", "boredom"],
            user
        )
        print(f"🎯 Trigger Identification Game: {trigger_game['gameName']}")
        print(f"📊 Success Rate: {trigger_game['successRate']}%")
        
        # Mindset transformation game
        mindset_game = self.start_mindset_transformation_game(
            ["I'm bad with money", "I'll never be wealthy", "Money is evil"],
            user
        )
        print(f"✨ Mindset Transformation Game: {mindset_game['gameName']}")
        print(f"🔄 Transformations Available: {mindset_game['transformationsCount']}")
        print()
        
    def demo_community_features(self, user):
        print("👥 Financial Wellness Community Demo")
        print("-" * 35)
        
        # Analyze community post
        post_content = "I've been struggling with impulse buying when I'm stressed. Any advice?"
        post_analysis = self.analyze_community_post(post_content, "support_request")
        print(f"📝 Post Analysis:")
        print(f"   • Sentiment: {post_analysis['sentiment']}")
        print(f"   • Category: {post_analysis['category']}")
        print(f"   • Support Level: {post_analysis['supportLevel']}")
        
        # Get community recommendations
        recommendations = self.get_community_recommendations(user, {"posts": 150, "members": 1200})
        print(f"\n💡 Community Recommendations:")
        for rec in recommendations['recommendations'][:3]:
            print(f"   • {rec['title']}: {rec['description']}")
            
        # Analyze success stories
        success_stories = [
            "Saved $10,000 in 6 months using the AI therapist",
            "Reduced emotional spending by 60% with micro-interventions",
            "Achieved emergency fund goal with community support"
        ]
        stories_analysis = self.analyze_success_stories(success_stories)
        print(f"\n🏆 Success Stories Analysis:")
        print(f"   • Average Savings: ${stories_analysis['averageSavings']:,}")
        print(f"   • Time to Goal: {stories_analysis['averageTimeToGoal']} months")
        print(f"   • Key Success Factors: {', '.join(stories_analysis['successFactors'])}")
        print()
        
    # Helper methods to simulate API calls
    def analyze_emotional_state(self, text, user):
        return {
            "emotionalState": "stressed" if "stressed" in text.lower() else "excited" if "excited" in text.lower() else "neutral",
            "triggers": ["retail_therapy", "celebration", "comfort_seeking"],
            "confidence": 0.85
        }
        
    def get_personalized_interventions(self, emotional_state, triggers, user):
        interventions = {
            "stressed": {
                "primaryIntervention": "5-second spending pause with deep breathing",
                "secondaryInterventions": ["Stress relief alternatives", "Community support"]
            },
            "excited": {
                "primaryIntervention": "Channel positive energy into savings goals",
                "secondaryInterventions": ["Goal momentum", "Celebration savings"]
            },
            "neutral": {
                "primaryIntervention": "Mindful spending awareness",
                "secondaryInterventions": ["Budget review", "Goal check-in"]
            }
        }
        return interventions.get(emotional_state, interventions["neutral"])
        
    def get_financial_forecast(self, profile, months):
        return {
            "currentScore": 72,
            "predictedScore": 78,
            "riskLevel": "medium",
            "trend": "improving"
        }
        
    def get_crisis_alerts(self, profile):
        return [
            {"title": "Potential spending spike detected", "probability": 85, "severity": "high"},
            {"title": "Emergency fund goal at risk", "probability": 45, "severity": "medium"}
        ]
        
    def calculate_opportunity_costs(self, expenses, investment_options):
        return {
            "dailyCoffee": 1825,
            "impulseShopping": 2600,
            "subscriptions": 360
        }
        
    def detect_spending_triggers(self, behavior, context):
        return {
            "detectedTriggers": ["stress", "location", "time_of_day"],
            "confidence": 0.78
        }
        
    def start_spending_pause(self, trigger_type, duration):
        return {
            "duration": duration,
            "message": "Take 5 deep breaths before making any purchase"
        }
        
    def suggest_habit_stackings(self, existing_habits, financial_goals):
        return {
            "suggestions": [
                {"existingHabit": "morning_coffee", "newHabit": "check_savings"},
                {"existingHabit": "lunch_break", "newHabit": "review_spending"},
                {"existingHabit": "evening_routine", "newHabit": "transfer_spare_change"}
            ]
        }
        
    def start_anxiety_reduction_game(self, game_type, user):
        return {
            "gameName": "Mindful Money Moments",
            "targetReduction": 40,
            "duration": "5 minutes"
        }
        
    def start_trigger_identification_game(self, scenarios, user):
        return {
            "gameName": "Spending Trigger Hunt",
            "successRate": 85,
            "scenarios": len(scenarios)
        }
        
    def start_mindset_transformation_game(self, beliefs, user):
        return {
            "gameName": "Money Mindset Quest",
            "transformationsCount": len(beliefs),
            "difficulty": "medium"
        }
        
    def analyze_community_post(self, content, post_type):
        return {
            "sentiment": "neutral",
            "category": "support_request",
            "supportLevel": "high"
        }
        
    def get_community_recommendations(self, user, community_data):
        return {
            "recommendations": [
                {"title": "Join Stress Management Group", "description": "Connect with others dealing with emotional spending"},
                {"title": "Share Your Success Story", "description": "Inspire others with your progress"},
                {"title": "Try Micro-Interventions", "description": "Use 5-second pause technique"}
            ]
        }
        
    def analyze_success_stories(self, stories):
        return {
            "averageSavings": 8500,
            "averageTimeToGoal": 8,
            "successFactors": ["AI therapy", "Community support", "Micro-interventions"]
        }

if __name__ == "__main__":
    demo = LoopFundDemo()
    demo.run_demo() 