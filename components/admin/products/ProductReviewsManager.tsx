"use client"

import * as React from "react"

import { ChevronDown, Loader2, Plus, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { ProductReview } from "@/api/product"

import { AppModal, Button } from "@/components/atoms"
import { Textarea } from "@/components/ui/textarea"
import {
  useAddProductReviews,
  useDeleteProductReview,
  useProductReviews,
  useReplaceProductReviews,
} from "@/hooks/admin-app/src/hooks/admin/product/product-review.hooks"

const REVIEW_TEMPLATES = [
  "Sản phẩm rất tốt, âm thanh sống động!",
  "Giao hàng nhanh, đóng gói cẩn thận",
  "Sản phẩm đúng như mô tả",
  "Chất lượng vượt xa kỳ vọng",
  "Giá cả hợp lý, đáng mua",
]

interface BulkReviewItem {
  id: string
  rating: number
  review: string
}

function StarRating({
  rating,
  onChange,
  readonly = false,
}: {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          className={`p-0.5 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          disabled={readonly}
        >
          <Star
            className={`h-4 w-4 ${star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-300"
              }`}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewItem({
  review,
  onDelete,
  isDeleting,
}: {
  review: ProductReview
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const [showConfirm, setShowConfirm] = React.useState(false)

  const handleDelete = async () => {
    try {
      await onDelete(review._id)
      setShowConfirm(false)
    } catch {
      // Error handled by hook
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <StarRating rating={review.rating} readonly />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700 break-words">
            {review.review || "(Không có nội dung)"}
          </p>
          {review.createdAt && (
            <p className="mt-1 text-xs text-slate-400">
              {formatDate(review.createdAt)}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-destructive shrink-0"
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AppModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Xóa đánh giá"
        description="Hành động này không thể hoàn tác."
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Bạn chắc chắn muốn xóa đánh giá này?
        </p>
      </AppModal>
    </>
  )
}

function BulkReviewRow({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: BulkReviewItem
  index: number
  onChange: (id: string, field: keyof BulkReviewItem, value: string | number) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border p-2">
      <span className="mt-2 w-6 shrink-0 text-xs text-slate-400">#{index + 1}</span>
      <StarRating
        rating={item.rating}
        onChange={(r) => onChange(item.id, "rating", r)}
      />
      <input
        type="text"
        value={item.review}
        onChange={(e) => onChange(item.id, "review", e.target.value)}
        placeholder="Nhập nội dung đánh giá..."
        className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        maxLength={500}
      />
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-destructive shrink-0 mt-1"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface ProductReviewsManagerProps {
  productId: string
  productName: string
}

export function ProductReviewsManager({
  productId,
  productName,
}: ProductReviewsManagerProps) {
  const [singleRating, setSingleRating] = React.useState(5)
  const [singleReview, setSingleReview] = React.useState("")
  const [bulkReviews, setBulkReviews] = React.useState<BulkReviewItem[]>([])
  const [showTemplateDropdown, setShowTemplateDropdown] = React.useState(false)
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null)

  const { data, isLoading, isError, error } = useProductReviews(productId)
  const addReviewsMutation = useAddProductReviews()
  const replaceReviewsMutation = useReplaceProductReviews()
  const deleteReviewMutation = useDeleteProductReview()

  const reviews = data?.reviews ?? []

  const handleAddSingleReview = async () => {
    if (!singleReview.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá")
      return
    }

    try {
      await addReviewsMutation.mutateAsync({
        productId,
        payload: { reviews: [{ rating: singleRating, review: singleReview.trim() }] },
      })
      setSingleReview("")
      setSingleRating(5)
      toast.success("Thêm đánh giá thành công")
    } catch {
      toast.error("Thêm đánh giá thất bại")
    }
  }

  const handleAddBulkReviews = async () => {
    const validReviews = bulkReviews.filter((r) => r.review.trim())
    if (validReviews.length === 0) {
      toast.error("Vui lòng nhập ít nhất một đánh giá")
      return
    }

    try {
      await addReviewsMutation.mutateAsync({
        productId,
        payload: {
          reviews: validReviews.map((r) => ({
            rating: r.rating,
            review: r.review.trim(),
          })),
        },
      })
      setBulkReviews([])
      toast.success(`Thêm ${validReviews.length} đánh giá thành công`)
    } catch {
      toast.error("Thêm đánh giá thất bại")
    }
  }

  const handleReplaceAllReviews = async () => {
    try {
      await replaceReviewsMutation.mutateAsync({
        productId,
        payload: {
          reviews: reviews.map((r: ProductReview) => ({ rating: r.rating, review: r.review })),
        },
      })
      toast.success("Cập nhật danh sách đánh giá thành công")
    } catch {
      toast.error("Cập nhật thất bại")
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    setIsDeletingId(reviewId)
    try {
      await deleteReviewMutation.mutateAsync({ productId, reviewId })
      toast.success("Xóa đánh giá thành công")
    } catch {
      toast.error("Xóa đánh giá thất bại")
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleTemplateSelect = (template: string) => {
    setBulkReviews((prev) => [
      ...prev,
      { id: crypto.randomUUID(), rating: 5, review: template },
    ])
    setShowTemplateDropdown(false)
  }

  const handleBulkReviewChange = (
    id: string,
    field: keyof BulkReviewItem,
    value: string | number
  ) => {
    setBulkReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const handleRemoveBulkReview = (id: string) => {
    setBulkReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const addEmptyBulkReview = () => {
    setBulkReviews((prev) => [
      ...prev,
      { id: crypto.randomUUID(), rating: 5, review: "" },
    ])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {error?.message || "Không thể tải danh sách đánh giá"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Quản lý Reviews - {productName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Tổng số: <strong>{reviews.length}</strong> reviews
          </span>
        </div>
      </div>

      {/* Existing Reviews */}
      {reviews.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-700">Danh sách đánh giá hiện tại</h4>
            {reviews.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplaceAllReviews}
                disabled={replaceReviewsMutation.isPending}
              >
                Cập nhật tất cả
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reviews.map((review: ProductReview) => (
              <ReviewItem
                key={review._id}
                review={review}
                onDelete={handleDeleteReview}
                isDeleting={isDeletingId === review._id}
              />
            ))}
          </div>
        </section>
      )}

      {/* Add Single Review */}
      <section className="space-y-3 rounded-lg border bg-slate-50 p-4">
        <h4 className="font-medium text-slate-700">Thêm đánh giá đơn</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Rating:</label>
            <StarRating rating={singleRating} onChange={setSingleRating} />
          </div>
          <Textarea
            value={singleReview}
            onChange={(e) => setSingleReview(e.target.value)}
            placeholder="Nhập nội dung đánh giá..."
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {singleReview.length}/500 ký tự
            </span>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              >
                Template nhanh
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              {showTemplateDropdown && (
                <div className="absolute right-0 top-full mt-1 z-10 w-64 rounded-lg border bg-white shadow-lg">
                  {REVIEW_TEMPLATES.map((template, idx) => (
                    <button
                      key={idx}
                      className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleAddSingleReview}
              disabled={addReviewsMutation.isPending || !singleReview.trim()}
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm Review
            </Button>
          </div>
        </div>
      </section>

      {/* Add Multiple Reviews */}
      <section className="space-y-3 rounded-lg border bg-slate-50 p-4">
        <h4 className="font-medium text-slate-700">Thêm nhiều đánh giá</h4>
        {bulkReviews.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bulkReviews.map((item, index) => (
              <BulkReviewRow
                key={item.id}
                item={item}
                index={index}
                onChange={handleBulkReviewChange}
                onRemove={handleRemoveBulkReview}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Chưa có đánh giá nào.</p>
        )}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={addEmptyBulkReview}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm dòng
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTemplateSelect(REVIEW_TEMPLATES[0])}
          >
            + Template
          </Button>
          {bulkReviews.length > 0 && (
            <Button
              onClick={handleAddBulkReviews}
              disabled={addReviewsMutation.isPending}
              className="ml-auto"
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm tất cả ({bulkReviews.filter((r) => r.review.trim()).length})
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
