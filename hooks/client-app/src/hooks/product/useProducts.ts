"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getProducts,
  normalizeGetProductsParamsForRequest,
} from "@/api/product"
import type { GetProductsParams, ProductListData } from "@/api/product/product.types"

export const PRODUCT_QUERY_FALLBACK_MESSAGE =
  "Có lỗi xảy ra, vui lòng thử lại."

export function productListQueryKey(params: GetProductsParams) {
  return ["products", normalizeGetProductsParamsForRequest(params)] as const
}

export function useProducts(params: GetProductsParams) {
  const stable = normalizeGetProductsParamsForRequest(params)

  return useQuery({
    queryKey: productListQueryKey(params),
    queryFn: async (): Promise<ProductListData> => {
      const res = await getProducts(stable)
      return res.data
    },
  })
}
