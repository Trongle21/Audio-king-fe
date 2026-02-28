import { QueryClient } from "@tanstack/react-query"

// Cấu hình QueryClient với các options mặc định
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian cache mặc định: 5 phút
      staleTime: 1000 * 60 * 5,
      // Thời gian cache trong bộ nhớ: 10 phút
      gcTime: 1000 * 60 * 10,
      // Retry khi lỗi: 3 lần
      retry: 3,
      // Refetch khi window focus
      refetchOnWindowFocus: false,
      // Refetch khi reconnect
      refetchOnReconnect: true,
    },
  },
})
