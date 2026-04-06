# CruxOS

CruxOS is a climbing performance product prototype built around one weekly question:

> **What should I repeat or avoid this week to climb better?**

It combines a **mobile capture surface** for fast session logging with a **web analysis surface** for explainable, evidence-backed insights.

## Product Shape

### Mobile: capture fast
The Expo mobile app is designed for in-the-moment logging.

Current focus:
- quick climbing session capture
- minimal adjacent inputs for guidance quality
- recent-session review
- lightweight weekly guidance access via API

### Web: understand the week
The Next.js app is the deeper analysis surface.

Current focus:
- account-scoped dashboard
- logging hub
- recent history
- **28-day Performance Insight Report**
- weekly guidance that is shown only when the data is strong enough

## Core Product Idea

CruxOS does **not** use ML or opaque scoring.

Instead, it uses a deterministic insight engine that:
- anchors on **hardest grade sent per session**
- compares recent sessions under different conditions
- surfaces clear comparisons like:
  - 7+ hours sleep vs under 7 hours
  - high finger stress vs controlled load
  - 110g+ protein vs under 110g
- turns the strongest recent pattern into a weekly “repeat or avoid” recommendation
- withholds strong guidance when recent data is too sparse or not trustworthy yet

That makes the product easier to explain, debug, and trust.

## Architecture

### Web app
- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React
- **Data access:** Prisma
- **Database:** SQLite
- **Charts:** Recharts
- **Validation:** Zod

### Mobile app
- **Framework:** Expo + React Native
- **Location:** `apps/mobile`
- **Role:** thin capture client that talks to the Next.js API

### Shared backend shape
The web app currently acts as both:
- the web frontend
- the API/backend for web + mobile

Key backend responsibilities:
- auth/session handling
- user-scoped persistence
- logging services
- deterministic report generation
- weekly guidance gating

## Key Flows

### 1. Auth
Users can:
- create an account
- sign in
- use the seeded demo account for portfolio/demo review

### 2. Logging
Web and mobile both support climbing-first capture.

Relevant data domains in the current system:
- climbing sessions
- sleep
- nutrition
- bodyweight
- hangboard sessions
- finger rehab / pain

### 3. Insight engine
The report compares recent climbing outcomes against recovery/load signals and produces explainable insight cards.

### 4. Weekly guidance
CruxOS promotes the strongest current pattern into a weekly recommendation only when the sample is sufficient.

If not, it explicitly says there is **not enough data yet**.

## Important Routes

### Web pages
- `/` — dashboard + weekly guidance
- `/auth` — sign in / register / demo access
- `/log` — logging hub
- `/history` — recent entries
- `/reports/performance` — 28-day report

### API routes
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/register`
- `/api/auth/session`
- `/api/climbing-sessions`
- `/api/weekly-guidance`
- `/api/mobile/overview`
- `/api/test/reset`

## Repo Layout

```text
app/              Next.js pages and API routes
components/       web UI components
lib/              auth, services, reports, queries, validation
prisma/           schema + seed
apps/mobile/      Expo mobile app
tests/e2e/        Playwright end-to-end tests
```

## Run Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Prepare the database
```bash
npm run db:push
npm run db:seed
```

### 3. Start the web app
```bash
npm run dev
```

Open:
```text
http://localhost:3000
```

### 4. Start the mobile app
In a second terminal:
```bash
npm run mobile:start
```

If testing on a physical device, point the mobile app at your LAN-accessible Next.js server URL.

## Demo / Reset Flow

Reset the demo database state:
```bash
npm run db:seed
```

For Playwright/E2E, the repo also exposes:
- `POST /api/test/reset`

That route is used only in test mode to restore seeded state.

## Verification Commands

### Web
```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

### Mobile
```bash
npm run typecheck:mobile
npm run test:mobile
```

## Why This Is Portfolio-Worthy

CruxOS demonstrates:
- product thinking, not just UI implementation
- a clear split between **capture** and **analysis** surfaces
- deterministic analytics instead of black-box outputs
- full-stack ownership across app, API, data model, seed flows, and tests
- a realistic progression from single-user demo to account-scoped product prototype

## Current Scope Boundaries

Explicitly out of scope for this version:
- wearables / Apple Health integrations
- ML / prediction
- social features
- all-in-one coaching platform sprawl
- opaque performance scoring

## Best Demo Path

If you are reviewing CruxOS quickly:
1. open the dashboard
2. check the weekly guidance state
3. open the 28-day Performance Insight Report
4. review the mobile app as the fast capture companion
