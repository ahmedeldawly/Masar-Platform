# Masar (مسار) — Architecture — Phase 1

## 1. Stack

| Layer      | Choice                                              |
|------------|------------------------------------------------------|
| Frontend   | Next.js 14 (App Router) + TypeScript + Tailwind CSS   |
| Backend    | Next.js API Routes (co-located, same deploy unit)     |
| Database   | PostgreSQL                                            |
| ORM        | Prisma                                                |
| Auth       | NextAuth.js (Credentials provider, JWT session)        |
| Validation | Zod + React Hook Form                                  |
| Payments   | Paymob / Stripe (wired in Phase 4, keys not required yet) |

Everything ships as **real, runnable code** — no mocked buttons, no hardcoded
"demo" data outside the seed script. Registration writes a row to `users`;
login checks a real password hash; role-based routes are enforced in
middleware against the JWT, not just hidden in the UI.

## 2. Folder Structure

```
masar-platform/
├── prisma/
│   ├── schema.prisma        # full DB schema (21 models)
│   └── seed.ts              # demo Admin/Instructor/Student + 1 course
├── src/
│   ├── app/
│   │   ├── layout.tsx        # RTL Arabic root layout, dark theme
│   │   ├── page.tsx          # landing page (hero only — full design in Phase 5)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx     # STUDENT/INSTRUCTOR/ADMIN (protected)
│   │   ├── instructor/            # INSTRUCTOR/ADMIN only (protected, Phase 3)
│   │   ├── admin/page.tsx         # ADMIN only (protected)
│   │   ├── 403/page.tsx
│   │   └── api/
│   │       └── auth/
│   │           ├── [...nextauth]/route.ts
│   │           └── register/route.ts
│   ├── components/
│   │   └── providers/session-provider.tsx
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts             # NextAuth options
│   │   ├── hash.ts             # bcrypt helpers
│   │   └── validation/auth.ts  # Zod schemas
│   ├── middleware.ts           # RBAC route guard
│   └── types/next-auth.d.ts
├── .env.example
└── package.json
```

Future phases extend this with `services/` (courses, payments, certificates),
`api/courses`, `api/payments`, `api/admin/*`, etc., following the same
pattern: a Zod-validated route handler → a `lib`/`services` function → Prisma.

## 3. Database (ERD summary)

21 models grouped by domain:

- **Identity**: `User` (role enum: ADMIN/INSTRUCTOR/STUDENT), `InstructorProfile`,
  `VerificationToken`, `PasswordResetToken`
- **Catalog**: `Category`, `Course`, `Module`, `Lesson`
- **Learning**: `Enrollment`, `LessonProgress`, `Quiz`, `Question`, `QuizAttempt`,
  `Assignment`, `Submission`, `Grade`
- **Commerce**: `Payment`, `Invoice`, `Coupon`, `CouponCourse`
- **Engagement**: `Certificate`, `Notification`, `Review`

Design notes:
- Roles are a fixed enum on `User` rather than a separate `Role` table, since
  the product only needs 3 fixed roles (Admin/Instructor/Student) — this
  keeps auth checks a simple `token.role` comparison instead of a join.
- `Enrollment.progressPct` is denormalized (recomputed from `LessonProgress`
  on each completion) so the dashboard/"My Courses" cards don't need to
  aggregate on every read.
- `Payment` never stores card data — only provider, provider reference,
  amount, and status. Enrollment is only created after a **verified** webhook
  updates `Payment.status = PAID` (see Phase 4 payment flow below).

## 4. Auth Flow (implemented in Phase 1)

```
Register  → POST /api/auth/register
            → Zod validation → check duplicate email
            → bcrypt hash (12 rounds) → INSERT users
            → INSERT verification_token (24h expiry)
            → 201 { id, fullName, email, role: STUDENT }

Login     → NextAuth Credentials provider
            → Zod validation → SELECT user by email
            → reject if isSuspended
            → bcrypt.compare(password, passwordHash)
            → JWT { id, role } → session cookie

Protected → middleware.ts intercepts /dashboard/*, /instructor/*, /admin/*
  routes    → withAuth() requires a valid JWT
            → role checked against ROLE_RULES map
            → mismatch → redirect to /403 (not just hidden nav items)
```

Password reset / email verification **sending** (SMTP) and Google OAuth are
scoped to Phase 2 — the schema and token tables already exist so they drop in
without a migration.

## 5. Payment Flow (schema ready now, integration in Phase 4)

```
Student → Select Course → Checkout → Create Payment (status=PENDING)
        → Redirect to Paymob/Stripe → Student pays
        → Provider calls our webhook → verify signature (HMAC/webhook secret)
        → Update Payment.status = PAID (only the backend can do this)
        → Create Enrollment → Generate Invoice → Send notification
```

The frontend **never** flips a course to "enrolled" — that only happens
server-side after webhook verification, per the spec's requirement.

## 6. Roadmap (unchanged from earlier discussion, now more detailed)

1. **Phase 1 (this delivery)** — Architecture, DB schema, Auth (register/login/RBAC), seed data
2. Phase 2 — Course catalog, course details, enrollment (free path), student dashboard, course player, progress tracking
3. Phase 3 — Quizzes, assignments, grades, instructor dashboard/course builder, notifications
4. Phase 4 — Payments (Paymob + Stripe), coupons, invoices, admin dashboard/reports
5. Phase 5 — Certificates + verification, full landing page with 3D/neon design system, RTL/i18n polish, performance/SEO pass

## 7. Security checklist already in place

- [x] Passwords hashed with bcrypt (12 rounds), never logged or returned
- [x] Server-side role checks in middleware (not just UI hiding)
- [x] Zod validation on every input boundary
- [x] Secrets only read from `process.env`, never sent to the client
- [x] Account suspension checked at login
- [x] Card data never touches our database (deferred to Phase 4 payment schema)

Rate limiting, CSRF, and webhook signature verification are implemented
alongside the features that need them (Phase 3/4) rather than added
speculatively now.
