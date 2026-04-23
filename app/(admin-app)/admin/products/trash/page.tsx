"use client"

import { useMemo, useState } from "react"

import Link from "next/link"
import { toast } from "sonner"

import type { Product } from "@/api/product"
import type { ProductTrashFilterFormValues } from "@/lib/validation/productTrashFilterSchema"

import { ProductTrashActions } from "@/components/admin/products/ProductTrashActions"
import { ProductTrashFilters } from "@/components/admin/products/ProductTrashFilters"
import { ProductTrashTable } from "@/components/admin/products/ProductTrashTable"
import { Button } from "@/components/atoms"
import { useCategories } from "@/hooks/admin-app/src/hooks/admin/category"
import {
  useDeletedProducts,
  useHardDeleteProduct,
  useRestoreDeletedProduct,
} from "@/hooks/admin-app/src/hooks/admin/product"


function getErrorMessage(error: unknown) {
  const maybeAxiosLike = error as { response?: { data?: { message?: string } } }
  if (maybeAxiosLike?.response?.data?.message) return maybeAxiosLike.response.data.message
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại"
}

export default function ProductTrashPage() {
  const [filters, setFilters] = useState<ProductTrashFilterFormValues>({
    q: "",
    status: "",
    categoryId: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 12,
  })

  const [restoreTarget, setRestoreTarget] = useState<Product | null>(null)
  const [hardDeleteTarget, setHardDeleteTarget] = useState<Product | null>(null)

  const params = useMemo(
    () => ({
      q: filters.q?.trim() || undefined,
      status: filters.status ? Number(filters.status) : undefined,
      categoryId: filters.categoryId?.trim() || undefined,
      sortBy: filters.sortBy,
      order: filters.order,
      page: filters.page,
      limit: filters.limit,
    }),
    [filters],
  )

  const { data, isLoading, isError, error } = useDeletedProducts(params)
  const { data: categoryData } = useCategories({ page: 1, limit: 100 })
  const restoreMutation = useRestoreDeletedProduct()
  const hardDeleteMutation = useHardDeleteProduct()

  const items = data?.items?.filter((item) => item.isDelete) ?? []
  const pagination = data?.pagination
  const categories = categoryData?.items ?? []

  const handleFilterSubmit = (values: ProductTrashFilterFormValues) => {
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      q: "",
      status: "",
      categoryId: "",
      sortBy: "createdAt",
      order: "desc",
      page: 1,
      limit: 12,
    })
  }

  const handleRestore = async () => {
    if (!restoreTarget?._id) return
    try {
      const res = await restoreMutation.mutateAsync(restoreTarget._id)
      toast.success(res.message)
      setRestoreTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleHardDelete = async () => {
    if (!hardDeleteTarget?._id) return
    try {
      const res = await hardDeleteMutation.mutateAsync(hardDeleteTarget._id)
      toast.success(res.message)
      setHardDeleteTarget(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <main className="min-h-screen space-y-4 bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Thùng rác sản phẩm</h1>
            <p className="mt-1 text-sm text-slate-500">Quản lý sản phẩm đã xóa mềm (restore hoặc xóa vĩnh viễn).</p>
          </div>
          <Link href="/admin/product">
            <Button variant="outline">Về danh sách sản phẩm</Button>
          </Link>
        </header>

        <ProductTrashFilters
          defaultValues={filters}
          categories={categories}
          onSubmit={handleFilterSubmit}
          onReset={handleResetFilters}
        />

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải danh sách sản phẩm đã xóa...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Không có sản phẩm nào trong thùng rác.
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <ProductTrashTable
            items={items}
            onRestore={(product) => setRestoreTarget(product)}
            onHardDelete={(product) => setHardDeleteTarget(product)}
          />
        )}

        {pagination && (
          <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-3 text-sm">
            <p>
              Tổng: <strong>{pagination.total}</strong> | Trang <strong>{pagination.page}</strong> /{" "}
              {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) }))}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) >= pagination.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </section>

      <ProductTrashActions
        mode="restore"
        productName={restoreTarget?.name}
        open={Boolean(restoreTarget)}
        isSubmitting={restoreMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null)
        }}
        onConfirm={handleRestore}
      />

      <ProductTrashActions
        mode="hardDelete"
        productName={hardDeleteTarget?.name}
        open={Boolean(hardDeleteTarget)}
        isSubmitting={hardDeleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setHardDeleteTarget(null)
        }}
        onConfirm={handleHardDelete}
      />
    </main>
  )
}
