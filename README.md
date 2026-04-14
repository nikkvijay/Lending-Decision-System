# Lending Decision System

An end-to-end MSME lending decision system built for Vitto's technical assessment.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express (JavaScript) |
| Primary DB | PostgreSQL |
| Audit DB | MongoDB |
| Deployment | Vercel (frontend + backend) |

## Project Structure

```
Lending Decision System/
├── LDS-frontend/   ← React + TypeScript SPA
└── LDS-backend/    ← Express REST API + Decision Engine
```

## Quick Start

### Backend
```bash
cd LDS-backend
npm install
cp .env.example .env   # fill in your DB credentials
npm run dev
```

### Frontend
```bash
cd LDS-frontend
npm install
npm run dev
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/profiles` | Create business profile |
| GET | `/api/profiles/:id` | Get profile |
| POST | `/api/loans` | Submit loan application |
| GET | `/api/loans/:id` | Get loan |
| POST | `/api/decisions` | Trigger async decision (returns jobId) |
| GET | `/api/decisions/:jobId/status` | Poll decision status |
| GET | `/api/health` | Health check |

## Decision Engine

Custom scoring model across 5 components (300–850 score range):

1. **Revenue-to-EMI Ratio** (35%) — EMI calculated at 18% annual rate
2. **Loan Multiple** (30%) — loan amount vs monthly revenue
3. **Tenure Risk** (15%) — shorter tenures score higher
4. **Business Type** (10%) — Private Limited scores highest
5. **Fraud Checks** (10%) — consistency and anomaly detection

**Approval threshold: 650+**

Hard fail conditions (instant rejection regardless of score):
- Revenue-to-EMI ratio < 1.2
- Loan multiple > 36×

## Reason Codes

| Code | Meaning |
|------|---------|
| `POOR_EMI_RATIO` | EMI exceeds repayment capacity |
| `HIGH_LOAN_RATIO` | Loan amount too high vs revenue |
| `LOW_REVENUE` | Revenue insufficient for loan size |
| `DATA_INCONSISTENCY` | Input data inconsistencies detected |
| `SUSPICIOUS_REVENUE_AMOUNT` | Revenue figure requires verification |
| `LOW_LOAN_AMOUNT_ANOMALY` | Loan amount anomalous vs business scale |
