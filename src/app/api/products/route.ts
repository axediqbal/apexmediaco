import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, createProduct } from '@/lib/dataStore';
import { connectToDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip')!, 10) : undefined;

    const dbStatus = await connectToDatabase();
    const products = await fetchProducts({ category, search, sort, limit, skip });

    return NextResponse.json({
      success: true,
      mode: dbStatus.mode,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error while fetching products', error: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, tagline, description, price, category, images, sku, variants, features, stock } = body;

    if (!name || !slug || !price || !category || !sku) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, slug, price, category, sku are mandatory' },
        { status: 400 }
      );
    }

    const created = await createProduct({
      name,
      slug,
      tagline: tagline || '',
      description: description || '',
      price: Number(price),
      category,
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/placeholder.jpg'],
      variants: variants || [],
      features: features || [],
      stock: stock !== undefined ? Number(stock) : 10,
      rating: 5.0,
      reviewsCount: 0,
      featured: Boolean(body.featured),
      badge: body.badge,
      sku,
      leadTime: body.leadTime || '3-5 Business Days',
      specs: body.specs || {}
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: created
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product', error: error?.message },
      { status: 500 }
    );
  }
}
