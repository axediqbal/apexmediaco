import { NextRequest, NextResponse } from 'next/server';
import { fetchProductById } from '@/lib/dataStore';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await fetchProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: `Product with identifier '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error while fetching product' },
      { status: 500 }
    );
  }
}
