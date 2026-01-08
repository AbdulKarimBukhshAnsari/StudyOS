import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { checkOnBoardingStatus } from '@/serverActions/auth/action';
import { ROUTES } from '@/constants/routes';

/**
 * Ensures user is authenticated, redirects to login if not
 * @returns The current user
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.public.login);
  }
  return user;
}

/**
 * Ensures user is authenticated and onboarded
 * Redirects to login if not authenticated
 * Redirects to onboarding step1 if not onboarded
 * @returns The current user
 */
export async function requireAuthAndOnboarding() {
  const user = await requireAuth();
  
  const isOnboarded = await checkOnBoardingStatus();
  if (!isOnboarded) {
    redirect(ROUTES.private.onboarding.step1);
  }
  
  return user;
}

/**
 * Checks if user is authenticated and onboarded
 * Used for conditional redirects (doesn't throw/redirect)
 * @returns Object with user and onboarding status
 */
export async function getAuthStatus() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, isAuthenticated: false, isOnboarded: false };
  }
  
  const isOnboarded = await checkOnBoardingStatus();
  return { user, isAuthenticated: true, isOnboarded };
}

/**
 * Redirects authenticated users based on onboarding status
 * If onboarded -> redirects to dashboard
 * If not onboarded -> redirects to onboarding step1
 */
export async function redirectBasedOnOnboardingStatus() {
  const { isAuthenticated, isOnboarded } = await getAuthStatus();
  
  if (!isAuthenticated) {
    return; // Don't redirect if not authenticated
  }
  
  if (isOnboarded) {
    redirect(ROUTES.private.dashboard);
  } else {
    redirect(ROUTES.private.onboarding.step1);
  }
}

