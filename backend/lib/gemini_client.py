import os
import asyncio
import json
import re
from google.generativeai import GenerativeModel
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('GEMINI_API_KEY')

BASE_COACH_PROMPT = """You are an expert interview and pitch coach. Your role is to:

1. Listen to the candidate or consultant's answer out loud.
2. Interrupt naturally with follow-up questions (use barge-in) if something needs clarification or sounds weak.
3. At the end, provide a short spoken critique covering:
   - Strengths: what was clear, compelling, or well-explained
   - Gaps: what was missing or needed more detail
   - One key improvement: one specific thing to work on before the real thing

Keep your interruptions brief (2-3 sentences max). Your critique should take 20-30 seconds.
Be warm, constructive, and sound like a mentor, not a bot.

IMPORTANT: Format your feedback as follows:
- Strengths (1-2 bullet points): What they did well
- Gap (1 clear point): What was missing
- Action (1 concrete step): What to improve

Keep it under 150 words total for spoken delivery in ~20 seconds."""

ROLE_SYSTEM_PROMPTS = {
    'interview': BASE_COACH_PROMPT + """

Focus areas for interview coaching:
- STAR method (Situation, Task, Action, Result)
- Quantified impact and specific examples
- Concise, structured answers (45-90 seconds)
- Confidence, clarity, and conciseness""",

    'pitch': BASE_COACH_PROMPT + """

Focus areas for pitch coaching:
- Narrative arc: hook, problem, solution, market, traction
- ROI and business value quantification
- Conviction and energy in delivery
- Clear ask and call to action""",

    'executive': BASE_COACH_PROMPT + """

Focus areas for executive presence coaching:
- Strategic thinking and big-picture framing
- Leadership stories with team impact
- Pacing, pausing, and vocal authority
- Brevity with substance; no filler""",

    'behavioral': BASE_COACH_PROMPT + """

Focus areas for behavioral interview coaching:
- Situation-Task-Action-Result structure
- Self-awareness and growth mindset examples
- Teamwork and conflict resolution stories
- Authenticity over rehearsed answers""",
}

SCORING_PROMPT = """
After giving feedback, score this answer on a scale of 1-10:
- Clarity (1-10): How easy to follow?
- Structure (1-10): Did it have a beginning, middle, end?
- Impact (1-10): Did it demonstrate real business value?
- Confidence (1-10): Did they sound sure of themselves?

Give one sentence per score. Format:
Clarity: 7/10 - Good use of examples, but took time to get to the point.
Structure: 8/10 - Strong narrative arc.
Impact: 6/10 - Mentioned results, but didn't quantify them.
Confidence: 8/10 - Clear voice, good pace.
"""

def parse_scores(text: str) -> dict:
    scores = {}
    pattern = r'(Clarity|Structure|Impact|Confidence)\s*:\s*(\d+\.?\d*)/10'
    for match in re.finditer(pattern, text, re.IGNORECASE):
        scores[match.group(1).lower()] = float(match.group(2))
    return scores

async def stream_coaching_session(audio_input_path: str, role: str = 'interview') -> dict:
    try:
        model = GenerativeModel("gemini-2.0-flash-exp")

        prompt = ROLE_SYSTEM_PROMPTS.get(role, ROLE_SYSTEM_PROMPTS['interview'])
        prompt += '\n\n' + SCORING_PROMPT

        with open(audio_input_path, 'rb') as f:
            audio_data = f.read()

        response = model.generate_content([
            {
                "mime_type": "audio/wav",
                "data": audio_data,
            },
            prompt,
        ])

        full_text = response.text

        # Split feedback and scores
        feedback_text = full_text
        scores = parse_scores(full_text)
        # Remove score lines from feedback display
        score_lines = []
        clean_lines = []
        for line in full_text.split('\n'):
            if re.match(r'(Clarity|Structure|Impact|Confidence)\s*:', line, re.IGNORECASE):
                score_lines.append(line)
            else:
                clean_lines.append(line)
        feedback_text = '\n'.join(clean_lines).strip()

        return {
            'transcript': full_text,
            'feedback': feedback_text,
            'scores': scores,
            'status': 'success'
        }
    except Exception as e:
        return {
            'error': str(e),
            'status': 'error'
        }

def get_system_prompt(role: str = 'interview') -> str:
    return ROLE_SYSTEM_PROMPTS.get(role, ROLE_SYSTEM_PROMPTS['interview'])
