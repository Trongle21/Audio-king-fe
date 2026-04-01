"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductById, type Product } from "@/api/product"

export const clientProductQueryKeys = {
  detail: (id: string) => ["client-product", id] as const,
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: clientProductQueryKeys.detail(id ?? ""),
    queryFn: async (): Promise<Product> => {
      const res = await getProductById(id ?? "")
      return res.data
    },
    enabled: Boolean(id),
  })
}
