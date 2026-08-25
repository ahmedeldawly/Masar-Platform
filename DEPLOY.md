Deployment Guide — Masar Platform

Overview
- This document contains quick steps to deploy the app to Vercel or Render and a Dockerfile for container-based hosting.

Required environment variables
- DATABASE_URL — Postgres connection string
- NEXTAUTH_URL — e.g. https://your-domain.com
- NEXTAUTH_SECRET — 32+ byte base64 secret
- SMTP_* (optional) — if you want email features
- STRIPE_* / PAYMOB_* (optional) — payment providers

1) Deploy to Vercel (recommended for Next.js)
- Push your project to GitHub.
- In Vercel, choose "Import Project" and connect your GitHub repo.
- Use Framework Preset: Next.js (auto-detected).
- In Vercel dashboard, add Environment Variables (Production + Preview):
  - DATABASE_URL
  - NEXTAUTH_URL (https://your-domain)
  - NEXTAUTH_SECRET
- Deploy. Vercel will run `npm run build` and serve automatically.

2) Deploy to Render (Docker or Native)
- Option A (Native - Web Service): Select "Web Service", connect repo, build command: `npm run build`, start command: `npm run start -- --hostname 0.0.0.0 --port $PORT`.
- Option B (Docker): Use the provided Dockerfile. Render will build the image and run it.
- Ensure you add environment variables in the Render service settings as above.

3) Docker (for any server)
- Build locally:
  docker build -t masar-platform:latest .
- Run with environment variables:
  docker run -p 3000:3000 -e DATABASE_URL="<your-db>" -e NEXTAUTH_URL="https://your-domain.com" -e NEXTAUTH_SECRET="<secret>" masar-platform:latest

Notes
- For production, set `NEXTAUTH_URL` to your real domain and use HTTPS.
- If you want me to push and configure a GitHub repo or create CI/CD files, tell me and I can prepare them.

Contact me which provider you prefer and whether you want me to create a GitHub repo and CI workflow.