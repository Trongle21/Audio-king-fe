"use client"

import { useMemo, useState } from "react"

import Link from "next/link"
import { toast } from "sonner"

import type { Category } from "@/api/category"
import type { CategoryTrashFilterFormValues } from "@/lib/validation/categoryTrashFilterSchema"

import { CategoryTrashActions } from "@/components/admin/categories/CategoryTrashActions"
import { CategoryTrashFilters } from "@/components/admin/categories/CategoryTrashFilters"
import { CategoryTrashTable } from "@/components/admin/categories/CategoryTrashTable"
import { Button } from "@/components/atoms"
import {
  useDeletedCategories,
  useHardDeleteCategory,
  useRestoreDeletedCategory,
} from "@/hooks/admin-app/src/hooks/admin/category"


function getErrorMessage(error: unknown) {
  const maybeAxiosLike = error as { response?: { data?: { message?: string } } }
  if (maybeAxiosLike?.response?.data?.message) return maybeAxiosLike.response.data.message
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại"
}

export default function CategoryTrashPage() {
  const [filters, setFilters] = useState<CategoryTrashFilterFormValues>({
    q: "",
    page: 1,
    limit: 12,
  })

  const [restoreTarget, setRestoreTarget] = useState<Category | null>(null)
  const [hardDeleteTarget, setHardDeleteTarget] = useState<Category | null>(null)

  const query = useMemo(
    () => ({
      q: filters.q?.trim() || undefined,
      page: filters.page,
      limit: filters.limit,
    }),
    [filters],
  )

  const { data, isLoading, isError, error } = useDeletedCategories(query)
  const restoreMutation = useRestoreDeletedCategory()
  const hardDeleteMutation = useHardDeleteCategory()

  const items = data?.items?.filter((item) => item.isDelete) ?? []
  const pagination = data?.pagination

  const handleFilterSubmit = (values: CategoryTrashFilterFormValues) => {
    setFilters((prev) => ({
      ...prev,
      ...values,
      page: 1,
    }))
  }

  const handleResetFilters = () => {
    setFilters({ q: "", page: 1, limit: 12 })
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
            <h1 className="text-2xl font-bold text-slate-900">Thùng rác danh mục</h1>
            <p className="mt-1 text-sm text-slate-500">Quản lý danh mục đã xóa mềm (khôi phục hoặc xóa vĩnh viễn).</p>
          </div>
          <Link href="/admin/category">
            <Button variant="outline">Về danh sách danh mục</Button>
          </Link>
        </header>

        <CategoryTrashFilters defaultValues={filters} onSubmit={handleFilterSubmit} onReset={handleResetFilters} />

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải danh sách danh mục đã xóa...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Không có danh mục nào trong thùng rác.
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <CategoryTrashTable
            items={items}
            onRestore={(category) => setRestoreTarget(category)}
            onHardDelete={(category) => setHardDeleteTarget(category)}
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

      <CategoryTrashActions
        mode="restore"
        categoryName={restoreTarget?.name}
        open={Boolean(restoreTarget)}
        isSubmitting={restoreMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null)
        }}
        onConfirm={handleRestore}
      />

      <CategoryTrashActions
        mode="hardDelete"
        categoryName={hardDeleteTarget?.name}
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
