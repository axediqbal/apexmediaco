import { NextRequest, NextResponse } from 'next/server';
import { fetchOrderById } from '@/lib/dataStore';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const order = await fetchOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: `Order '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error while fetching order', error: error?.message },
      { status: 500 }
    );
  }
}
