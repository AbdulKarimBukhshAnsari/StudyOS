

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient inside component to avoid sharing between requests
  // This is important for Next.js to prevent data leaking between users
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            
            // Keep unused data in cache for 30 minutes
            gcTime: 30 * 60 * 1000,
            
            // Refetch when window regains focus (if data is stale)
            refetchOnWindowFocus: true,
            
            // Don't refetch on mount if data is fresh
            refetchOnMount: true,
            
            // Retry failed requests 1 time
            retry: 1,
            
            // Don't retry on 4xx errors (client errors)
            retryOnMount: true,
          },
          mutations: {
            // Don't retry mutations by default
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
