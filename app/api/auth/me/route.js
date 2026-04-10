import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return NextResponse.json({ 
      authenticated: true, 
      user: { 
        id: decoded.userId, 
        email: decoded.email, 
        role: decoded.role 
      } 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
