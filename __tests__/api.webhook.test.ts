/* Mock NextAuth to avoid heavy imports in Jest; webhook does not use it but keeps consistency */
jest.mock('next-auth', () => ({
  getServerSession: async () => ({
    user: { id: '22222222-2222-2222-2222-222222222222', email: 'demo@example.com', name: 'Demo', role: 'CLIENT' },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }),
}));

// Ensure NextResponse.json works under Jest by providing a static Response.json
if (!(global as any).Response?.json) {
  (global as any).Response.json = (body: any, init?: any) =>
    new (global as any).Response(JSON.stringify(body), {
      ...(init || {}),
      headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    });
}

import { POST as WebhookPost } from '@/app/api/webhook/route';

function makeRequest(body: any) {
  const url = 'http://localhost/api/webhook';
  return {
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () => JSON.stringify(body),
    json: async () => body,
    nextUrl: new URL(url),
  } as any;
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
    const req = makeRequest({
      sessionId: `demo_${Date.now()}`,
      // No metadata to avoid DB calls (Prisma) in demo test environment
    });

    const res = await WebhookPost(req as any);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.received).toBe(true);
    expect(json.eventType).toMatch(/demo/);
  });
});