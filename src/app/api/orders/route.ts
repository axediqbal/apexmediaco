import { NextRequest, NextResponse } from 'next/server';
import { submitOrder, fetchOrders, fetchProductById } from '@/lib/dataStore';

/**
 * GET /api/orders — ADMIN ONLY.
 * Requires the x-admin-key header to match the ADMIN_API_KEY env var.
 * Fails closed: if no admin key is configured, every request is rejected.
 * Previously this endpoint listed every order (with customer PII) to anyone.
 */
export async function GET(request: NextRequest) {
  try {
    const adminKey = process.env.ADMIN_API_KEY;
    const providedKey = request.headers.get('x-admin-key');

    if (!adminKey || providedKey !== adminKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

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
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}

// Pricing rules — single source of truth, mirrored from the storefront.
// Must stay in sync with src/context/CartContext.tsx.
const STANDARD_SHIPPING = 45;
const FREE_SHIPPING_THRESHOLD = 1500;
const WHITE_GLOVE_SURCHARGE = 150;
const TAX_RATE = 0.0825;

const VALID_SHIPPING_METHODS = ['standard', 'express', 'white-glove'] as const;
const VALID_PAYMENT_METHODS = ['invoice', 'corporate-card'] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation — customer details
    const { customer, items } = body;

    const requiredCustomerFields = [
      'firstName', 'lastName', 'companyName', 'workEmail', 'phone',
      'address', 'city', 'state', 'postalCode', 'country',
    ] as const;

    if (!customer || requiredCustomerFields.some((f) => !String(customer[f] ?? '').trim())) {
      return NextResponse.json(
        { success: false, message: 'Missing required customer contact or delivery details' },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(String(customer.workEmail))) {
      return NextResponse.json(
        { success: false, message: 'A valid work email address is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot place an order with an empty cart' },
        { status: 400 }
      );
    }

    // SECURITY: never trust client-supplied totals. Re-price every line
    // against the catalog and recompute shipping/tax server-side.
    const pricedItems: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      image: string;
      selectedVariants: Record<string, string>;
    }> = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = String(item?.productId || '');
      const quantity = Math.floor(Number(item?.quantity));

      if (!productId || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json(
          { success: false, message: 'Each cart item needs a valid product and a quantity between 1 and 99' },
          { status: 400 }
        );
      }

      const product = await fetchProductById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Unknown product: ${productId}` },
          { status: 400 }
        );
      }

      subtotal += product.price * quantity;
      pricedItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        image: product.images?.[0] ?? '',
        selectedVariants: item?.selectedVariants ?? {},
      });
    }

    const shippingMethod = VALID_SHIPPING_METHODS.includes(body.shippingMethod)
      ? body.shippingMethod
      : 'standard';
    const paymentMethod = VALID_PAYMENT_METHODS.includes(body.paymentMethod)
      ? body.paymentMethod
      : 'invoice';

    let shipping = subtotal > 0 ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING) : 0;
    if (shippingMethod === 'white-glove') {
      shipping += WHITE_GLOVE_SURCHARGE;
    }
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + shipping + tax;

    const order = await submitOrder({
      customer: {
        firstName: String(customer.firstName).trim(),
        lastName: String(customer.lastName).trim(),
        companyName: String(customer.companyName).trim(),
        workEmail: String(customer.workEmail).trim(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        suite: customer.suite ? String(customer.suite).trim() : undefined,
        city: String(customer.city).trim(),
        state: String(customer.state).trim(),
        postalCode: String(customer.postalCode).trim(),
        country: String(customer.country).trim(),
        deliveryInstructions: customer.deliveryInstructions
          ? String(customer.deliveryInstructions).trim()
          : undefined,
      },
      items: pricedItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingMethod,
      paymentMethod,
      notes: body.notes ? String(body.notes) : undefined,
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
