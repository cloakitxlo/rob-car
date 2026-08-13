# Robin Card

Demo crypto debit card dashboard (login, card controls, balances, send/receive, admin).

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open http://localhost:3000

Admin: `admin` / `SuperAdmin@2026`

## Deploy live on Railway (GitHub)

This repo is already set up for Railway. Do **not** upload `node_modules` or `dist` — Railway builds those.

### 1) Put the project on GitHub

From this folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Or create a new GitHub repo and upload/push all project files (keep `.gitignore`).

### 2) Connect Railway

1. Open [https://railway.app](https://railway.app) and sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select this repository
4. Railway will use the included config:
   - Build: `npm install --include=optional && npm run build`
   - Start: `npm start`
   - Health check: `/api/health`
   - Node: 20

No extra environment variables are required for login, dashboard, or admin.

### 3) Get your live URL

1. Open the service → **Settings** → **Networking** → **Generate Domain**
2. Wait until the deploy is **Success**
3. Open the `*.up.railway.app` URL — landing page should load (not blank)

### 4) Optional custom domain

In Railway → **Networking** → **Custom Domain**, add your domain and set the DNS record Railway shows.

## Hosting notes

This is **not** a static HTML site. Do not upload only `index.html` to PHP/shared hosting.

| Setting | Value |
|--------|--------|
| Build command | `npm install --include=optional && npm run build` |
| Start command | `npm start` |
| Port | Railway `PORT` (app already reads it) |
| Node | 18+ (Railway uses 20) |

## Quick test after deploy

Open the live URL → login page should load.  
Admin: `admin` / `SuperAdmin@2026`
