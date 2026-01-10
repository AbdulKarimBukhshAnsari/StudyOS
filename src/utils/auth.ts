import { requireCachedUser, requireCachedUserWithOnboarding, getCachedUserData } from '@/context/userContext';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'next/navigation';

/**
 * Ensures user is authenticated, redirects to login if not
 * @returns The current user
 * Now just uses the context - no manual checks needed
 */
export async function requireAuth() {
  return await requireCachedUser();
}

/**
 * Ensures user is authenticated and onboarded
 * Redirects to login if not authenticated
 * Redirects to onboarding step1 if not onboarded
 * @returns The current user
 * Now just uses the context - no manual checks needed
 */
export async function requireAuthAndOnboarding() {
  return await requireCachedUserWithOnboarding();
}

/**
 * Checks if user is authenticated and onboarded
 * Used for conditional redirects (doesn't throw/redirect)
 * @returns Object with user and onboarding status
 */
export async function getAuthStatus() {
  const userData = await getCachedUserData();
  return {
    user: userData.user,
    isAuthenticated: userData.isAuthenticated,
    isOnboarded: userData.isOnboarded,
  };
}

/**
 * Redirects authenticated users based on onboarding status
 * If onboarded -> redirects to dashboard
 * If not onboarded -> redirects to onboarding step1
 */
export async function redirectBasedOnOnboardingStatus() {
  const userData = await getCachedUserData();
  
  if (!userData.isAuthenticated) {
    return; // Don't redirect if not authenticated
  }
  
  if (userData.isOnboarded) {
    redirect(ROUTES.private.dashboard);
  } else {
    redirect(ROUTES.private.onboarding.step1);
  }
}

