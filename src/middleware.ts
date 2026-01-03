import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.user;
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password');
    const isDashboard = pathname.startsWith('/dashboard');
    const isRoot = pathname === '/';

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthenticated && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and tries to access dashboard, redirect to login
    if (!isAuthenticated && isDashboard) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user is authenticated and on root, redirect to dashboard
    if (isAuthenticated && isRoot) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    // If there's an error checking session, allow the request to continue
    // The page-level protection will handle it
    console.error('Middleware auth check error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

