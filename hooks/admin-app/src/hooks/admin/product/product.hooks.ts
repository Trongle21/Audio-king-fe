"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createProduct,
  getProductById,
  getProducts,
  normalizeGetProductsParamsForRequest,
  restoreProduct,
  softDeleteProduct,
  updateProduct,
  uploadProductFile,
  type CreateProductPayload,
  type GetProductsParams,
  type UpdateProductPayload,
} from "@/api/product"

export const productQueryKeys = {
  all: ["products"] as const,
  list: (params: GetProductsParams) =>
    ["products", normalizeGetProductsParamsForRequest(params)] as const,
  detail: (id: string) => ["product", id] as const,
}

export function useProducts(params: GetProductsParams) {
  const stable = normalizeGetProductsParamsForRequest(params)
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => getProducts(stable),
    select: (response) => response.data,
  })
}

export function useProductDetail(id?: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(id ?? ""),
    queryFn: () => getProductById(id ?? ""),
    enabled: Boolean(id),
    select: (response) => response.data,
  })
}

export function useUploadProductFile() {
  return useMutation({
    mutationFn: (file: File) => uploadProductFile(file),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(variables.id) })
    },
  })
}

export function useSoftDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) })
    },
  })
}

export function useRestoreProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restoreProduct(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(id) })
    },
  })
}
