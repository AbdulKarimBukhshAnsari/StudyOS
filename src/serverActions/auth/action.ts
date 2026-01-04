'use server'
import {db} from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth-server";
import { eq } from "drizzle-orm";

export const checkOnBoardingStatus = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }
    const record = await db.select().from(users).where(eq(users.better_auth_user_id, user.id));
    // If no record exists or is_onboarded is null/undefined, return false
    return record?.[0]?.is_onboarded ?? false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export const markUserAsOnboarded = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  await db.update(users).set({ is_onboarded: true }).where(eq(users.better_auth_user_id, user.id));
  return true;
}