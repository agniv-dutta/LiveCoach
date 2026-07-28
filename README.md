# Interview Coach – AI-Powered Real-Time Interview Rehearsal

Rehearse job interviews and pitches with an AI coach who interrupts, challenges, and gives actionable feedback.
Built with Gemini Live API for natural dialogue and NSOffice glass UI for a premium experience.

![Status](https://img.shields.io/badge/Status-Demo-blue)
![Free Tier](https://img.shields.io/badge/API-Free%20Tier-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## Features

- **Real-Time Coaching**: Audio input via browser → Gemini Live API → Live transcript + interruptions
- **Natural Interruptions**: Coach breaks in with follow-ups (e.g., "Give me an example"), not passive listening
- **Structured Feedback**: 3-part critique after each rehearsal: strength, gap, action to improve
- **Performance Scoring**: Clarity, structure, impact, confidence — tracked per session
- **Session History**: Save transcripts and feedback to revisit later
- **Role-Specific Coaching**: Interview, pitch, executive, behavioral — tailored prompts
- **NSOffice Glass UI**: Liquid-glass morphism design with Electric Blue accents and DM Sans typography
- **Free Tier**: Zero credit card required; runs on Google AI Studio free tier (Gemini 2.0 Flash)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + NSOffice Glass UI (tokens.css)
- **Backend**: Python FastAPI (Vercel serverless)
- **Database**: SQLite (local, easy to deploy)
- **AI**: Google Gemini Live API (`gemini-2.0-flash-exp`)
- **Deploy**: Vercel (frontend) + Vercel serverless (backend)
- **Design**: NSOffice glass UI kit (included)

## Prerequisites

- Node.js 18.17+
- Python 3.11+
- Free Google API key (no credit card)
- Vercel account (optional, for deployment)

## Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **Create API Key** in existing/new project (free tier, no billing)
3. Copy the key

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

### 4. Test the Flow

1. Open `http://localhost:3000`
2. Type `interview` or `pitch` in the Decision Bar and press Enter
3. Record your answer (max 3 minutes)
4. Upload completes automatically
5. Backend processes audio through Gemini Live API
6. View structured feedback: strengths, gaps, action, and scores

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sessions/start?role=interview&user_id=abc` | Create a new session |
| POST | `/api/sessions/{id}/upload` | Upload audio, get feedback + scores |
| GET | `/api/sessions/{id}` | Retrieve session data |
| GET | `/api/sessions/user/{user_id}/history` | List past sessions |
| GET | `/api/sessions/{id}/export?format=markdown` | Export as Markdown |

## Project Structure

```
├── frontend/              # Next.js 14 (App Router) + NSOffice Glass UI
│   ├── app/
│   │   ├── layout.tsx     # Root layout + glass UI tokens
│   │   ├── page.tsx       # Hero + Decision Bar
│   │   ├── history/       # Past sessions list
│   │   ├── rehearsal/     # Live recording room
│   │   └── results/       # Feedback + scores display
│   ├── components/
│   │   ├── AudioRecorder.tsx   # Record + upload with visualizer
│   │   ├── DecisionBar.tsx     # Glass pill input (hero CTA)
│   │   ├── FeedbackCard.tsx    # Structured critique + scores
│   │   ├── ScoreCard.tsx       # Performance bar chart
│   │   └── TranscriptFeed.tsx  # Live transcript display
│   ├── lib/
│   │   ├── db.ts          # API client (start, upload, history, export)
│   │   └── types.ts       # TypeScript interfaces
│   ├── public/
│   │   ├── tokens.css     # NSOffice glass UI design tokens
│   │   └── liquid-glass.js # Refraction engine
│   └── styles/
│       └── globals.css    # Global styles (imports tokens.css)
├── backend/               # Python FastAPI serverless
│   ├── lib/
│   │   ├── gemini_client.py  # Gemini Live API wrapper + scoring
│   │   └── database.py       # SQLite ops + quota check
│   ├── sessions.py        # FastAPI routes
│   ├── app.py             # Vercel entry point
│   └── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Architecture

```
Browser (Web Audio API)
  │  HTTP
  ▼
Python FastAPI Backend
  │
  ├── SQLite (sessions.db)
  └── Gemini Live API (gemini-2.0-flash-exp)
        │
        └── Returns: transcript + structured feedback + scores
```

## How It Works

### User Flow

1. **Hero Page**: User lands, chooses role (interview/pitch/executive/behavioral), clicks "Start Rehearsal"
2. **Recording**: Mic capture with countdown timer + audio level visualizer
3. **Upload & Process**: Recording sent to backend
4. **Gemini Live Coaching**: Backend sends audio to Gemini with role-specific prompt
5. **Results Page**: Shows transcript + structured feedback + performance scores

## Design System (NSOffice Glass UI)

This app uses NSOffice's proprietary design system:

- **Color**: Electric Blue (`#0000FE`) as sole accent, Ink (`#2E343F`) for text
- **Typography**: DM Sans with Apple-style hierarchy (Black/Bold for headers, Regular for body)
- **Spacing**: 4/8/16/24/48/96px rhythm (Apple HIG discipline)
- **Surfaces**: Liquid-glass morphism (refractive panels) + soft shadows
- **Components**: Glass Decision Bar (primary action), Icon Chips (lavender), Material Symbols

See `frontend/public/tokens.css` and `frontend/public/liquid-glass.js` for implementation.

## API Limits & Free Tier Considerations

| Limit | Value | Impact |
|-------|-------|--------|
| Requests/min | 15 | 5 full rehearsals safe per session |
| Requests/day | 1500 | Multiple users = quota exhaustion risk |
| Audio length | 25 min max | UI caps at 3 min |
| Response latency | 3-5s per 1-min audio | Show spinner UX |

**Quota management**: For production scale, migrate to paid Gemini tier or implement user auth + daily limits.

## Environment Variables

### Required
- `GEMINI_API_KEY`: Google AI Studio API key (free tier, set in `backend/.env`)
- `NEXT_PUBLIC_API_URL`: Backend URL (`http://localhost:8000` locally, set in `frontend/.env.local`)

### Optional
- `DATABASE_URL`: For future PostgreSQL migration (currently SQLite only)
- `LOG_LEVEL`: `debug` | `info` | `error` (default: `info`)

## Deployment (Vercel)

```bash
npm install -g vercel
vercel login
vercel link
vercel deploy --prod
```

Add environment variables in Vercel dashboard:
- `GEMINI_API_KEY` = your API key
- `NEXT_PUBLIC_API_URL` = https://[your-deployment].vercel.app

## Troubleshooting

### "API quota exceeded"
- Free tier limit is 1500 requests/day
- Solution: Create a new API key, or wait 24h for reset
- Production: Enable billing on Google Cloud

### Audio upload fails
- Check `backend/.env` has valid `GEMINI_API_KEY`
- Verify audio file is WAV format, <25MB
- Check backend is running on `http://localhost:8000`

### Vercel deployment shows 502
- Ensure Python dependencies in `backend/requirements.txt` installed
- Check env vars are set in Vercel dashboard
- Verify `vercel.json` points to the correct Python runtime

### Glass UI cards look flat
- Ensure `liquid-glass.js` is loaded (check Network tab)
- Verify `.glass-light` or `.glass-dark` class on element
- Chrome/Edge = refraction; Safari/Firefox = frosted fallback (OK)

## Production Roadmap

- [ ] Upgrade SQLite → PostgreSQL (persistent sessions)
- [ ] Add user auth (email or Google OAuth)
- [ ] Record live audio stream (WebSocket, not file upload)
- [ ] Video recording + facial expression feedback
- [ ] Multi-panelist mock interviews

## License

MIT — Use freely for internship, portfolio, or production.

## Acknowledgments

- Gemini Live API: Google Generative AI team
- Design: NSOffice.AI glass UI system
- Icons: Material Symbols Rounded
