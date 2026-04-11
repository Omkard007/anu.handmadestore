import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

async function isAdmin(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === 'ADMIN';
  } catch (err) {
    return false;
  }
}

export async function GET(request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || undefined;
  const skip = parseInt(searchParams.get('skip')) || 0;
  const excludeImage = searchParams.get('excludeImage') === 'true';

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
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
    console.error('Admin fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        category: body.category,
        description: body.description,
        imagePath: body.imagePath,
        inStock: body.inStock ?? true,
        rating: parseFloat(body.rating ?? 0),
        isFeatured: body.isFeatured ?? false,
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
