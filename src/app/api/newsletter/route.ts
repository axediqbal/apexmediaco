import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/dataStore';
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter — Subscribe an email to the Agency Dispatch list.
 * Public endpoint with validation, abuse rate limiting, and idempotent
 * semantics (subscribing twice is not an error).
 */
export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(`newsletter:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 })) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const email = String(body?.email ?? '').trim();

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const { subscription, isNew } = await subscribeNewsletter(email);

    return NextResponse.json(
      {
        success: true,
        message: isNew
          ? 'Subscribed to Agency Dispatch'
          : 'This email is already subscribed to Agency Dispatch',
        data: { email: subscription.email },
      },
      { status: isNew ? 201 : 200 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
