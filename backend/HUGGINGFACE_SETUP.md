# HuggingFace AI Integration Setup

## Overview
The AI Financial Advisor now uses HuggingFace models for intelligent financial advice generation. This provides more sophisticated and context-aware responses compared to basic rule-based systems.

## Required Setup

### 1. Get HuggingFace API Key
1. Go to [HuggingFace](https://huggingface.co/)
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token

### 2. Add to Environment Variables
Add the following to your `.env` file in the backend directory:

```bash
# HuggingFace AI Integration
HUGGINGFACE_API_KEY=your_huggingface_token_here
```

### 3. Models Used
The system uses these HuggingFace models:
- **GPT-2** (`gpt2`) - For generating financial advice text
- **Twitter RoBERTa** (`cardiffnlp/twitter-roberta-base-sentiment-latest`) - For sentiment analysis
- **RoBERTa SQuAD** (`deepset/roberta-base-squad2`) - For question answering

### 4. Fallback System
If no HuggingFace API key is provided or the API is unavailable, the system automatically falls back to intelligent rule-based responses to ensure the AI advisor always works.

## Features

### Smart Financial Advice
- Context-aware responses based on user profile
- Personalized recommendations
- Dynamic insight generation
- Confidence scoring

### Sentiment Analysis
- Analyzes user messages for emotional tone
- Provides appropriate responses based on sentiment
- Helps identify financial stress or anxiety

### Question Answering
- Answers specific financial questions
- Provides detailed explanations
- Offers actionable advice

## API Endpoints

### POST /api/ai/financial-advice
```json
{
  "query": "How much should I save each month?",
  "userProfile": {
    "income": 5000,
    "age": 25,
    "goals": ["Emergency Fund", "Vacation"]
  },
  "context": "financial_advisor"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "advice": "Based on your income of $5000, I recommend saving 20% or $1000 per month...",
    "confidence": 0.85,
    "model": "HuggingFace GPT-2",
    "insights": [...],
    "insightType": "savings"
  }
}
```

## Testing
1. Start the backend server
2. Navigate to the AI Financial Advisor page
3. Ask financial questions like:
   - "How much should I save each month?"
   - "What's the best way to budget my income?"
   - "Should I invest or save more?"
   - "How do I build an emergency fund?"

## Troubleshooting

### No API Key
- System will use fallback responses
- All functionality remains available
- Check console for warning messages

### API Errors
- Check internet connection
- Verify API key is correct
- Check HuggingFace service status
- System automatically falls back to rule-based responses

### Slow Responses
- HuggingFace models can take 2-5 seconds
- Consider upgrading to faster models
- Implement response caching for common questions

## Cost Considerations
- HuggingFace Inference API has free tier
- Free tier includes 1000 requests/month
- Consider upgrading for production use
- Monitor usage in HuggingFace dashboard
