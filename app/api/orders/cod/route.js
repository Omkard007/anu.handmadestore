import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { items, totalAmount, shippingDetails } = await req.json();

    if (!items || !items.length || !totalAmount) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    // Validate that all products exist in the database
    const productIds = items.map(item => item.product.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    });

    if (existingProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'Some products in your cart are no longer available' }, { status: 400 });
    }

    // Use a transaction to ensure atomic order creation
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.userId,
          totalAmount: parseFloat(totalAmount),
          status: 'PENDING',
          paymentType: 'COD',
          isPaid: false,
          items: {
            create: items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: parseFloat(item.product.price),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully (COD)', 
      orderId: order.id 
    }, { status: 201 });

  } catch (error) {
    console.error('COD Order Error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
