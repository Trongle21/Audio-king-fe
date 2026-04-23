"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getDeletedCategories,
  hardDeleteCategory,
  restoreDeletedCategory,
  type CategoriesQuery,
} from "@/api/category"

export const categoryTrashQueryKeys = {
  all: ["deleted-categories"] as const,
  list: (query: { q?: string; page?: number; limit?: number }) =>
    [
      "deleted-categories",
      {
        q: query.q?.trim() || "",
        page: query.page ?? 1,
        limit: query.limit ?? 12,
      },
    ] as const,
}

export function useDeletedCategories(query: CategoriesQuery) {
  const q = query.q?.trim() || ""
  const page = query.page ?? 1
  const limit = query.limit ?? 12

  return useQuery({
    queryKey: categoryTrashQueryKeys.list({ q, page, limit }),
    queryFn: () => getDeletedCategories({ q, page, limit }),
    select: (response) => response.data,
  })
}

export function useRestoreDeletedCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restoreDeletedCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryTrashQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useHardDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => hardDeleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryTrashQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
