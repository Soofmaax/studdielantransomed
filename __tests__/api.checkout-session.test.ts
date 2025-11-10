/* Mock NextAuth to avoid importing openid-client in Jest environment */
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

import { POST as CheckoutPost } from '@/app/api/create-checkout-session/route';

/* Build a minimal request-like object compatible with our route handler expectations */
function makeRequest(body: any) {
  const url = 'http://localhost/api/create-checkout-session';
  return {
    headers: new Headers({ 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' }),
    text: async () => JSON.stringify(body),
    json: async () => body,
    nextUrl: new URL(url),
  } as any;
}

/**
 * @jest-environment node
 */

describe('API /api/create-checkout-session (demo mode)', () => {
  const OLD_DEMO = process.env.STRIPE_DEMO_MODE;

  beforeAll(() => {
    process.env.STRIPE_DEMO_MODE = '1'; // force demo
  });

  afterAll(() => {
    process.env.STRIPE_DEMO_MODE = OLD_DEMO;
  });

  it('returns a simulated Stripe URL in demo mode', async () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const req = makeRequest({
      courseId: '11111111-1111-1111-1111-111111111111',
      date: future,
      userId: '22222222-2222-2222-2222-222222222222',
    });

    const res = await CheckoutPost(req as any);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.url).toMatch(/https:\/\/checkout\.stripe\.com\/pay\/demo_/);
  });
});