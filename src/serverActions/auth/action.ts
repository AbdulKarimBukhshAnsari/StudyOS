'use server'
import {db} from "@/db";
import { users } from "@/db/schema";
import { requireCachedUserId, getCachedOnboardingStatus } from "@/context/userContext";
import { eq } from "drizzle-orm";
import { cache } from 'react';

/**
 * Check onboarding status - uses cached user context
 * User check automatically handled - no null checks needed
 */
export const checkOnBoardingStatus = cache(async () => {
  return await getCachedOnboardingStatus();
});

export const markUserAsOnboarded = async () => {
  const userId = await requireCachedUserId();
  
  try {
    await db
      .update(users)
      .set({ is_onboarded: true })
      .where(eq(users.better_auth_user_id, userId));
    return true;
  } catch (error) {
    console.error('Error marking user as onboarded:', error);
    return false;
  }
}