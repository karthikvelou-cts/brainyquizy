# BrainAPI Trivia Platform

Full-stack OpenTDB-style trivia database app with JWT auth, admin CRUD, token sessions, filtering, and pagination.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB + Mongoose, JWT, bcrypt, Helmet, CORS, rate limiting
- Frontend: Vue 3 (Composition API), Vue Router, Pinia, Axios, Tailwind CSS, Vite
- Docs/Infra: Swagger UI, Docker, docker-compose

## Project Structure

- `backend/`
  - `models/` `controllers/` `routes/` `middleware/` `config/` `utils/`
  - `server.js`
- `frontend/`
  - `src/components/` `src/views/` `src/router/` `src/stores/` `src/services/`

## Backend Setup

1. `cd backend`
2. `npm install`
3. `copy .env.example .env` (Windows) or `cp .env.example .env`
4. Update `.env` values
5. `npm run seed`
6. `npm run dev`

Backend runs at `http://localhost:5000`.
Swagger docs at `http://localhost:5000/api/docs`.

### Backend Environment Variables

Use `backend/.env.example` as template:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `TOKEN_TTL_HOURS`
- `CORS_ORIGIN`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. `copy .env.example .env` (Windows) or `cp .env.example .env`
4. `npm run dev`

Frontend runs at `http://localhost:5173`.

### Frontend Environment Variables

Use `frontend/.env.example` as template:

- `VITE_API_URL` (default: `http://localhost:5000/api`)

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Categories

- `GET /api/categories`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Questions

- `GET /api/questions?amount=&category=&difficulty=&type=&page=&limit=&token=`
- `POST /api/questions` (admin)
- `PUT /api/questions/:id` (admin)
- `DELETE /api/questions/:id` (admin)
- `POST /api/questions/import` (admin)

### Token Sessions

- `GET /api/token` (JWT required)
- `DELETE /api/token/:token` (JWT required)

### OpenTDB Response Format

Question fetch returns:

```json
{
  "response_code": 0,
  "results": []
}
```

## Seed Data

`npm run seed` creates:

- One admin user (from env vars)
- Categories: General Knowledge, Science, History
- Sample questions

## Sample Question Import (Bonus)

Use `backend/scripts/sample-import.json` with admin token:

```bash
curl -X POST http://localhost:5000/api/questions/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d @backend/scripts/sample-import.json
```

## Security Controls

- Password hashing: `bcryptjs`
- JWT auth middleware
- Role-based access control (`adminOnly`)
- Rate limiting (`express-rate-limit`)
- Secure headers (`helmet`)
- CORS policy (`cors`)

## Docker Setup (Bonus)

1. Create env files:
   - `backend/.env`
   - `frontend/.env`
2. Run:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Deployment Guide (Single Vercel Project)

Deploy from repository root so one Vercel deployment serves both:
- Vue frontend (static build)
- Express API (`/api/*`) as serverless function

### Vercel Setup

1. Create one Vercel project with **Root Directory** = repository root.
2. Vercel will use root `vercel.json` to:
   - Build frontend from `frontend/package.json`
   - Run backend function from `backend/api/index.js`
   - Route `/api/*` to backend
   - Route all other paths to Vue `index.html`
3. Add environment variables in Vercel:
   - `NODE_ENV=production`
   - `MONGO_URI=<your atlas uri>`
   - `JWT_SECRET=<strong secret>`
   - `JWT_EXPIRES_IN=1d`
   - `TOKEN_TTL_HOURS=6`
   - `CORS_ORIGIN=https://<your-project>.vercel.app`
   - `RATE_LIMIT_WINDOW_MS=900000`
   - `RATE_LIMIT_MAX=200`
4. Optional frontend env var:
   - `VITE_API_URL` (can be omitted; defaults to `/api`)

### Post-Deploy Checks

1. Open `https://<your-project>.vercel.app/` and confirm frontend loads.
2. Open `https://<your-project>.vercel.app/api/docs` and verify Swagger loads.
3. Test register/login and question browsing from the deployed frontend.

## Notes

- Admin dashboard supports create/update/delete for categories and questions.
- Browse supports category/difficulty/type filters and pagination.
- JWT and user session are stored in browser `localStorage`.
