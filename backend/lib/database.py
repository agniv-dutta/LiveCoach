import sqlite3
import json
from datetime import datetime, date
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / 'sessions.db'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT DEFAULT 'anonymous',
            role TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            duration_seconds INTEGER,
            transcript TEXT,
            feedback TEXT,
            scores TEXT,
            status TEXT DEFAULT 'active'
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password_hash TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            daily_quota INTEGER DEFAULT 5
        )
    ''')
    conn.commit()
    conn.close()

def create_session(session_id: str, role: str, user_id: str = 'anonymous') -> dict:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        'INSERT INTO sessions (id, role, user_id, status) VALUES (?, ?, ?, ?)',
        (session_id, role, user_id, 'active')
    )
    conn.commit()
    conn.close()
    return {'id': session_id, 'role': role, 'user_id': user_id, 'status': 'active'}

def save_session_data(
    session_id: str,
    transcript: str,
    feedback: str,
    scores: dict,
    duration: int
):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        '''UPDATE sessions 
           SET transcript = ?, feedback = ?, scores = ?, duration_seconds = ?, status = ?
           WHERE id = ?''',
        (transcript, feedback, json.dumps(scores), duration, 'completed', session_id)
    )
    conn.commit()
    conn.close()

def get_session(session_id: str) -> dict:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM sessions WHERE id = ?', (session_id,))
    row = c.fetchone()
    conn.close()

    if not row:
        return None

    return {
        'id': row[0],
        'user_id': row[1],
        'role': row[2],
        'created_at': row[3],
        'duration_seconds': row[4],
        'transcript': row[5],
        'feedback': row[6],
        'scores': json.loads(row[7]) if row[7] else None,
        'status': row[8],
    }

def get_user_sessions(user_id: str, limit: int = 10) -> list:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        'SELECT id, role, created_at, feedback, scores, status FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        (user_id, limit)
    )
    rows = c.fetchall()
    conn.close()
    return [{
        'id': r[0],
        'role': r[1],
        'created_at': r[2],
        'feedback_preview': (r[3] or '')[:120] + '...' if r[3] else None,
        'scores': json.loads(r[4]) if r[4] else None,
        'status': r[5],
    } for r in rows]

def check_daily_quota(user_id: str, limit: int = 5) -> bool:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    today_str = date.today().isoformat()
    c.execute(
        "SELECT COUNT(*) FROM sessions WHERE user_id = ? AND DATE(created_at) = ?",
        (user_id, today_str)
    )
    count = c.fetchone()[0]
    conn.close()
    return count < limit

init_db()
