'use server';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ROUTES } from '@/constants/routes';

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserContextData {
  user: UserData | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userId: string | null;
}

/**
 * Cached function to get user data - prevents multiple auth checks
 * This is the single source of truth for user data in a request
 * Cookies se data automatically check hota hai, no extra queries
 */
const getCachedUserDataInternal = cache(async (): Promise<UserContextData> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        user: null,
        isAuthenticated: false,
        isOnboarded: false,
        userId: null,
      };
    }

    // Get onboarding status in the same query
    const [userRecord] = await db
      .select({ is_onboarded: users.is_onboarded })
      .from(users)
      .where(eq(users.better_auth_user_id, user.id))
      .limit(1);

    const isOnboarded = userRecord?.is_onboarded ?? false;

    return {
      user: {
        id: user.id,
        name: user.name ?? null,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      isAuthenticated: true,
      isOnboarded,
      userId: user.id,
    };
  } catch (error) {
    console.error('Error getting cached user data:', error);
    return {
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      userId: null,
    };
  }
});

/**
 * Get user data - automatically redirects to login if user is null
 * Use this in protected routes - no need to check null manually
 */
export const requireCachedUser = cache(async (): Promise<UserData> => {
  const userData = await getCachedUserDataInternal();
  if (!userData.user) {
    redirect(ROUTES.public.login);
  }
  return userData.user;
});

/**
 * Get user ID - automatically redirects to login if user is null
 * Use this in server actions - no need to check null manually
 */
export const requireCachedUserId = cache(async (): Promise<string> => {
  const userData = await getCachedUserDataInternal();
  if (!userData.userId) {
    redirect(ROUTES.public.login);
  }
  return userData.userId;
});

/**
 * Get user with onboarding check - redirects if not onboarded
 * Use this in dashboard routes
 */
export const requireCachedUserWithOnboarding = cache(async (): Promise<UserData> => {
  const userData = await getCachedUserDataInternal();
  if (!userData.user) {
    redirect(ROUTES.public.login);
  }
  if (!userData.isOnboarded) {
    redirect(ROUTES.private.onboarding.step1);
  }
  return userData.user;
});

/**
 * Get onboarding status (cached)
 * Only use this when you need to check without redirecting
 */
export const getCachedOnboardingStatus = cache(async (): Promise<boolean> => {
  const userData = await getCachedUserDataInternal();
  return userData.isOnboarded;
});

/**
 * Get user data without redirect (for optional checks)
 * Only use when you need to handle null case yourself
 */
export const getCachedUserData = cache(async (): Promise<UserContextData> => {
  return await getCachedUserDataInternal();
});

/**
 * Get user object without redirect (for optional checks)
 * Only use when you need to handle null case yourself
 */
export const getCachedUser = cache(async (): Promise<UserData | null> => {
  const userData = await getCachedUserDataInternal();
  return userData.user;
});

