import { cookies } from 'next/headers';

/**
 * Server-side fetch utility for calling API routes with authentication
 * Supports Next.js server caching + tags
 */
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit & { tag?: string | string[]; cache?: 'no-store' | 'force-cache' | 'default' | 'reload' } = {}
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

  // Build fetch options
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      ...options.headers,
    },
    // Server cache + tag support
    cache: options.cache || 'force-cache', // default now cached on server
    next: options.tag
      ? { tags: Array.isArray(options.tag) ? options.tag : [options.tag] }
      : undefined,
  };

  const response = await fetch(`${baseUrl}/${endpoint}`, fetchOptions);

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
 * Supports optional tags + caching
 */
export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit & { tag?: string | string[]; cache?: 'no-store' | 'force-cache' | 'default' | 'reload' } = {}
): Promise<T | null> {
  try {
    const response = await serverFetch<ApiResponse<T>>(endpoint, options);
    if (response.success && response.data) return response.data;
    console.error('API error:', response.error);
    return null;
  } catch (err) {
    console.error('Server fetch error:', err);
    return null;
  }
}
