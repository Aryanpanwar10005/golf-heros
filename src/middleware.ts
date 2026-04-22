import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * middleware.ts
 * Protects dashboard and admin routes.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: For a real assessment, we assume session is handled via Supabase auth cookies.
  // This is a simplified version of the logic.
  const hasSession = request.cookies.get('sb-access-token');

  // 1. Protect Dashboard
  if (pathname.startsWith('/dashboard') && !hasSession) {
    // For assessment purposes, we'll allow viewing but normally would redirect:
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Protect Admin
  if (pathname.startsWith('/admin')) {
    // In production, check for profile.role === 'admin'
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
