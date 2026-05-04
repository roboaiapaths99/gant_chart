'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "@/components/ui/toaster";

let queryClient: QueryClient;

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    });
  }
  return queryClient;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
