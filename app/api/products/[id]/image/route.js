import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { imagePath: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ imagePath: product.imagePath });
  } catch (error) {
    console.error('Fetch product image error:', error);
    return NextResponse.json({ error: 'Failed to fetch product image' }, { status: 500 });
  }
}
