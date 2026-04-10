import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const publicPaths = ['/', '/auth', '/api/auth/login', '/api/auth/signup', '/api/auth/logout'];
  
  // Static assets and internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  // Allow access to the home page for all users
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Redirect to home if already logged in and trying to access auth page
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to auth if trying to access a restricted path without a token
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
