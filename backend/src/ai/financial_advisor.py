from transformers import pipeline
import json

class FinancialAdvisor:
    def __init__(self):
        # Use a smaller, faster model for testing
        try:
            # Try to use a smaller model first
            self.model = pipeline("text-generation", model="distilgpt2", max_length=100)
            print("✅ Using DistilGPT-2 (faster, smaller model)")
        except Exception as e:
            print(f"⚠️ Could not load AI model: {e}")
            self.model = None
        
        # Financial context templates
        self.financial_contexts = {
            "savings_plan": "Create a savings plan for:",
            "goal_setting": "Set financial goals for:",
            "budget_advice": "Provide budgeting advice for:"
        }
    
    def get_financial_advice(self, user_query, user_profile, context_type="general"):
        try:
            if not self.model:
                return self._get_fallback_advice(user_query, context_type)
            
            # Create context-aware prompt
            context = self.financial_contexts.get(context_type, self.financial_contexts["savings_plan"])
            
            prompt = f"{context} {user_query}. User has income ${user_profile.get('income', 'variable')} and wants to save for {user_profile.get('goals', 'financial goals')}."
            
            # Generate response
            response = self.model(prompt, max_length=150, num_return_sequences=1, temperature=0.7)
            
            advice = response[0]['generated_text']
            
            return {
                "advice": advice,
                "confidence": 0.85,
                "context_used": context_type
            }
            
        except Exception as e:
            return self._get_fallback_advice(user_query, context_type)
    
    def _get_fallback_advice(self, query, context_type):
        """Fallback advice when AI model is not available"""
        fallback_responses = {
            "savings_plan": [
                "Start by saving 20% of your income each month. Create an emergency fund first, then focus on specific goals.",
                "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Automate your savings to make it easier.",
                "Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound savings targets."
            ],
            "goal_setting": [
                "Break down large goals into smaller, achievable milestones. Celebrate each milestone to stay motivated.",
                "Prioritize your goals: emergency fund first, then short-term goals, then long-term investments.",
                "Review and adjust your goals monthly. Life changes, so your financial goals should adapt too."
            ],
            "budget_advice": [
                "Track every expense for a month to understand your spending patterns. Use apps or spreadsheets.",
                "Create a zero-based budget where every dollar has a purpose. Include savings as a fixed expense.",
                "Use the envelope method for variable expenses like groceries and entertainment."
            ],
            "general": [
                "Start small and build momentum. Even $10 a week adds up to $520 a year.",
                "Automate your savings to remove the temptation to spend. Out of sight, out of mind.",
                "Focus on building good financial habits rather than trying to save large amounts immediately."
            ]
        }
        
        import random
        advice = random.choice(fallback_responses.get(context_type, fallback_responses["general"]))
        
        return {
            "advice": advice,
            "confidence": 0.75,
            "context_used": context_type,
            "note": "Using fallback advice (AI model not available)"
        }
    
    def analyze_financial_mindset(self, user_text):
        """Analyze user's financial mindset using keyword analysis"""
        try:
            # Simple keyword-based analysis
            positive_words = ['confident', 'excited', 'motivated', 'achieved', 'progress', 'success', 'happy', 'proud']
            negative_words = ['worried', 'anxious', 'struggling', 'difficult', 'overwhelmed', 'stress', 'frustrated', 'scared']
            
            text_lower = user_text.lower()
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            if positive_count == 0 and negative_count == 0:
                mindset_score = 0.5
                analysis = "Your financial mindset appears neutral. Consider setting clear goals to build motivation."
            elif positive_count > negative_count:
                mindset_score = 0.7 + (positive_count * 0.1)
                analysis = "You have a positive financial mindset! Keep building on this momentum."
            else:
                mindset_score = 0.3 - (negative_count * 0.1)
                analysis = "You might be feeling some financial stress. Remember, small steps lead to big changes."
            
            recommendations = [
                "Set small, achievable financial goals",
                "Track your progress and celebrate wins",
                "Build a support system of like-minded savers",
                "Focus on what you can control",
                "Practice gratitude for your financial progress"
            ]
            
            return {
                "analysis": analysis,
                "mindset_score": max(0.1, min(0.9, mindset_score)),
                "recommendations": recommendations[:3]
            }
            
        except Exception as e:
            return {
                "analysis": "Unable to analyze mindset at this time.",
                "mindset_score": 0.5,
                "recommendations": ["Focus on small, achievable financial goals"]
            } 