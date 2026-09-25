import { NextRequest, NextResponse } from 'next/server';
import { submitOrder, fetchOrders } from '@/lib/dataStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const orders = await fetchOrders({ email, status, limit });

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve orders', error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const { customer, items, subtotal, shipping, tax, total, shippingMethod, paymentMethod } = body;

    if (!customer || !customer.firstName || !customer.lastName || !customer.workEmail || !customer.address) {
      return NextResponse.json(
        { success: false, message: 'Missing required customer contact or delivery details' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot place an order with an empty cart' },
        { status: 400 }
      );
    }

    const order = await submitOrder({
      customer,
      items,
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      shippingMethod: shippingMethod || 'standard',
      paymentMethod: paymentMethod || 'invoice',
      notes: body.notes
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: order
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order submission', error: error?.message },
      { status: 500 }
    );
  }
}
