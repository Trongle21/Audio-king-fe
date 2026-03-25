"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createCategory,
  getCategories,
  getCategoryById,
  restoreCategory,
  softDeleteCategory,
  updateCategory,
  type CategoriesQuery,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from "@/api/category"

export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: (q?: string) => ["categories", { q: q?.trim() || "" }] as const,
  detail: (id: string) => ["category", id] as const,
}

export function useCategories(query: CategoriesQuery) {
  const q = query.q?.trim() || ""

  return useQuery({
    queryKey: categoryQueryKeys.list(q),
    queryFn: () => getCategories({ q }),
    select: (response) => response.data,
  })
}

export function useCategoryDetail(id?: string) {
  return useQuery({
    queryKey: categoryQueryKeys.detail(id ?? ""),
    queryFn: () => getCategoryById(id ?? ""),
    enabled: Boolean(id),
    select: (response) => response.data,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      updateCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(variables.id) })
    },
  })
}

export function useSoftDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) })
    },
  })
}

export function useRestoreCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restoreCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(id) })
    },
  })
}
