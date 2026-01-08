/**
 * Application route constants
 * Centralized definition of public and private routes
 */

export const ROUTES = {
  // Public routes (accessible without authentication)
  public: {
    home: '/',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
  },
  // Private routes (require authentication)
  private: {
    dashboard: '/dashboard',
    dashboardSemester: '/dashboard/semester',
    dashboardCalendar: '/dashboard/calendar',
    dashboardProfile: '/dashboard/profile',
    onboarding: {
      base: '/onboarding',
      step1: '/onboarding/step1',
      step2: '/onboarding/step2',
      step3: '/onboarding/step3',
    },
  },
} as const;

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return Object.values(ROUTES.public).some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
}

/**
 * Check if a path is a private route
 */
export function isPrivateRoute(pathname: string): boolean {
  return (
    pathname.startsWith(ROUTES.private.dashboard) ||
    pathname.startsWith(ROUTES.private.onboarding.base)
  );
}

/**
 * Check if a path is an auth page (login, register, forgot-password)
 */
export function isAuthPage(pathname: string): boolean {
  return (
    pathname.startsWith(ROUTES.public.login) ||
    pathname.startsWith(ROUTES.public.register) ||
    pathname.startsWith(ROUTES.public.forgotPassword)
  );
}

