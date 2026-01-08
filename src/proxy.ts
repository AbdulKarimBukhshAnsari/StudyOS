import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { ROUTES, isAuthPage, isPrivateRoute } from '@/constants/routes';
import { checkOnBoardingStatus } from './serverActions/auth/action';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.user;
    const isAuth = isAuthPage(pathname);
    const isDashboard = isPrivateRoute(pathname) && pathname.startsWith(ROUTES.private.dashboard);
    const isOnboarding = pathname.startsWith(ROUTES.private.onboarding.base);
    const isRoot = pathname === ROUTES.public.home;

    // Check onboarding status once for authenticated users
    let isOnboarded = false;
    if (isAuthenticated) {
      try {
        isOnboarded = await checkOnBoardingStatus();
      } catch {
        // If check fails, allow access to continue
      }
    }

    // If user is authenticated and onboarded, redirect from login/root/onboarding to dashboard
    if (isAuthenticated && isOnboarded) {
      if (isAuth || isRoot || isOnboarding) {
        return NextResponse.redirect(new URL(ROUTES.private.dashboard, request.url));
      }
    }

    // If user is authenticated and tries to access auth pages but not onboarded, redirect to onboarding
    if (isAuthenticated && isAuth && !isOnboarded) {
      return NextResponse.redirect(new URL(ROUTES.private.onboarding.step1, request.url));
    }

    // If user is not authenticated and tries to access dashboard or onboarding, redirect to login
    if (!isAuthenticated && (isDashboard || isOnboarding)) {
      return NextResponse.redirect(new URL(ROUTES.public.login, request.url));
    }

    // If user is authenticated but not onboarded and tries to access dashboard, redirect to onboarding
    if (isAuthenticated && isDashboard && !isOnboarded) {
      return NextResponse.redirect(new URL(ROUTES.private.onboarding.step1, request.url));
    }

    // If user is authenticated and on root but not onboarded, redirect to onboarding
    if (isAuthenticated && isRoot && !isOnboarded) {
      return NextResponse.redirect(new URL(ROUTES.private.onboarding.step1, request.url));
    }

    // If user is authenticated and on root and onboarded, redirect to dashboard
    if (isAuthenticated && isRoot && isOnboarded) {
      return NextResponse.redirect(new URL(ROUTES.private.dashboard, request.url));
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

