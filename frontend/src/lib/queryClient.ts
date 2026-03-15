import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Clone response to avoid "body stream already read" error
      const clonedRes = res.clone();
      const errorData = await clonedRes.json();
      // Extract clean error message from API response
      const message = errorData.error || errorData.message || errorData.details || res.statusText;
      console.error('API Error:', { status: res.status, errorData, message });
      throw new Error(message);
    } catch (parseError) {
      // Fallback to status text if JSON parsing fails
      console.error('Error parsing API response:', parseError);
      throw new Error(res.statusText || `HTTP ${res.status}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  // Add test tier header for development testing
  if (typeof window !== 'undefined') {
    const testTier = localStorage.getItem('holla_test_tier');
    if (testTier) {
      headers['x-test-tier'] = testTier;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
