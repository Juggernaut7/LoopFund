from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import torch
import json
import re
from datetime import datetime, timedelta

class FinancialAdvisor:
    def __init__(self):
        """Initialize the AI Financial Advisor with Mistral-7B-Instruct"""
        try:
            # Load pre-trained models
            self.conversation_model = pipeline(
                "text-generation", 
                model="mistralai/Mistral-7B-Instruct",
                torch_dtype=torch.float16,
                device_map="auto"
            )
            print("✅ AI Financial Advisor initialized successfully!")
        except Exception as e:
            print(f"❌ Error initializing AI: {e}")
            # Fallback to a simpler model if needed
            self.conversation_model = None
    
    def getAdvice(self, user_query, user_profile=None):
        """Generate personalized financial advice based on user query and profile"""
        if not self.conversation_model:
            return "AI service temporarily unavailable. Please try again later."
        
        try:
            # Build context-aware prompt
            context = self._build_context_prompt(user_query, user_profile)
            
            # Generate response
            response = self.conversation_model(
                context,
                max_length=300,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.conversation_model.tokenizer.eos_token_id
            )
            
            # Extract and clean the response
            advice = self._clean_response(response[0]['generated_text'])
            return advice
            
        except Exception as e:
            print(f"Error generating advice: {e}")
            return "I'm having trouble processing your request. Please try again."
    
    def get_financial_advice(self, user_query, user_profile=None):
        """Legacy method for backward compatibility"""
        return self.getAdvice(user_query, user_profile)
    
    def _build_context_prompt(self, user_query, user_profile):
        """Build a comprehensive prompt with financial context and instructions"""
        
        # Base financial advisor instructions
        base_instructions = """You are LoopFund AI, a professional financial advisor specializing in savings, budgeting, and financial planning. 

Your role is to provide:
- Clear, actionable financial advice
- Specific savings calculations and timelines
- Motivational and encouraging responses
- Practical tips for achieving financial goals
- Risk-aware recommendations

Always respond in a friendly, professional tone and provide specific numbers when possible."""

        # User profile context
        profile_context = ""
        if user_profile:
            profile_context = f"""
User Profile:
- Income: {user_profile.get('income', 'Not specified')}
- Age: {user_profile.get('age', 'Not specified')}
- Current Savings: {user_profile.get('current_savings', 'Not specified')}
- Financial Goals: {user_profile.get('goals', 'Not specified')}
- Risk Tolerance: {user_profile.get('risk_tolerance', 'Not specified')}
"""

        # Financial knowledge base
        financial_knowledge = """
Financial Knowledge Base:
- Emergency Fund: 3-6 months of expenses
- 50/30/20 Rule: 50% needs, 30% wants, 20% savings
- Compound Interest: Money grows exponentially over time
- Diversification: Don't put all eggs in one basket
- Pay Yourself First: Save before spending
"""

        # Build the complete prompt
        full_prompt = f"{base_instructions}\n\n{profile_context}\n\n{financial_knowledge}\n\nUser Question: {user_query}\n\nLoopFund AI Response:"
        
        return full_prompt
    
    def _clean_response(self, response):
        """Clean and format the AI response"""
        # Remove the original prompt from the response
        if "LoopFund AI Response:" in response:
            response = response.split("LoopFund AI Response:")[-1].strip()
        
        # Clean up any extra tokens or formatting
        response = re.sub(r'<\|.*?\|>', '', response)
        response = re.sub(r'\[.*?\]', '', response)
        
        # Ensure response ends properly
        if response.endswith('...') or response.endswith('..'):
            response = response[:-2]
        
        return response.strip()
    
    def get_savings_plan(self, goal_amount, timeline_months, monthly_income, monthly_expenses):
        """Generate a detailed savings plan"""
        try:
            # Calculate basic savings plan
            monthly_savings_needed = goal_amount / timeline_months
            available_for_savings = monthly_income - monthly_expenses
            
            if monthly_savings_needed > available_for_savings:
                # Goal is too aggressive
                adjusted_timeline = goal_amount / available_for_savings
                advice = f"""
🎯 Your Savings Goal: ${goal_amount:,}
⏰ Original Timeline: {timeline_months} months
💰 Monthly Savings Needed: ${monthly_savings_needed:,.2f}
💸 Available Monthly: ${available_for_savings:,.2f}

⚠️ This goal is too aggressive for your current budget.
💡 Recommended Timeline: {adjusted_timeline:.1f} months
💡 Alternative: Reduce goal to ${(available_for_savings * timeline_months):,.2f}

Would you like me to help you adjust your goal or create a more realistic timeline?
"""
            else:
                # Goal is achievable
                advice = f"""
🎯 Your Savings Goal: ${goal_amount:,}
⏰ Timeline: {timeline_months} months
💰 Monthly Savings Needed: ${monthly_savings_needed:,.2f}
💸 Available Monthly: ${available_for_savings:,.2f}

✅ This goal is achievable! Here's your plan:

📅 Monthly Savings: ${monthly_savings_needed:,.2f}
💪 Extra Available: ${available_for_savings - monthly_savings_needed:,.2f}
🎉 You'll reach your goal in {timeline_months} months!

💡 Tips:
- Set up automatic transfers on payday
- Track your progress weekly
- Celebrate small milestones
"""
            
            return advice
            
        except Exception as e:
            return f"Error calculating savings plan: {e}"
    
    def get_budget_advice(self, income, expenses, goals):
        """Provide budget optimization advice"""
        try:
            total_expenses = sum(expenses.values())
            savings_rate = ((income - total_expenses) / income) * 100
            
            if savings_rate < 20:
                advice = f"""
📊 Budget Analysis:
💰 Monthly Income: ${income:,.2f}
💸 Monthly Expenses: ${total_expenses:,.2f}
💾 Current Savings Rate: {savings_rate:.1f}%

⚠️ Your savings rate is below the recommended 20%.

💡 Recommendations:
1. Track all expenses for 30 days
2. Identify non-essential spending
3. Use the 50/30/20 rule:
   - 50% for needs (rent, food, utilities)
   - 30% for wants (entertainment, shopping)
   - 20% for savings and debt repayment

🎯 Target: Increase savings to ${income * 0.2:,.2f} per month
"""
            else:
                advice = f"""
📊 Budget Analysis:
💰 Monthly Income: ${income:,.2f}
💸 Monthly Expenses: ${total_expenses:,.2f}
💾 Current Savings Rate: {savings_rate:.1f}%

🎉 Excellent! You're saving above the recommended 20%.

💡 You could:
- Increase emergency fund
- Invest in retirement accounts
- Save for additional goals
- Treat yourself (you've earned it!)
"""
            
            return advice
            
        except Exception as e:
            return f"Error analyzing budget: {e}"
    
    def get_investment_advice(self, age, risk_tolerance, investment_amount):
        """Provide basic investment guidance"""
        try:
            if age < 30:
                time_horizon = "long-term"
                risk_recommendation = "higher risk tolerance"
            elif age < 50:
                time_horizon = "medium-term"
                risk_recommendation = "moderate risk tolerance"
            else:
                time_horizon = "shorter-term"
                risk_recommendation = "lower risk tolerance"
            
            advice = f"""
📈 Investment Guidance for Age {age}:
⏰ Time Horizon: {time_horizon}
🎯 Risk Profile: {risk_recommendation}
💰 Investment Amount: ${investment_amount:,.2f}

💡 Recommendations:
- Start with index funds (low fees, diversified)
- Consider your time horizon: {time_horizon}
- Don't invest money you'll need in 3-5 years
- Emergency fund first, then invest

⚠️ Disclaimer: This is general advice. Consider consulting a financial advisor for personalized guidance.
"""
            
            return advice
            
        except Exception as e:
            return f"Error providing investment advice: {e}"

    def recommendGoals(self, user_profile):
        """Recommend financial goals based on user profile"""
        try:
            # Basic goal recommendations based on age and income
            age = user_profile.get('age', 25)
            income = user_profile.get('income', 50000)
            
            recommendations = []
            
            if age < 30:
                recommendations.append({
                    'type': 'emergency_fund',
                    'name': 'Emergency Fund',
                    'target_amount': income * 0.1,  # 10% of income
                    'timeline_months': 6,
                    'priority': 'high',
                    'description': 'Build a safety net for unexpected expenses'
                })
                recommendations.append({
                    'type': 'debt_payoff',
                    'name': 'High-Interest Debt Payoff',
                    'target_amount': 0,  # Variable
                    'timeline_months': 12,
                    'priority': 'high',
                    'description': 'Focus on paying off credit cards and loans'
                })
            elif age < 40:
                recommendations.append({
                    'type': 'retirement',
                    'name': 'Retirement Savings',
                    'target_amount': income * 0.15,  # 15% of income
                    'timeline_months': 240,  # 20 years
                    'priority': 'high',
                    'description': 'Increase retirement contributions'
                })
                recommendations.append({
                    'type': 'investment',
                    'name': 'Investment Portfolio',
                    'target_amount': income * 0.2,  # 20% of income
                    'timeline_months': 120,  # 10 years
                    'priority': 'medium',
                    'description': 'Build a diversified investment portfolio'
                })
            else:
                recommendations.append({
                    'type': 'retirement',
                    'name': 'Retirement Catch-up',
                    'target_amount': income * 0.25,  # 25% of income
                    'timeline_months': 180,  # 15 years
                    'priority': 'high',
                    'description': 'Accelerate retirement savings'
                })
                recommendations.append({
                    'type': 'estate',
                    'name': 'Estate Planning',
                    'target_amount': 0,  # Variable
                    'timeline_months': 60,  # 5 years
                    'priority': 'medium',
                    'description': 'Plan for wealth transfer and legacy'
                })
            
            return {
                'success': True,
                'recommendations': recommendations,
                'user_profile': user_profile
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Error recommending goals: {str(e)}'
            }

# Example usage and testing
if __name__ == "__main__":
    advisor = FinancialAdvisor()
    
    # Test basic advice
    test_query = "How much should I save each month if my goal is $5,000 in 10 months?"
    advice = advisor.get_financial_advice(test_query)
    print("AI Advice:", advice)
    
    # Test savings plan
    plan = advisor.get_savings_plan(5000, 10, 4000, 2500)
    print("\nSavings Plan:", plan)
