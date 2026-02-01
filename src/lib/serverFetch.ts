import { cookies } from 'next/headers';

/**
 * Server-side fetch utility for calling API routes with authentication
 * This is used by Server Components to call API routes
 */
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Get the base URL - in development, use localhost
  const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      ...options.headers,
    },
    // Ensure we don't cache authenticated requests inappropriately
    cache: options.cache || 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Type-safe API response wrapper
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server-side API fetch with error handling
 * Returns null on error instead of throwing
 */
export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const response = await serverFetch<ApiResponse<T>>(endpoint, options);
    if (response.success && response.data) {
      return response.data;
    }
    console.error('API error:', response.error);
    return null;
  } catch (error) {
    console.error('Server fetch error:', error);
    return null;
  }
}
