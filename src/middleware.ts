import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES, ADMIN_ROUTES } from '@/constants';

/**
 * Middleware for route protection and authentication
 * Handles public routes, protected routes, and role-based access
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('hiprotech_access_token')?.value;

  // Check if route is public (no auth required)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // Check if route requires admin access
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  // Allow public routes
  if (isPublicRoute) {
    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (accessToken && (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER)) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (isProtectedRoute || isAdminRoute) {
    if (!accessToken) {
      // Redirect to login with return URL
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode token to check validity and role
      const decodedToken = jwt.decode(accessToken) as any;
      
      if (!decodedToken || !decodedToken.exp) {
        throw new Error('Invalid token');
      }

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        loginUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check admin role for admin routes
      if (isAdminRoute && decodedToken.role !== 'admin') {
        return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
      }

    } catch (error) {
      // Token is invalid, redirect to login
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure middleware matcher
export const config = {
  /*
   * Match all request paths except for:
   * 1. /api (API routes)
   * 2. /_next (Next.js internals)
   * 3. /_static (inside /public)
   * 4. All root files inside /public (e.g. /favicon.ico)
   */
  matcher: [
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};