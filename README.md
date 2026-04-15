# Lending Decision System

An end-to-end MSME lending decision platform built for the Vitto SDE Full Stack Assessment. Accepts business profiles and loan requests, runs them through a custom credit scoring engine asynchronously, and returns a structured decision with credit score and reason codes.

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://lending-decision-system-6mle.vercel.app |
| Backend API | https://lending-decision-system-89cr.vercel.app/api |
| Health check | https://lending-decision-system-89cr.vercel.app/api/health |

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express (JavaScript) |
| Primary DB | PostgreSQL (Neon) |
| Audit DB | MongoDB (Atlas) |
| Auth | JWT + pbkdf2 (Node built-in crypto) |
| Deployment | Vercel (frontend + backend) |

## Project Structure

```
Lending Decision System/
├── LDS-frontend/          React + TypeScript SPA
│   └── src/
│       ├── api/           Axios client + all API calls
│       ├── components/    Form sections, result view, shared UI
│       ├── contexts/      ApplicationContext (job state)
│       └── pages/         ApplicationPage, LoginPage, AdminPanel, SuperAdminPanel
└── LDS-backend/           Express REST API + Decision Engine
    ├── server.js          Entry point (dotenv first, then everything else)
    └── src/
        ├── config/        PostgreSQL pool + MongoDB connection
        ├── controllers/   Auth, profiles, loans, decisions, admin
        ├── engine/        Credit scoring — pure function, no DB dependency
        ├── middleware/     Auth (JWT), rate limiter, error handler
        ├── models/        pg/migrations/, mongo/AuditLog + DecisionSnapshot
        ├── routes/        Route definitions
        └── services/      Async decision processor (setImmediate)
```

## Quick Start

### Option 1 — Docker Compose (recommended)

Requires Docker and Docker Compose.

```bash
git clone https://github.com/nikkvijay/Lending-Decision-System.git
cd "Lending Decision System"
docker compose up --build
```

Services start at:
- Frontend → http://localhost:5173
- Backend API → http://localhost:5000/api
- PostgreSQL → localhost:5432
- MongoDB → localhost:27017

Migrations run automatically on first boot. Then seed the admin users:

```bash
docker compose exec api node seed.js
```

### Option 2 — Manual Setup

#### Prerequisites
- Node.js 18+
- PostgreSQL (Neon, Supabase, or local)
- MongoDB (Atlas or local)

#### Backend

```bash
cd LDS-backend
npm install
cp .env.example .env     # fill in your credentials
node seed.js             # create admin + superadmin users
npm run dev              # starts on port 5000
```

**Required environment variables** (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `FRONTEND_URL` | Frontend origin for CORS in production |
| `NODE_ENV` | `development` or `production` |
| `POSTGRES_SSL` | Set to `false` for local/Docker, omit for cloud |

#### Frontend

```bash
cd LDS-frontend
npm install
cp .env.example .env     # set VITE_API_URL=http://localhost:5000/api
npm run dev              # starts on port 5173
```

## Seeded Credentials

After running `node seed.js` in `LDS-backend/`:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `Admin@2025` | admin |
| `superadmin` | `SuperAdmin@2025` | superadmin |

## API Endpoints

All responses use a uniform envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }
```

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | — | Login, returns JWT |
| POST | `/api/profiles` | — | Create business profile |
| GET | `/api/profiles/:id` | — | Get profile |
| POST | `/api/loans` | — | Submit loan application |
| GET | `/api/loans/:id` | — | Get loan |
| POST | `/api/decisions` | — | Trigger async decision → `{ jobId }` |
| GET | `/api/decisions/:jobId/status` | — | Poll decision status |
| GET | `/api/admin/applications` | admin+ | All applications with decisions |
| GET | `/api/admin/stats` | admin+ | Aggregate stats |
| GET | `/api/admin/audit-logs` | superadmin | MongoDB audit trail |
| GET | `/api/health` | — | Health check |

## Decision Engine

A pure function (`runDecisionEngine(input) → { decision, creditScore, reasonCodes, scoringBreakdown }`) with no database dependency. Scores range **300–850**.

### Scoring Components

| Component | Weight | Max Points |
|-----------|--------|-----------|
| Revenue-to-EMI Ratio | 35% | 297.5 |
| Loan Multiple | 30% | 255 |
| Tenure Risk | 15% | 127.5 |
| Business Type | 10% | 85 |
| Fraud / Consistency | 10% | 85 |

**Revenue-to-EMI Ratio** — EMI calculated at 18% annual interest:
```
ratio = monthlyRevenue / EMI

≥ 5.0 → 297.5 pts  ≥ 3.0 → 238 pts  ≥ 2.0 → 178.5 pts
≥ 1.5 → 119 pts    ≥ 1.2 → 59.5 pts  < 1.2 → HARD FAIL (POOR_EMI_RATIO)
```

**Loan Multiple** — `loanAmount / monthlyRevenue`:
```
≤ 6x → 255 pts   ≤ 10x → 204 pts   ≤ 18x → 153 pts
≤ 24x → 102 pts  ≤ 36x → 51 pts    > 36x → HARD FAIL (HIGH_LOAN_RATIO)
```

**Score mapping:** `creditScore = round(300 + (rawScore / 850) × 550)`

**Approval threshold: 650+**

### Reason Codes

| Code | Cause |
|------|-------|
| `POOR_EMI_RATIO` | EMI exceeds repayment capacity (hard fail) |
| `HIGH_LOAN_RATIO` | Loan > 36× monthly revenue (hard fail) |
| `LOW_REVENUE` | Advisory: EMI ratio < 2.5 |
| `DATA_INCONSISTENCY` | Business type or purpose mismatch |
| `SUSPICIOUS_REVENUE_AMOUNT` | Revenue divisible by 100K and > 500K |
| `LOW_LOAN_AMOUNT_ANOMALY` | Large business but tiny loan amount |

### Worked Example

₹1L monthly revenue · ₹5L loan · 24 months · Sole Proprietorship · Working Capital

| Component | Calculation | Score |
|-----------|-------------|-------|
| EMI ratio | EMI ≈ ₹24,965 → ratio 4.0 | 238 pts |
| Loan multiple | 5× | 255 pts |
| Tenure | 24 months | 102 pts |
| Business type | Sole Prop | 42.5 pts |
| Fraud checks | no flags | 85 pts |
| **Total raw** | | **722.5** |
| **Credit score** | 300 + (722.5/850)×550 | **768 → APPROVED** |

## Async Decision Flow

```
POST /api/decisions
  → create decision row (PENDING)
  → setImmediate → worker runs in background
  → respond immediately with { jobId }

Worker (800–2500ms artificial delay):
  1. fetch profile + loan from PostgreSQL
  2. runDecisionEngine(input)
  3. write result to PostgreSQL (COMPLETED)
  4. write DecisionSnapshot to MongoDB
  5. write 4 AuditLog events to MongoDB

GET /api/decisions/:jobId/status
  → poll until COMPLETED or FAILED
```

Frontend polls with progressive backoff: 1s → 1.5s → 2s → 2.5s → 3s → 4s → 5s. Timeout after 30s.

## Admin Access

- `/login` — JWT login (admin and superadmin)
- `/admin` — Applications table, stats, filter by decision
- `/superadmin` — Full dashboard: metrics, score distribution, all applications, audit logs

## Deployment

Both services are deployed on Vercel. Each is a separate Vercel project pointing at the same GitHub repository root with a different `Root Directory` setting.

### Backend (`LDS-backend/`)

Set these environment variables in the Vercel project dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret |
| `FRONTEND_URL` | Frontend Vercel URL |
| `NODE_ENV` | `production` |

### Frontend (`LDS-frontend/`)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Backend Vercel URL + `/api` |
