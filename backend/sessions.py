from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
from lib.database import create_session, save_session_data, get_session
from lib.gemini_client import stream_coaching_session

app = FastAPI()

# Allow CORS for localhost + Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/sessions/start")
async def start_session(role: str = "interview"):
    """
    Start a new rehearsal session.
    role: 'interview' or 'pitch'
    """
    session_id = str(uuid.uuid4())[:8]
    create_session(session_id, role)
    return {
        'session_id': session_id,
        'role': role,
        'message': 'Session started. Start recording.'
    }

@app.post("/api/sessions/{session_id}/upload")
async def upload_audio(session_id: str, file: UploadFile = File(...)):
    """
    Upload audio file, process with Gemini Live, save feedback.
    """
    try:
        # Save uploaded audio temp file
        temp_path = f"/tmp/{session_id}_audio.wav"
        contents = await file.read()
        with open(temp_path, 'wb') as f:
            f.write(contents)
        
        # Process with Gemini
        result = await stream_coaching_session(temp_path)
        
        if result['status'] == 'error':
            raise HTTPException(status_code=500, detail=result['error'])
        
        # Save to DB
        save_session_data(
            session_id,
            result['transcript'],
            result['feedback'],
            duration=0  # Derive from audio file later
        )
        
        return {
            'session_id': session_id,
            'transcript': result['transcript'],
            'feedback': result['feedback']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions/{session_id}")
async def get_session_data(session_id: str):
    """Retrieve a completed session."""
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
