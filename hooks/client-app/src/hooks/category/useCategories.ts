"use client"

import { useQuery } from "@tanstack/react-query"

import { getCategories, type CategoriesQuery, type CategoryListData } from "@/api/category"

export const clientCategoryQueryKeys = {
  all: ["client-categories"] as const,
  list: (query: { q?: string; page?: number; limit?: number }) =>
    [
      "client-categories",
      {
        q: query.q?.trim() || "",
        page: query.page ?? 1,
        limit: query.limit ?? 200,
      },
    ] as const,
}

export function useCategories(query: CategoriesQuery) {
  const q = query.q?.trim() || ""
  const page = query.page ?? 1
  const limit = query.limit ?? 200

  return useQuery({
    queryKey: clientCategoryQueryKeys.list({ q, page, limit }),
    queryFn: async (): Promise<CategoryListData> => {
      const res = await getCategories({ q, page, limit })
      return res.data
    },
  })
}

