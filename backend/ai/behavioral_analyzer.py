import json
import re
from datetime import datetime, timedelta

class BehavioralAnalyzer:
    def __init__(self):
        """Initialize the AI Behavioral Analyzer"""
        print("✅ AI Behavioral Analyzer initialized successfully!")
    
    def analyze(self, userText, userHistory):
        """Analyze user behavior patterns and provide insights"""
        try:
            # Analyze spending patterns from text
            spending_insights = self._analyzeSpendingPatterns(userText)
            
            # Analyze savings behavior
            savings_insights = self._analyzeSavingsBehavior(userHistory)
            
            # Generate behavioral recommendations
            recommendations = self._generateRecommendations(spending_insights, savings_insights)
            
            return {
                "success": True,
                "analysis": {
                    "spending_patterns": spending_insights,
                    "savings_behavior": savings_insights,
                    "recommendations": recommendations,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error analyzing behavior: {str(e)}"
            }
    
    def _analyzeSpendingPatterns(self, userText):
        """Analyze spending patterns from user text"""
        insights = []
        
        # Look for spending-related keywords
        spending_keywords = ['spend', 'bought', 'purchase', 'expense', 'cost', 'price', 'shopping']
        saving_keywords = ['save', 'budget', 'cut', 'reduce', 'limit']
        
        text_lower = userText.lower()
        
        # Analyze spending vs saving language
        spending_count = sum(1 for word in spending_keywords if word in text_lower)
        saving_count = sum(1 for word in saving_keywords if word in text_lower)
        
        if spending_count > saving_count:
            insights.append("💸 Your language suggests a spending-focused mindset")
            insights.append("💡 Consider reframing goals in terms of what you're saving for")
        elif saving_count > spending_count:
            insights.append("💰 Your language shows a savings-focused mindset")
            insights.append("🌟 Great job maintaining this perspective!")
        else:
            insights.append("⚖️ Balanced approach to spending and saving")
        
        # Look for emotional spending indicators
        emotional_words = ['stress', 'bored', 'sad', 'excited', 'impulse', 'treat']
        emotional_count = sum(1 for word in emotional_words if word in text_lower)
        
        if emotional_count > 0:
            insights.append("😊 Be mindful of emotional spending triggers")
            insights.append("💡 Try the 24-hour rule for non-essential purchases")
        
        # Look for budget awareness
        if any(word in text_lower for word in ['budget', 'plan', 'track']):
            insights.append("📊 You're showing good budget awareness")
        else:
            insights.append("📝 Consider tracking your spending to identify patterns")
        
        return insights
    
    def _analyzeSavingsBehavior(self, userHistory):
        """Analyze savings behavior from user history"""
        insights = []
        
        if not userHistory or len(userHistory) == 0:
            insights.append("🆕 Welcome! Let's start building your savings habits")
            return insights
        
        # Analyze contribution frequency
        recent_contributions = [h for h in userHistory if h.get('type') == 'contribution']
        
        if len(recent_contributions) >= 3:
            insights.append("🎯 Consistent savings behavior detected")
            insights.append("💪 You're building great financial habits")
        elif len(recent_contributions) >= 1:
            insights.append("👍 Good start with savings")
            insights.append("🔄 Try to make savings a regular habit")
        else:
            insights.append("💡 Consider setting up automatic savings transfers")
        
        # Analyze goal progress
        goals = [h for h in userHistory if h.get('type') == 'goal']
        if goals:
            active_goals = [g for g in goals if g.get('status') == 'active']
            completed_goals = [g for g in goals if g.get('status') == 'completed']
            
            if completed_goals:
                insights.append("🏆 You've successfully completed financial goals")
                insights.append("🌟 Celebrate your achievements!")
            
            if active_goals:
                insights.append(f"🎯 You have {len(active_goals)} active savings goals")
                insights.append("📈 Keep pushing toward your targets")
        
        return insights
    
    def _generateRecommendations(self, spending_insights, savings_insights):
        """Generate personalized behavioral recommendations"""
        recommendations = []
        
        # Spending recommendations
        if any("spending-focused" in insight for insight in spending_insights):
            recommendations.append("💡 Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings")
            recommendations.append("📱 Use LoopFund to track your spending categories")
        
        if any("emotional" in insight for insight in spending_insights):
            recommendations.append("🧘 Practice mindful spending - pause before purchases")
            recommendations.append("📝 Keep a spending journal to identify triggers")
        
        # Savings recommendations
        if any("consistent" in insight for insight in savings_insights):
            recommendations.append("🚀 Consider increasing your monthly savings amount")
            recommendations.append("🎯 Set more ambitious financial goals")
        
        if any("automatic" in insight for insight in savings_insights):
            recommendations.append("⚡ Set up automatic transfers on payday")
            recommendations.append("🎉 Make saving invisible and automatic")
        
        # General recommendations
        recommendations.append("📊 Review your progress weekly to stay motivated")
        recommendations.append("🎯 Break large goals into smaller milestones")
        recommendations.append("💪 Remember: consistency beats perfection")
        
        return recommendations
