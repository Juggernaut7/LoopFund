import json
import re
from datetime import datetime, timedelta

class SavingsPredictor:
    def __init__(self):
        """Initialize the AI Savings Predictor"""
        print("✅ AI Savings Predictor initialized successfully!")
    
    def predictGoalCompletion(self, userData):
        """Predict when a user will reach their savings goal"""
        try:
            # Extract user data
            goal_amount = float(userData.get('goal_amount', 0))
            current_savings = float(userData.get('current_savings', 0))
            monthly_income = float(userData.get('monthly_income', 0))
            monthly_expenses = float(userData.get('monthly_expenses', 0))
            monthly_savings = float(userData.get('monthly_savings', 0))
            
            # Calculate available monthly savings
            if monthly_savings <= 0:
                monthly_savings = monthly_income - monthly_expenses
            
            if monthly_savings <= 0:
                return {
                    "success": False,
                    "message": "Your monthly expenses exceed your income. Focus on reducing expenses first.",
                    "prediction": None
                }
            
            # Calculate remaining amount needed
            remaining_amount = goal_amount - current_savings
            
            if remaining_amount <= 0:
                return {
                    "success": True,
                    "message": "Congratulations! You've already reached your goal!",
                    "prediction": {
                        "months_to_goal": 0,
                        "expected_completion_date": datetime.now().strftime("%Y-%m-%d"),
                        "monthly_savings_needed": 0,
                        "is_achievable": True
                    }
                }
            
            # Calculate months needed
            months_to_goal = remaining_amount / monthly_savings
            
            # Calculate expected completion date
            completion_date = datetime.now() + timedelta(days=months_to_goal * 30)
            
            # Determine if goal is realistic
            is_achievable = months_to_goal <= 60  # 5 years max
            
            # Generate insights
            insights = self._generateInsights(months_to_goal, monthly_savings, goal_amount)
            
            return {
                "success": True,
                "message": "Savings prediction generated successfully",
                "prediction": {
                    "months_to_goal": round(months_to_goal, 1),
                    "expected_completion_date": completion_date.strftime("%Y-%m-%d"),
                    "monthly_savings_needed": round(monthly_savings, 2),
                    "total_savings_needed": round(remaining_amount, 2),
                    "is_achievable": is_achievable,
                    "insights": insights
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Error predicting savings: {str(e)}",
                "prediction": None
            }
    
    def _generateInsights(self, months_to_goal, monthly_savings, goal_amount):
        """Generate personalized insights based on prediction"""
        insights = []
        
        if months_to_goal <= 12:
            insights.append("🎯 Your goal is very achievable within a year!")
            insights.append("💡 Consider increasing monthly savings to reach it even faster")
        elif months_to_goal <= 24:
            insights.append("📅 Your goal is achievable within 2 years")
            insights.append("💪 Stay consistent with your savings plan")
        elif months_to_goal <= 36:
            insights.append("⏰ Your goal will take 2-3 years to achieve")
            insights.append("🔄 Consider if this timeline works for your needs")
        else:
            insights.append("📊 This is a long-term goal")
            insights.append("💡 Consider breaking it into smaller, shorter-term goals")
        
        # Add savings rate insights
        savings_rate = (monthly_savings / goal_amount) * 100
        if savings_rate >= 20:
            insights.append("🌟 You're saving at an excellent rate!")
        elif savings_rate >= 10:
            insights.append("👍 You're saving at a good rate")
        else:
            insights.append("💡 Consider ways to increase your monthly savings")
        
        return insights
