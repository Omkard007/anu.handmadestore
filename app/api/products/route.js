import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit')) || undefined;
  const skip = parseInt(searchParams.get('skip')) || 0;
  const excludeImage = searchParams.get('excludeImage') === 'true';

  try {
    const products = await prisma.product.findMany({
      where: category && category !== 'All' ? { category } : {},
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: skip,
      select: excludeImage ? {
        id: true,
        name: true,
        price: true,
        category: true,
        description: true,
        inStock: true,
        rating: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true,
      } : undefined
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
