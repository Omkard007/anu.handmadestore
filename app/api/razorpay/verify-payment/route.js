import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      items,
      totalAmount
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !items || !totalAmount) {
      return NextResponse.json({ error: 'Missing details for verification' }, { status: 400 });
    }

    // Verify User Token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Validate that all products exist in the database
    const productIds = items.map(item => item.product.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    });

    if (existingProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'Some products in your order are no longer available' }, { status: 400 });
    }

    // Payment Verified -> Create the order in the database
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.userId,
          totalAmount: parseFloat(totalAmount),
          status: 'PENDING', 
          paymentType: 'ONLINE',
          isPaid: true,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
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
      message: 'Payment verified and order created', 
      orderId: order.id 
    });

  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error during verification' }, { status: 500 });
  }
}
