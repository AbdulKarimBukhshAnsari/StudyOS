import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { requireCachedUserId } from '@/context/userContext';
import { eq } from 'drizzle-orm';

/**
 * API route to create a user record in the users table
 * This is called after Better Auth user signup
 */
export async function POST() {
  try {
    const userId = await requireCachedUserId();

    // Check if user record already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.better_auth_user_id, userId))
      .limit(1);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'User record already exists' },
        { status: 200 }
      );
    }

    // Create the user record
    await db.insert(users).values({
      better_auth_user_id: userId,
    });

    return NextResponse.json(
      { message: 'User record created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create user record:', error);
    return NextResponse.json(
      { error: 'Failed to create user record' },
      { status: 500 }
    );
  }
}

