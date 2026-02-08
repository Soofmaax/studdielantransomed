# Security Policy

We take security seriously. Please follow these guidelines.

## Supported Versions

This repository is maintained as a showcase with production-ready patterns. Security fixes are applied on `main`.

## Reporting a Vulnerability

- Open a private security advisory on GitHub, or
- Email: security@studio-elan.example (replace with your contact)

Please include:
- Description of the issue
- Steps to reproduce (PoC)
- Impact assessment

## Disclosure

We follow responsible disclosure. We will acknowledge receipt within 72 hours and provide a remediation timeline.

## Seed credentials & environments

- Prisma seed scripts create convenience users (admin, and a client test user for e2e) in non-production environments.
- In `NODE_ENV=production`, seed scripts refuse to run if the `SEED_*` environment variables are not set (for example `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_CLIENT_EMAIL`, `SEED_CLIENT_PASSWORD`).
- The built-in default credentials are intended for local development only and MUST NOT be reused in production.

## Operational Security Notes

- Stripe demo mode is intended for local/demo environments only (see README). It is only honoured when `STRIPE_DEMO_MODE=1` and `NODE_ENV !== 'production'`. In demo mode, checkouts and webhooks are simulated and protected by `STRIPE_DEMO_WEBHOOK_SECRET`. For production, keep `STRIPE_DEMO_MODE=0` and configure:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`.

- Rate limiting is implemented as best‑effort in‑memory for the showcase. For production, use a shared store (e.g., Redis/Upstash) or a WAF/CDN (Cloudflare) for global limits.

- CSP is configured with script nonces; avoid adding inline scripts without a nonce. See `middleware.ts`.

- No secrets should be committed. Use environment variables and managed secret stores in production.

- Monitoring/Observability: Sentry is supported; set `NEXT_PUBLIC_SENTRY_DSN` to enable minimal capture.