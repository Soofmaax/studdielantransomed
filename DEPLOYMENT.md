# Deployment Guide

This project is showcase-ready and production-capable. Follow this guide to deploy.

## Environments

- Development: local (`npm run dev`)
- Staging/Production: Vercel or Netlify (recommended)

## Environment Variables

Copy `.env.example` to `.env.local` and fill:

- Core
  - `NEXTAUTH_URL` – base URL
  - `NEXTAUTH_SECRET` – random secret
  - `DATABASE_URL` – Postgres connection
- Stripe
  - `STRIPE_DEMO_MODE` – set to `1` for local demos only; in production only live mode (`STRIPE_DEMO_MODE=0`) is honoured.
  - `STRIPE_SECRET_KEY` – required when `STRIPE_DEMO_MODE=0` (live mode)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – required when `STRIPE_DEMO_MODE=0`
  - `STRIPE_WEBHOOK_SECRET` – required when `STRIPE_DEMO_MODE=0`
  - `STRIPE_DEMO_WEBHOOK_SECRET` – secret used to protect demo webhook calls when `STRIPE_DEMO_MODE=1` and `NODE_ENV !== 'production'`
- Monitoring
  - `NEXT_PUBLIC_SENTRY_DSN` – optional
- E2E
  - `NEXT_PUBLIC_E2E` – optional, surface test controls in /reservation
- Seed scripts
  - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` – required in production before running `npm run db:seed`; defaults are for local/dev only.
  - `SEED_CLIENT_EMAIL`, `SEED_CLIENT_PASSWORD` – client test user used by e2e; required in production if you rely on `prisma/seed.js`.
- Networking / rate limiting
  - `RATE_LIMIT_TRUST_PROXY` – set to `1` only when the app is behind a trusted proxy/load balancer; controls whether `X-Forwarded-For` is trusted for rate limiting.
- Notifications
  - `NOTIFICATIONS_TEST_SECRET` – shared secret to protect the notifications test route.

## Demo vs Live

- Demo (non-production only):
  - Effective only when `STRIPE_DEMO_MODE=1` and `NODE_ENV !== 'production'`
  - Checkout returns simulated Stripe URL
  - Webhook accepts JSON payloads to simulate `checkout.session.completed`, gated by `STRIPE_DEMO_WEBHOOK_SECRET`
- Live (recommended for production):
  - `STRIPE_DEMO_MODE=0`
  - Provide `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - Webhook requires signed Stripe requests

## Before going to production

- Set strong secrets:
  - `NEXTAUTH_SECRET` for NextAuth
  - `JWT_SECRET` for the NestJS backend
  - Stripe keys: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Verify Stripe demo mode:
  - Ensure `STRIPE_DEMO_MODE=0` in production
  - Ensure `STRIPE_DEMO_WEBHOOK_SECRET` is unset or set to a strong random value used only in non-production
- Seed data:
  - Do not run Prisma seed scripts in production without overriding all `SEED_*` variables with strong, unique credentials
- Networking:
  - Set `RATE_LIMIT_TRUST_PROXY=1` only if you are behind a trusted proxy/load balancer; otherwise leave it at `0`

## Health and Readiness

- `/api/health` returns basic status
- `/api/ready` performs a light DB check (`SELECT 1`) and returns 503 if unavailable

## CI/CD

- `.github/workflows/ci.yml` – lint, type-check, tests, build
- `.github/workflows/security.yml` – npm audit and CycloneDX SBOM
- `.github/workflows/codeql.yml` – static analysis

## Rollback

- Use Vercel/Netlify deploy history to rollback
- Keep DB migrations reversible; test rollback path before production

## Notes

- Rate limiting uses in-memory counters for the showcase; use Redis/WAF in production.
- CSP uses nonces for scripts; avoid inline scripts without a nonce.