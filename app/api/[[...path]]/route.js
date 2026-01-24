import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { productsData } from '@/lib/productsData';
import { stripe } from '@/lib/stripe';
import { v4 as uuidv4 } from 'uuid';

const dbName = process.env.DB_NAME || 'jewellery_store';

// Helper to get DB
async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

// GET handler
export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const db = await getDb();

    // Get all products or filter by category
    if (path === 'products') {
      const category = searchParams.get('category');
      
      let products = productsData;
      if (category && category !== 'All Products') {
        products = productsData.filter(p => p.category === category);
      }
      
      return NextResponse.json({
        success: true,
        products
      });
    }

    // Get single product
    if (path.startsWith('products/')) {
      const id = path.split('/')[1];
      const product = productsData.find(p => p.id === id);
      
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        product
      });
    }

    // Get cart items
    if (path === 'cart') {
      const sessionId = searchParams.get('sessionId') || 'default';
      
      const cart = await db.collection('carts').findOne({ sessionId });
      
      return NextResponse.json({
        success: true,
        items: cart?.items || []
      });
    }

    // Get orders
    if (path === 'orders') {
      const sessionId = searchParams.get('sessionId');
      
      const query = sessionId ? { sessionId } : {};
      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({
        success: true,
        orders
      });
    }

    // Get single order
    if (path.startsWith('orders/')) {
      const orderId = path.split('/')[1];
      
      const order = await db.collection('orders').findOne({ orderId });
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        order
      });
    }

    return NextResponse.json(
      { success: false, error: 'Endpoint not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const db = await getDb();
    const body = await request.json();

    // Add to cart
    if (path === 'cart') {
      const { productId, quantity = 1, sessionId = 'default' } = body;
      
      const product = productsData.find(p => p.id === productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imagePath: product.imagePath,
        quantity
      };

      await db.collection('carts').updateOne(
        { sessionId },
        {
          $push: { items: cartItem },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Item added to cart'
      });
    }

    // Create payment intent
    if (path === 'create-payment-intent') {
      const { amount, items, sessionId } = body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: 'inr',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          sessionId: sessionId || 'default',
          itemCount: items?.length?.toString() || '0'
        }
      });

      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }

    // Create order
    if (path === 'orders') {
      const {
        sessionId = 'default',
        items,
        shippingAddress,
        paymentIntentId,
        subtotal,
        total
      } = body;

      const orderId = uuidv4();

      const order = {
        orderId,
        sessionId,
        items,
        shippingAddress,
        paymentIntentId,
        subtotal,
        total,
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('orders').insertOne(order);

      // Clear cart after order
      await db.collection('carts').updateOne(
        { sessionId },
        { $set: { items: [], updatedAt: new Date() } }
      );

      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order created successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Endpoint not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const db = await getDb();
    const body = await request.json();

    // Update cart item quantity
    if (path.startsWith('cart/')) {
      const productId = path.split('/')[1];
      const { quantity, sessionId = 'default' } = body;

      await db.collection('carts').updateOne(
        { sessionId, 'items.productId': productId },
        {
          $set: {
            'items.$.quantity': quantity,
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Cart updated'
      });
    }

    // Update order status
    if (path.startsWith('orders/')) {
      const orderId = path.split('/')[1];
      const { paymentStatus, status } = body;

      const updateFields = {};
      if (paymentStatus) updateFields.paymentStatus = paymentStatus;
      if (status) updateFields.status = status;
      updateFields.updatedAt = new Date();

      await db.collection('orders').updateOne(
        { orderId },
        { $set: updateFields }
      );

      return NextResponse.json({
        success: true,
        message: 'Order updated'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Endpoint not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const db = await getDb();

    // Remove from cart
    if (path.startsWith('cart/')) {
      const productId = path.split('/')[1];
      const sessionId = searchParams.get('sessionId') || 'default';

      await db.collection('carts').updateOne(
        { sessionId },
        {
          $pull: { items: { productId } },
          $set: { updatedAt: new Date() }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Endpoint not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}