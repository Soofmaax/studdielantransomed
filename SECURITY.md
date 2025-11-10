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

## Operational Security Notes

- Stripe demo mode is enabled by default (see README). In demo mode, webhooks can be simulated without real secrets for showcase purposes. To require signed Stripe webhooks and real payments, set:
  - `STRIPE_DEMO_MODE=0`
  - Provide `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.

- Rate limiting is implemented as best‑effort in‑memory for the showcase. For production, use a shared store (e.g., Redis/Upstash) or a WAF/CDN (Cloudflare) for global limits.

- CSP is configured with script nonces; avoid adding inline scripts without a nonce. See `middleware.ts`.

- No secrets should be committed. Use environment variables and managed secret stores in production.

- Monitoring/Observability: Sentry is supported; set `NEXT_PUBLIC_SENTRY_DSN` to enable minimal capture.