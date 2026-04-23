"use client"


import { Loader2, MessageSquare, Star } from "lucide-react"

import type { ProductReview } from "@/api/product"

import { useProductReviews } from "@/hooks/client-app/src/hooks/product/useProductReview"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-300"
            }`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ProductReview }) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={review.rating} />
        <span className="text-sm text-slate-500">
          {formatDate(review.createdAt)}
        </span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        {review.review || "(Không có nội dung đánh giá)"}
      </p>
    </div>
  )
}

interface ProductReviewsDisplayProps {
  productId: string
}

export function ProductReviewsDisplay({ productId }: ProductReviewsDisplayProps) {
  const { data, isLoading, isError } = useProductReviews(productId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !data) {
    return null
  }

  const { reviews, totalReviews } = data

  if (totalReviews === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Đánh giá sản phẩm</h3>
        <span className="text-sm text-muted-foreground">
          ({totalReviews} {totalReviews === 1 ? "đánh giá" : "đánh giá"})
        </span>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{data.reviews.length > 0
            ? (data.reviews.reduce((sum: number, r: ProductReview) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
            : "0"
          }</span>
          <div className="flex flex-col">
            <StarRating
              rating={data.reviews.length > 0
                ? Math.round(data.reviews.reduce((sum: number, r: ProductReview) => sum + r.rating, 0) / data.reviews.length)
                : 0
              }
            />
            <span className="text-xs text-muted-foreground">{totalReviews} đánh giá</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review: ProductReview) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </section>
  )
}
