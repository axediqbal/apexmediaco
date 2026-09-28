import { NextRequest, NextResponse } from 'next/server';
import { joinWaitlist } from '@/lib/dataStore';
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/waitlist — Join the pre-order waitlist for a sold-out product.
 * Public endpoint with validation, abuse rate limiting, and idempotent
 * semantics per (productId, email).
 */
export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(`waitlist:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 })) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const productId = String(body?.productId ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const name = body?.name ? String(body.name).trim().slice(0, 120) : undefined;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'A product is required to join the waitlist' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required' },
        { status: 400 }
      );
    }

    try {
      const { entry, isNew } = await joinWaitlist(productId, email, name);
      return NextResponse.json(
        {
          success: true,
          message: isNew
            ? `You're on the waitlist for ${entry.productName}`
            : `This email is already on the waitlist for ${entry.productName}`,
          data: { productId: entry.productId, productName: entry.productName, email: entry.email },
        },
        { status: isNew ? 201 : 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { success: false, message: (err as Error).message || 'Unknown product' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to join the waitlist. Please try again.' },
      { status: 500 }
    );
  }
}
