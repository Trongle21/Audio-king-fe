"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  addProductReviews,
  deleteProductReview,
  getProductReviews,
  replaceProductReviews,
  type AddReviewsPayload,
  type ReplaceReviewsPayload
} from "@/api/product"

export const productReviewQueryKeys = {
  reviews: (productId: string) => ["product-reviews", productId] as const,
}

export function useProductReviews(productId?: string) {
  return useQuery({
    queryKey: productReviewQueryKeys.reviews(productId ?? ""),
    queryFn: () => getProductReviews(productId ?? ""),
    enabled: Boolean(productId),
    select: (response) => response.data,
  })
}

export function useAddProductReviews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string
      payload: AddReviewsPayload
    }) => addProductReviews(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productReviewQueryKeys.reviews(variables.productId),
      })
    },
  })
}

export function useReplaceProductReviews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string
      payload: ReplaceReviewsPayload
    }) => replaceProductReviews(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productReviewQueryKeys.reviews(variables.productId),
      })
    },
  })
}

export function useDeleteProductReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      reviewId,
    }: {
      productId: string
      reviewId: string
    }) => deleteProductReview(productId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productReviewQueryKeys.reviews(variables.productId),
      })
    },
  })
}
