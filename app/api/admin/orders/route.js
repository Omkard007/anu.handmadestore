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

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { email: true }
        },
        items: {
          include: { 
            product: {
              select: {
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
                // exclude imagePath here
              }
            } 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
