# ProHire Starter v7

ProHire is a profession-based hiring marketplace starter built with Next.js App Router, Prisma, PostgreSQL, and Auth.js. Version 7 focuses on deployment readiness: Docker support, CI scaffolding, provider-backed email support with fallback logging, and deeper health checks.

## What's new in v7

- Optional Resend integration in `lib/mailer.ts`
- Dockerfile and `docker-compose.yml` for local containerized development
- GitHub Actions CI workflow for install, Prisma generate, and production build
- Database health endpoint at `/api/health/db`
- Upload adapter scaffold in `lib/storage.ts` with local mode and future S3 hook
- Updated environment template and deployment notes

## Stack

- Next.js 15
- React 19
- Prisma + PostgreSQL
- Auth.js v5 beta with credentials provider
- bcryptjs for password hashing
- Optional Resend for transactional email

## Getting started

### Local Node workflow

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### Docker workflow

```bash
docker compose up --build
```

This starts:
- app on `http://localhost:3000`
- PostgreSQL on `localhost:5432`

## Required environment variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/prohire"
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Optional environment variables

```env
RESEND_API_KEY=""
EMAIL_FROM="ProHire <no-reply@example.com>"
UPLOAD_DRIVER="local"
```

## Demo accounts

After seeding:

- `seeker@example.com` / `password123`
- `employer@example.com` / `password123`
- `admin@example.com` / `password123`

## Health endpoints

- `/api/health` → app liveness
- `/api/health/db` → app + database connectivity

## Email behavior in v7

- If `RESEND_API_KEY` is set, email is sent through Resend
- If not set, email content is logged to the server console for testing

## Upload behavior in v7

- `UPLOAD_DRIVER=local` stores files in `public/uploads/*`
- `UPLOAD_DRIVER=s3` is scaffolded for future implementation and currently falls back to local with a warning

## Suggested deployment path

1. Create a managed PostgreSQL database
2. Set env vars in Vercel or your container host
3. Add `RESEND_API_KEY` and `EMAIL_FROM`
4. Run Prisma migrations or `db push`
5. Seed optional demo data for internal review
6. Deploy and test `/api/health/db`

## Trial flow

1. Register or log in
2. Complete seeker or employer onboarding
3. Employer posts a job
4. Job seeker browses jobs and applies
5. Employer reviews applicants and updates status
6. Test email verification and password reset

## CI

A starter GitHub Actions workflow is included at `.github/workflows/ci.yml`. You should still add your production secrets and preferred test steps.
