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

export async function PATCH(request, { params }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price ? parseFloat(body.price) : undefined,
        category: body.category,
        description: body.description,
        imagePath: body.imagePath,
        inStock: body.inStock,
        rating: body.rating ? parseFloat(body.rating) : undefined,
        isFeatured: body.isFeatured,
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Force delete: first remove all order items referencing this product, then delete the product
    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { productId: id }
      }),
      prisma.product.delete({
        where: { id }
      })
    ]);
    
    return NextResponse.json({ message: 'Product and related order history deleted' });
  } catch (error) {
    console.error('Force delete error:', error);
    return NextResponse.json({ error: 'Failed to force delete product' }, { status: 500 });
  }
}
