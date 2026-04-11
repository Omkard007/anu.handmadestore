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
    const [productCount, orderCount, recentOrders, allOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true } },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  // exclude imagePath here
                }
              }
            }
          }
        }
      }),
      prisma.order.findMany({
        where: { status: { not: 'CANCELLED' } },
        select: { totalAmount: true, user: { select: { email: true } } }
      })
    ]);

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const uniqueCustomers = new Set(allOrders.map(order => order.user.email)).size;

    return NextResponse.json({
      revenue: totalRevenue,
      orders: orderCount,
      products: productCount,
      customers: uniqueCustomers,
      recentOrders
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
