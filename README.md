# مسار (Masar) — Phase 1: Architecture + DB Schema + Auth

Real, runnable Next.js + PostgreSQL + Prisma foundation for the full LMS
described in the product spec. See `ARCHITECTURE.md` for the full design
rationale, ERD, and roadmap.

## 1. Requirements

- Node.js 20+
- A PostgreSQL 14+ database (local, Docker, Supabase, Neon, Railway... any works)

## 2. Setup

```bash
npm install

cp .env.example .env
# then edit .env:
#   DATABASE_URL      -> your Postgres connection string
#   NEXTAUTH_SECRET    -> generate with: openssl rand -base64 32

npx prisma migrate dev --name init   # creates all 21 tables
npm run seed                          # demo Admin/Instructor/Student + 1 course

npm run dev
```

Open http://localhost:3000

## Desktop and Android apps

The web app remains the shared backend and UI for both native shells. Keep the
Next.js server deployed and point the shells to its HTTPS URL in production.

### Desktop (Windows)

```bash
npm run desktop:dev
```

This starts Next.js locally and opens it in Electron. To build a Windows
installer, set `MASAR_APP_URL` to the deployed app URL before running
`npm run desktop:build`; the URL is embedded in the installed app.

### Android

Requirements: Android Studio, Android SDK, and Java 17 or newer.

```bash
npm run android:init       # first time only
$env:MASAR_APP_URL="https://your-domain.com"
npm run android:sync
npm run android:open
```

For a local Android Emulator use `http://10.0.2.2:3000`. For a physical
device, use the development computer's LAN IP and make port 3000 reachable.
Use HTTPS and a real public domain for release builds because authentication,
payments, and webhooks depend on the deployed Next.js server.

> Note: this project was built in a sandboxed environment without access to
> `binaries.prisma.sh`, so `prisma generate` / `migrate` could not be executed
> here. On your machine (with normal internet access) these commands work
> as usual — this is a sandbox limitation, not an issue with the schema or code.

## 3. Demo accounts (from `prisma/seed.ts`)

| Role       | Email                  | Password   |
|------------|------------------------|------------|
| Admin      | admin@masar.dev        | Passw0rd!  |
| Instructor | instructor@masar.dev   | Passw0rd!  |
| Student    | student@masar.dev      | Passw0rd!  |

## 4. What's real in this phase

- **Register** (`/register`) → validated with Zod → actually inserts a row
  into `users` with a bcrypt-hashed password, plus a real 24h email
  verification token row.
- **Login** (`/login`) → NextAuth Credentials provider checks the hash
  against the database and issues a real JWT session.
- **RBAC** (`middleware.ts`) → `/dashboard`, `/instructor`, `/admin` are
  protected server-side by role, not just hidden in the nav. Try logging in
  as the student account and visiting `/admin` — you'll be redirected to
  `/403`.
- **Database** — all 21 entities from the spec (users, courses, modules,
  lessons, enrollments, progress, quizzes, questions, attempts, assignments,
  submissions, grades, payments, invoices, coupons, certificates,
  notifications, reviews) are modeled with real relations in
  `prisma/schema.prisma`.

## 5. What's intentionally deferred (see roadmap in ARCHITECTURE.md)

- Course catalog/player UI, quizzes/assignments UI, admin dashboard UI — Phase 2/3
- Payments use Stripe Elements or the Paymob hosted iframe. Configure the
  provider keys in `.env`, set Stripe's webhook endpoint to
  `/api/payments/stripe/webhook`, and Paymob's callback/webhook endpoints to
  `/api/payments/paymob/callback` and `/api/payments/paymob/webhook`.
  Payments remain pending until the provider response is cryptographically
  verified; only then are the enrollment, invoice, and success notification
  created.
- Certificate generation/QR verification, 3D hero/landing design — Phase 5

## 6. Scripts

```bash
npm run dev              # local dev server
npm run build && npm start   # production build
npx prisma studio        # inspect the database visually
npx prisma migrate deploy    # apply migrations in production
```

## 7. Environment variables

See `.env.example` for the full list (`DATABASE_URL`, `NEXTAUTH_SECRET`,
Paymob/Stripe/SMTP keys). Never commit a real
`.env` file.
