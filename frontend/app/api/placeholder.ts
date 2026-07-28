// Vercel proxy: Next.js API routes forward to the Python FastAPI backend.
// In production, configure rewrites in vercel.json to point /api/* to the
// Python serverless function deployed from the backend/ folder.
//
// Local development: run the backend separately on port 8000.
// NEXT_PUBLIC_API_URL=http://localhost:8000
export {};
