import { NextRequest, NextResponse } from 'next/server';
import { seedProducts } from '@/lib/dataStore';
import { isRateLimited, getClientIp } from '@/lib/rateLimit';

/**
 * POST /api/seed — ADMIN ONLY.
 * Requires the x-admin-key header to match the ADMIN_API_KEY env var.
 * Fails closed: without a configured key, every request is rejected.
 * `?force=true` re-seeds from scratch and is only available with the key.
 */
function requireAdmin(request: NextRequest): NextResponse | null {
  const adminKey = process.env.ADMIN_API_KEY;
  const providedKey = request.headers.get('x-admin-key');

  if (!adminKey || providedKey !== adminKey) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (isRateLimited(`seed:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    const result = await seedProducts(force);
    return NextResponse.json({
      success: true,
      message: `Database seeded successfully in ${result.mode} mode`,
      count: result.count
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const result = await seedProducts(false);
    return NextResponse.json({
      success: true,
      message: `Database ready in ${result.mode} mode`,
      count: result.count
    });
  } catch (error) {
    console.error('Error preparing database:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to prepare database' },
      { status: 500 }
    );
  }
}
