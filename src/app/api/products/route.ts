import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/dataStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const products = await fetchProducts({ category, search, sort });
    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error while fetching products' },
      { status: 500 }
    );
  }
}
