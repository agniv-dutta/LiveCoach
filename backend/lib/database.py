import sqlite3
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'sessions.db'

def init_db():
    """Initialize SQLite schema."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            role TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            duration_seconds INTEGER,
            transcript TEXT,
            feedback TEXT,
            status TEXT DEFAULT 'active'
        )
    ''')
    conn.commit()
    conn.close()

def create_session(session_id: str, role: str) -> dict:
    """Create a new rehearsal session."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        'INSERT INTO sessions (id, role, status) VALUES (?, ?, ?)',
        (session_id, role, 'active')
    )
    conn.commit()
    conn.close()
    return {'id': session_id, 'role': role, 'status': 'active'}

def save_session_data(
    session_id: str,
    transcript: str,
    feedback: str,
    duration: int
):
    """Save transcript, feedback, and duration after session ends."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        '''UPDATE sessions 
           SET transcript = ?, feedback = ?, duration_seconds = ?, status = ?
           WHERE id = ?''',
        (transcript, feedback, duration, 'completed', session_id)
    )
    conn.commit()
    conn.close()

def get_session(session_id: str) -> dict:
    """Retrieve session data."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return {
        'id': row[0],
        'role': row[1],
        'created_at': row[2],
        'duration_seconds': row[3],
        'transcript': row[4],
        'feedback': row[5],
        'status': row[6],
    }

init_db()
