"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getProductReviews,
  type ProductReviewsResponse,
} from "@/api/product"

export const clientProductReviewQueryKeys = {
  reviews: (productId: string) => ["client-product-reviews", productId] as const,
}

export function useProductReviews(productId?: string) {
  return useQuery({
    queryKey: clientProductReviewQueryKeys.reviews(productId ?? ""),
    queryFn: () => getProductReviews(productId ?? ""),
    enabled: Boolean(productId),
    select: (response) => response.data,
  })
}
