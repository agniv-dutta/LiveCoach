# Interview & Pitch Rehearsal Coach

Real-time AI coaching for interviews and pitches. Record your answers, get instant structured feedback from a Gemini-powered coach.

## Architecture

```
Browser (Next.js 14)
  │  HTTP + WebSocket
  ▼
Python FastAPI (Vercel serverless)
  │
  ├── SQLite (sessions.db)
  └── Gemini Live API
```

## Project structure

```
├── frontend/          # Next.js 14 (App Router) + NSOffice Glass UI
│   ├── app/           # Pages: landing, rehearsal room, results
│   ├── components/    # AudioRecorder, DecisionBar, FeedbackCard, TranscriptFeed
│   ├── lib/           # API client + TypeScript types
│   └── public/        # tokens.css, liquid-glass.js
├── backend/           # Python FastAPI serverless
│   ├── lib/
│   │   ├── database.py     # SQLite session CRUD
│   │   └── gemini_client.py # Gemini Live API wrapper
│   ├── sessions.py    # FastAPI routes
│   ├── app.py         # Vercel entry point
│   └── requirements.txt
└── README.md
```

## Prerequisites

- Node.js 18.17+
- Python 3.11+
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikeys)

## Setup

### 1. Get a Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **Create API Key** > **Create new free API key in existing project**
3. Copy the key (no credit card required, ~15 requests/min free tier)

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Add your GEMINI_API_KEY
python -m uvicorn sessions:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                       # Opens http://localhost:3000
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sessions/start?role=interview` | Create a new session |
| POST | `/api/sessions/{id}/upload` | Upload audio, get feedback |
| GET | `/api/sessions/{id}` | Retrieve session data |

## Usage flow

1. Open `http://localhost:3000`
2. Click the Decision Bar to start (type `interview` or `pitch`)
3. Record up to 3 minutes of your answer
4. Upload completes automatically
5. Backend processes audio through Gemini Live API
6. View structured feedback: strengths, gaps, one improvement

## Limits

| Item | Limit |
|------|-------|
| Gemini free tier | ~15 req/min, 1500/day (~5 full sessions safe) |
| Audio length | 3 minutes max (UI enforced) |
| Response time | ~3-5 seconds for 1-minute audio |
| Vercel timeout | 10 seconds (free tier) |

## Deployment

### Vercel (frontend)

```bash
npm install -g vercel
vercel login
vercel link
vercel deploy --prod
```

Add `NEXT_PUBLIC_API_URL` in Vercel dashboard pointing to your deployed backend.

### Vercel (backend)

Deploy `backend/` as a Python serverless function. Set `GEMINI_API_KEY` in Vercel environment variables.

## License

MIT
