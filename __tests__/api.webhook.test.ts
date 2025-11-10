/* Mock NextAuth to avoid heavy imports in Jest; webhook does not use it but keeps consistency */
jest.mock('next-auth', () => ({
  getServerSession: async () => ({
    user: { id: 'user_demo', email: 'demo@example.com', name: 'Demo', role: 'CLIENT' },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  }),
}));

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

/**
 * @jest-environment node
 */

describe('API /api/webhook (demo mode)', () => {
  const OLD_DEMO = process.env.STRIPE_DEMO_MODE;

  beforeAll(() => {
    process.env.STRIPE_DEMO_MODE = '1';
  });

  afterAll(() => {
    process.env.STRIPE_DEMO_MODE = OLD_DEMO;
  });

  it('accepts demo webhook payloads when demo mode is enabled', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const req = makeRequest({
      sessionId: `demo_${Date.now()}`,
      metadata: {
        courseId: '11111111-1111-1111-1111-111111111111',
        date: future,
        userId: '22222222-2222-2222-2222-222222222222',
        bookingType: 'course_booking',
      },
    });

    const res = await WebhookPost(req as any);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.received).toBe(true);
    expect(json.eventType).toMatch(/demo/);
  });
});