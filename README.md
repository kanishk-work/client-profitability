# Client Profitability Tracker

A full-stack system for calculating client profitability based on time spent by different roles.

## Tech Stack

- **Backend:** Node.js, Express, TypeORM, PostgreSQL, Zod
- **Frontend:** React, Vite, TypeScript, Ant Design, Tailwind CSS, RTK Query

## Quick Start (Docker)
```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

## Local Development

### Backend
```bash
cd backend
cp .env.example .env   # update DB credentials if needed
npm install
npm run migration:run
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/roles | List roles |
| POST | /api/roles | Create role |
| GET | /api/clients | List clients |
| POST | /api/clients | Create client |
| POST | /api/revenue | Set monthly revenue |
| GET | /api/time-entries | List entries (filter by client/month) |
| POST | /api/time-entries | Add time entry |
| GET | /api/profitability?month=YYYY-MM-DD | Dashboard data |
| GET | /api/profitability/:clientId?month=YYYY-MM-DD | Client role breakdown |

## Core Calculations

For a given client and month:

- **Delivery Cost** = sum(hours × role cost per hour)
- **Gross Margin** = revenue − delivery cost
- **Margin %** = gross margin / revenue × 100
- **Hours Variance %** = (actual − estimated) / estimated × 100

## Assumptions

- Monthly salary represents the cost for that month (not annual)
- Productive hours defaults to 160 hrs/month (standard working month)
- A client must have revenue set for a month to appear in the dashboard
- Hours variance is only shown when estimated hours are provided

## Running Tests
```bash
cd backend
npm test
```