"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getDeletedProducts,
  hardDeleteProduct,
  normalizeGetProductsParamsForRequest,
  restoreDeletedProduct,
  type GetProductsParams,
} from "@/api/product"

export const productTrashQueryKeys = {
  all: ["deleted-products"] as const,
  list: (params: GetProductsParams) =>
    ["deleted-products", normalizeGetProductsParamsForRequest(params)] as const,
}

export function useDeletedProducts(params: GetProductsParams) {
  const stable = normalizeGetProductsParamsForRequest(params)
  return useQuery({
    queryKey: productTrashQueryKeys.list(stable),
    queryFn: () => getDeletedProducts(stable),
    select: (response) => response.data,
  })
}

export function useRestoreDeletedProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restoreDeletedProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productTrashQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useHardDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => hardDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productTrashQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
