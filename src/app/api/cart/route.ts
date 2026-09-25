import { NextRequest, NextResponse } from 'next/server';
import { getCart, saveCart, clearCart } from '@/lib/dataStore';

/**
 * GET /api/cart?sessionId=xxx
 * Retrieves the current cart for a session.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'sessionId query parameter is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(sessionId);

    return NextResponse.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve cart', error: error?.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Upserts the cart — saves the full items array for a session.
 * Body: { sessionId: string, items: CartItemRecord[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, items } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'sessionId is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: 'items must be an array of CartItemRecord' },
        { status: 400 }
      );
    }

    const cart = await saveCart(sessionId, items);

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error: any) {
    console.error('Error saving cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save cart', error: error?.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart?sessionId=xxx
 * Clears the cart for a session (e.g. after checkout).
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'sessionId query parameter is required' },
        { status: 400 }
      );
    }

    await clearCart(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cart', error: error?.message },
      { status: 500 }
    );
  }
}
