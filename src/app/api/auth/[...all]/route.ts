import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const handler = toNextJsHandler(auth);

/**
 * Wrapper to automatically create user record after signup
 */
async function handleRequest(
  request: NextRequest,
  method: "GET" | "POST"
) {
  const response = await handler[method](request);
  
  // Only process POST requests to signup endpoint
  // Better Auth uses paths like /api/auth/sign-up/email
  const pathname = request.nextUrl.pathname;
  if (method === "POST" && pathname.includes("sign-up") && pathname.includes("email")) {
    try {
      // Clone the response to read it
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      
      // Check if signup was successful and user was created
      if (clonedResponse.ok && data?.data?.user?.id) {
        const userId = data.data.user.id;
        
        // Check if user record already exists
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.better_auth_user_id, userId))
          .limit(1);
        
        // Create user record if it doesn't exist
        if (existingUsers.length === 0) {
          await db.insert(users).values({
            better_auth_user_id: userId,
          });
        }
      }
    } catch (error) {
      // Log error but don't break the signup flow
      console.error("Failed to create user record after signup:", error);
    }
  }
  
  return response;
}

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}