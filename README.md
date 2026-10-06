# GatePass Management System — Deployment Practice

Simple full-stack project for practicing:
- Frontend: HTML + CSS + JavaScript → Vercel
- Backend: Node.js + Express → Render
- Database: Supabase PostgreSQL

## Project structure

gatepass-deployment-practice/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
└── supabase/
    └── schema.sql

## Local setup

### 1. Create Supabase database
Open Supabase SQL Editor and run `supabase/schema.sql`.

### 2. Backend
Open a terminal in `backend`:

```bash
npm install
```

Create `.env` from `.env.example`:

```env
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_publishable_key
```

Then:

```bash
npm start
```

Backend runs at:
http://localhost:3001

Test:
http://localhost:3001/api/health

### 3. Frontend
In `frontend/app.js`, set:

```js
const API_URL = "http://localhost:3001/api";
```

Open `frontend/index.html` in a browser.

## Deployment

### Supabase
Create the project, run `supabase/schema.sql`, then copy:
- Project URL
- API key

### Render
Create a new Web Service from the GitHub repository.

Root Directory:
backend

Build Command:
npm install

Start Command:
npm start

Environment variables:
SUPABASE_URL=...
SUPABASE_KEY=...

Render gives you a URL such as:
https://your-gatepass-api.onrender.com

### Vercel
Create a new project from the GitHub repository.

Root Directory:
frontend

Framework Preset:
Other

Build Command:
leave empty

Output Directory:
leave empty

Before deploying, change `API_URL` in `frontend/app.js` to your Render URL:

```js
const API_URL = "https://your-gatepass-api.onrender.com/api";
```

Then deploy.

## Important
Do NOT put Supabase keys or Render secrets directly into frontend JavaScript.

For this practice project, the Supabase key is used only by the backend.
