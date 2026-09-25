import { NextRequest, NextResponse } from 'next/server';
import { submitOrder } from '@/lib/dataStore';

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
      paymentMethod: paymentMethod || 'invoice'
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: order
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order submission' },
      { status: 500 }
    );
  }
}
