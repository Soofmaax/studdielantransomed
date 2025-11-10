/**
 * @jest-environment node
 */

/* Mock NextAuth to avoid heavy imports in Jest; webhook does not use it but keeps consistency */
jest.mock('next-auth', () => ({
  getServerSession: async () => ({
    user: { id: '22222222-2222-2222-2222-222222222222', email: 'demo@example.com', name: 'Demo', role: 'CLIENT' },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }),
}));

import type { NextRequest } from 'next/server';
import { POST as WebhookPost } from '@/app/api/webhook/route';

type WebhookDemoPayload = {
  sessionId: string;
};

type RequestLike = {
  headers: Headers;
  text: () => Promise<string>;
  json: () => Promise<unknown>;
  nextUrl: URL;
};

function makeRequest(body: WebhookDemoPayload): RequestLike {
  const url = 'http://localhost/api/webhook';
  return {
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => JSON.stringify(body),
    json: async () => body,
    nextUrl: new URL(url),
  };
}

describe('API /api/webhook (demo mode)', () => {
  const OLD_DEMO = process.env.STRIPE_DEMO_MODE;

  beforeAll(() => {
    process.env.STRIPE_DEMO_MODE = '1';
  });

  afterAll(() => {
    process.env.STRIPE_DEMO_MODE = OLD_DEMO;
  });

  it('accepts demo webhook payloads when demo mode is enabled', async () => {
    const res = await WebhookPost(makeRequest({ sessionId: `demo_${Date.now()}` }) as unknown as NextRequest);

    expect(res.status).toBe(200);

    const text = await res.text();
    const json = JSON.parse(text) as { received: boolean; eventType: string };
    expect(json.received).toBe(true);
    expect(json.eventType).toMatch(/demo/);
  });
});