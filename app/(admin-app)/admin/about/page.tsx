"use client"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/atoms"
import { DeleteAboutModal } from "@/components/organisms/admin-about"
import { useAboutImages, useDeleteAbout } from "@/hooks/admin-app/src/hooks/admin/about"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
        if (error.message.includes("401") || error.message.includes("403")) {
            return "Bạn không có quyền truy cập. Vui lòng đăng nhập tài khoản admin."
        }
        return error.message
    }

    return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminAboutPage() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(12)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const { data, isLoading, isError, error } = useAboutImages({ page, limit })
    const deleteMutation = useDeleteAbout()

    const items = data?.items ?? []
    const pagination = data?.pagination

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
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý About</h1>
                        <p className="mt-1 text-sm text-slate-500">Danh sách document about và số lượng ảnh bên trong.</p>
                    </div>

                    <Link href="/admin/about/create">
                        <Button>Tạo about</Button>
                    </Link>
                </header>

                <div className="flex items-center gap-2">
                    <label className="text-sm">Limit</label>
                    <select
                        className="rounded-md border px-3 py-2 text-sm"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value))
                            setPage(1)
                        }}
                    >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                    </select>
                </div>

                {isLoading && (
                    <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">Đang tải danh sách about...</div>
                )}

                {isError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                        {getErrorMessage(error)}
                    </div>
                )}

                {!isLoading && !isError && items.length === 0 && (
                    <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">Chưa có about nào.</div>
                )}

                {!isLoading && !isError && items.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item, index) => {
                            const previewImage = item.images?.[0]

                            return (
                                <figure
                                    key={item._id || `about-${index}`}
                                    className="flex h-full min-w-0 flex-col gap-2 rounded-lg border bg-white p-2"
                                >
                                    {previewImage ? (
                                        <Image
                                            src={previewImage.url}
                                            alt={previewImage.alt || `about-${index + 1}`}
                                            width={220}
                                            height={140}
                                            unoptimized
                                            className="h-36 w-full rounded object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-36 w-full items-center justify-center rounded bg-slate-100 text-xs text-slate-500">
                                            Không có ảnh preview
                                        </div>
                                    )}

                                    <figcaption className="truncate text-xs text-slate-500">
                                        {previewImage?.alt || `About ID: ${item._id}`}
                                    </figcaption>
                                    <p className="text-xs text-slate-500">Số ảnh: {item.images?.length ?? 0}</p>

                                    <div className="mt-auto grid grid-cols-2 gap-2">
                                        <Link href={`/admin/about/${item._id}/edit`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                Chi tiết / Sửa
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full"
                                            disabled={deleteMutation.isPending}
                                            onClick={() => openDeleteModal(item._id)}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </figure>
                            )
                        })}
                    </div>
                )}

                {pagination && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3 text-sm">
                        <p>
                            Tổng: <strong>{pagination.total}</strong> | Trang <strong>{pagination.page}</strong> / {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                Trang trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                )}
            </section>

            <DeleteAboutModal
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                isSubmitting={deleteMutation.isPending}
                onConfirm={handleDelete}
            />
        </main>
    )
}
