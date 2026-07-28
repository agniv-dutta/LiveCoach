import os
import asyncio
import json
from google.generativeai import GenerativeModel
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('GEMINI_API_KEY')

SYSTEM_PROMPT = """You are an expert interview and pitch coach. Your role is to:

1. Listen to the candidate or consultant's answer out loud.
2. Interrupt naturally with follow-up questions (use barge-in) if something needs clarification or sounds weak.
3. At the end, provide a short spoken critique covering:
   - Strengths: what was clear, compelling, or well-explained
   - Gaps: what was missing or needed more detail
   - One key improvement: one specific thing to work on before the real thing

Keep your interruptions brief (2-3 sentences max). Your critique should take 20-30 seconds.
Be warm, constructive, and sound like a mentor, not a bot.
"""

async def stream_coaching_session(audio_input_path: str) -> dict:
    """
    Stream audio from file to Gemini Live API and get coaching feedback.
    
    Returns: {
        'transcript': str,
        'feedback': str,
        'status': 'success' or 'error'
    }
    """
    try:
        model = GenerativeModel("gemini-2.0-flash-exp")
        
        # In production, this would be a WebSocket stream.
        # For MVP (file-based), read audio file and send to Live API.
        with open(audio_input_path, 'rb') as f:
            audio_data = f.read()
        
        # Use regular API for MVP; upgrade to Live WebSocket for production.
        response = model.generate_content([
            {
                "mime_type": "audio/wav",
                "data": audio_data,
            },
            SYSTEM_PROMPT,
        ])
        
        return {
            'transcript': response.text,
            'feedback': response.text,
            'status': 'success'
        }
    except Exception as e:
        return {
            'error': str(e),
            'status': 'error'
        }

def get_system_prompt() -> str:
    """Return the coach's system prompt."""
    return SYSTEM_PROMPT
