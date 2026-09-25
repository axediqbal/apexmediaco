import { NextRequest, NextResponse } from 'next/server';
import { seedProducts } from '@/lib/dataStore';

export async function POST(request: NextRequest) {
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
      { success: false, message: 'Internal Server Error while seeding database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await seedProducts(false);
  return NextResponse.json({
    success: true,
    message: `Database ready in ${result.mode} mode`,
    count: result.count
  });
}
