import { NextRequest } from 'next/server';
import { POST as CheckoutPost } from '@/app/api/create-checkout-session/route';

// Minimal auth wrapper for withAuth (the route exports POST = withAuth(handler))
// We call the inner handler by simulating the auth, but since it's wrapped,
// we'll pass through by constructing a request compatible with Next runtime.

function makeRequest(body: any) {
  const url = 'http://localhost/api/create-checkout-session';
  const req = new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  // @ts-ignore - NextRequest accepts a Request in runtime
  return new NextRequest(req);
}

describe('API /api/create-checkout-session (demo mode)', () => {
  const OLD_DEMO = process.env.STRIPE_DEMO_MODE;

  beforeAll(() => {
    process.env.STRIPE_DEMO_MODE = '1'; // force demo
  });

  afterAll(() => {
    process.env.STRIPE_DEMO_MODE = OLD_DEMO;
  });

  it('returns a simulated Stripe URL in demo mode', async () => {
    const req = makeRequest({
      courseId: 'course_demo',
      date: new Date().toISOString(),
      userId: 'user_demo',
    });

    const res = await CheckoutPost(req as any);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.url).toMatch(/https:\/\/checkout\.stripe\.com\/pay\/demo_/);
  });
});