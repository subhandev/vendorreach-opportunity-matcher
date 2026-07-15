# VendorReach Opportunity Matcher

A small full-stack app that matches a vendor's business (industry + state) against a
list of government/public-sector contract opportunities. Built as a technical
assessment for VendorReach AI's Full-Stack Developer role.

**Live app:** https://vendorreach-opportunity-matcher.vercel.app
**API:** https://vendorreach-opportunity-matcher.onrender.com (free tier — first request after idle may take 30-60s to cold start)

## What was built

- A form collecting business name, industry (Construction / IT / Cleaning / Recruiting),
  and state.
- 10 sample opportunities spanning all 4 industries and 8 different states, seeded into
  a real Postgres database (Neon) rather than hardcoded in the frontend.
- A backend matching endpoint that filters opportunities by **industry AND state**. If
  there's no exact match, it falls back to industry-only matches in other states, clearly
  labeled as such, instead of showing a blank screen.
- Every search submission is logged (business name, industry, state, match counts) to a
  `search_logs` table.
- A handful of unit tests on the matching logic.

## Architecture

```
client/   React (Vite) + TypeScript + Tailwind + shadcn/ui  →  deployed on Vercel
server/   Express + TypeScript + Drizzle ORM                →  deployed on Render
                     ↓
                Neon (serverless Postgres)
```

The client calls the server over a real HTTP API (`POST /api/match`) — there is no
mock data or matching logic in the frontend. The server holds the `opportunities` and
`search_logs` tables via Drizzle ORM against a Neon Postgres database, and CORS is
configured to allow only the deployed frontend origin (plus localhost in dev).

**Endpoints**

- `GET /api/health` — health check
- `GET /api/opportunities` — list all seeded opportunities
- `POST /api/match` — `{ businessName, industry, state }` → `{ exact: [...], fallback: [...] }`

## Assumptions

The brief was intentionally light on some details. Where it was, these are the calls made:

- **Industries**: limited to the 4 named as an example in the brief (Construction, IT,
  Cleaning, Recruiting), enforced as a fixed enum on both client and server.
- **States**: standard two-letter US state abbreviations (+ DC), full 51-option dropdown.
- **"No matches" handling**: interpreted as — if there's no exact industry+state match,
  fall back to other opportunities in the same industry (different state), clearly
  labeled "Industry match" vs "Exact match" so it's never confused with a real match.
  If there's nothing in that industry at all, a plain empty state is shown.
- **Search logging**: kept intentionally simple — one row per submission with the
  match counts, no analytics/dashboard on top of it.
- **Auth, real data ingestion, and AI scoring** were explicitly out of scope for this
  assessment and were not built.

## Running locally

Requires Node 20+ and a Postgres connection string (Neon or otherwise).

**Server**

```bash
cd server
cp .env.example .env   # fill in DATABASE_URL
npm install
npm run db:push        # push the schema to your database
npm run db:seed        # seed the 10 sample opportunities
npm run dev             # http://localhost:3001
```

**Client** (in a second terminal)

```bash
cd client
cp .env.example .env.local   # VITE_API_URL defaults to http://localhost:3001
npm install
npm run dev             # http://localhost:5173
```

**Tests**

```bash
cd server
npm test
```

## Deployment notes

- **Frontend (Vercel)**: project root set to `client/`, framework preset Vite.
  Environment variable `VITE_API_URL` set to the deployed Render backend URL.
- **Backend (Render)**: New Web Service → connect the GitHub repo →
  - Root directory: `server`
  - Build command: `npm install && npm run build`
  - Start command: `npm start`
  - Environment variables: `DATABASE_URL` (Neon connection string) and `CLIENT_ORIGIN`
    (the deployed Vercel URL, so CORS allows it)

  The Neon connection string is never committed — it's only set as an env var on Render
  and in a git-ignored `.env` locally.

## With more time

- Real ingestion from public procurement data sources instead of a seeded sample set.
- A basic auth layer so vendors can save searches and get notified of new matches.
- A less blunt matching/ranking model — weighting by recency, opportunity size, or
  proximity to a vendor's stated qualifications, rather than a plain AND filter.
- E2E tests covering the form → API → results flow, not just the matching unit.
