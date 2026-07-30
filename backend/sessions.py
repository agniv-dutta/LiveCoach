from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uuid
import tempfile
from io import BytesIO
from lib.database import create_session, save_session_data, get_session, get_user_sessions, check_daily_quota
from lib.gemini_client import stream_coaching_session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/sessions/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/sessions/start")
async def start_session(role: str = "interview", user_id: str = "anonymous"):
    session_id = str(uuid.uuid4())[:8]
    if not check_daily_quota(user_id):
        raise HTTPException(status_code=429, detail="Daily session limit reached")
    create_session(session_id, role, user_id)
    return {
        'session_id': session_id,
        'role': role,
        'user_id': user_id,
        'message': 'Session started. Start recording.'
    }

@app.post("/api/sessions/{session_id}/upload")
async def upload_audio(session_id: str, file: UploadFile = File(...)):
    try:
        contents = await file.read()
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        tmp.write(contents)
        tmp.close()

        session = get_session(session_id)
        role = session['role'] if session else 'interview'

        result = await stream_coaching_session(tmp.name, role)

        if result['status'] == 'error':
            error_msg = result.get('error', '')
            lower = error_msg.lower()
            if 'resource_exhausted' in lower or 'quota' in lower:
                raise HTTPException(
                    status_code=429,
                    detail="Daily coaching limit reached. Free tier allows ~5 sessions/day. Try again tomorrow."
                )
            if 'permission_denied' in lower or 'invalid' in lower or 'not found' in lower:
                raise HTTPException(
                    status_code=403,
                    detail="API configuration error. Check GEMINI_API_KEY environment variable."
                )
            raise HTTPException(status_code=500, detail="Coaching service temporarily unavailable. Please try again.")

        save_session_data(
            session_id,
            result['transcript'],
            result['feedback'],
            result.get('scores', {}),
            duration=0
        )

        return {
            'session_id': session_id,
            'transcript': result['transcript'],
            'feedback': result['feedback'],
            'scores': result.get('scores', {})
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Coaching service temporarily unavailable. Please try again in a moment."
        )

@app.get("/api/sessions/{session_id}")
async def get_session_data(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.get("/api/sessions/user/{user_id}/history")
async def get_user_history(user_id: str, limit: int = Query(10, le=50)):
    sessions = get_user_sessions(user_id, limit)
    return {'sessions': sessions, 'user_id': user_id}

@app.get("/api/sessions/{session_id}/export")
async def export_session(session_id: str, format: str = Query('markdown', pattern='^(markdown|pdf)$')):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if format == 'markdown':
        md = f"""# Interview Rehearsal Report

**Role**: {session['role']}
**Date**: {session['created_at']}
**Status**: {session['status']}

## Transcript

{session['transcript'] or '*No transcript recorded*'}

## Coach Feedback

{session['feedback'] or '*No feedback available*'}

## Scores

{session['scores'] if session.get('scores') else '*Not scored*'}
"""
        return {'content': md, 'filename': f'rehearsal-{session_id}.md'}

    elif format == 'pdf':
        md_content = f"""Interview Rehearsal Report
Role: {session['role']}
Date: {session['created_at']}

TRANSCRIPT
{session['transcript'] or 'No transcript recorded'}

COACH FEEDBACK
{session['feedback'] or 'No feedback available'}

SCORES
{session['scores'] if session.get('scores') else 'Not scored'}
"""
        buffer = BytesIO()
        buffer.write(md_content.encode('utf-8'))
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename=rehearsal-{session_id}.md"}
        )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
