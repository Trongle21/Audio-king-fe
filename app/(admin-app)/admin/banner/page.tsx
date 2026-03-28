"use client"

import { useMemo, useState } from "react"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/atoms"
import { AdminEntityTable, DeleteBannerModal } from "@/components/organisms"
import { useDeleteBanner, useBanners } from "@/hooks/admin-app/src/hooks/admin/banner"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"

import type { Banner } from "@/api/banner"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại."
}

function formatDate(date?: string) {
  if (!date) return "-"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return "-"
  return parsed.toLocaleString("vi-VN")
}

export default function AdminBannerPage() {
  const { data, isLoading, isError, error } = useBanners()
  const deleteMutation = useDeleteBanner()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const banners = data ?? []

  const columns = useMemo<ColumnDef<Banner>[]>(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
      },
      {
        id: "images",
        header: "Preview",
        cell: ({ row }) => {
          const images = row.original.images ?? []

          if (images.length === 0) {
            return <span className="text-xs text-slate-400">Không có ảnh</span>
          }

          return (
            <div className="flex gap-2">
              {images.slice(0, 3).map((image, index) => (
                <Image
                  key={`${image.url}-${index}`}
                  src={image.url}
                  alt={image.alt || `banner-${index + 1}`}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 rounded border object-cover"
                />
              ))}
              {images.length > 3 && (
                <span className="text-xs text-slate-500">+{images.length - 3}</span>
              )}
            </div>
          )
        },
      },
      {
        id: "updatedAt",
        header: "Cập nhật",
        cell: ({ row }) => formatDate(row.original.updatedAt),
      },
    ],
    [],
  )

  const table = useAdminTable(banners, columns)

  const openDeleteModal = (id: string) => {
    setDeletingId(id)
    setIsDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const response = await deleteMutation.mutateAsync(deletingId)
      toast.success(response.message)
      setIsDeleteOpen(false)
      setDeletingId(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Banner</h1>
            <p className="mt-1 text-sm text-slate-500">Danh sách banner theo đúng API backend.</p>
          </div>

          <Link href="/admin/banner/create">
            <Button>Tạo banner</Button>
          </Link>
        </header>

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải danh sách banner...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && banners.length === 0 && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Chưa có banner nào.
          </div>
        )}

        {!isLoading && !isError && banners.length > 0 && (
          <AdminEntityTable
            table={table}
            renderActions={(row) => (
              <div className="flex gap-2">
                <Link href={`/admin/banner/${row._id}/edit`}>
                  <Button variant="outline" size="sm">
                    Sửa
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => openDeleteModal(row._id)}>
                  Xóa
                </Button>
              </div>
            )}
          />
        )}
      </section>

      <DeleteBannerModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        isSubmitting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </main>
  )
}
