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
  - `STRIPE_DEMO_MODE=1` – demo mode enabled by default
  - `STRIPE_SECRET_KEY` – set when STRIPE_DEMO_MODE=0
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – set when STRIPE_DEMO_MODE=0
  - `STRIPE_WEBHOOK_SECRET` – set when STRIPE_DEMO_MODE=0
- Monitoring
  - `NEXT_PUBLIC_SENTRY_DSN` – optional
- E2E
  - `NEXT_PUBLIC_E2E` – optional, surface test controls in /reservation

## Demo vs Live

- Demo (default):
  - `STRIPE_DEMO_MODE=1`
  - Checkout returns simulated Stripe URL
  - Webhook accepts JSON payloads to simulate `checkout.session.completed`
- Live:
  - `STRIPE_DEMO_MODE=0`
  - Provide `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - Webhook requires signed Stripe requests

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