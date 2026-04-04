"use client"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/atoms"
import { DeleteAboutModal } from "@/components/organisms/admin-about"
import { useAboutImages, useDeleteAbout } from "@/hooks/admin-app/src/hooks/admin/about"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
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
            const res = await deleteMutation.mutateAsync(deletingId)
            toast.success(res.message)
            setIsDeleteOpen(false)
            setDeletingId(null)
        } catch (err) {
            toast.error(getErrorMessage(err))
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 space-y-4">
            <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý About</h1>
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

                {isLoading && <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">Đang tải ảnh about...</div>}

                {isError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                        {getErrorMessage(error)}
                    </div>
                )}

                {!isLoading && !isError && items.length === 0 && (
                    <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">Chưa có ảnh about nào.</div>
                )}

                {!isLoading && !isError && items.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                        {items.map((item, index) => (
                            <figure key={`${item.url}-${index}`} className="space-y-2 rounded-lg border bg-white p-2">
                                <Image
                                    src={item.url}
                                    alt={item.alt || `about-${index + 1}`}
                                    width={180}
                                    height={120}
                                    unoptimized
                                    className="h-28 w-full rounded object-cover"
                                />
                                <figcaption className="truncate text-xs text-slate-500">{item.alt || item.url}</figcaption>

                                {/* Nếu backend trả ra id doc riêng cho từng ảnh thì map id thật vào đây.
                    Hiện contract GET chỉ trả item {url,alt}, không có id doc.
                    Bạn có thể tạm ẩn delete tại list hoặc đổi qua flow delete ở trang edit theo id doc. */}
                                <div className="flex gap-2">
                                    <Link href="/admin/about/create" className="w-full">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Thêm
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => openDeleteModal(item.url)}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </figure>
                        ))}
                    </div>
                )}

                {pagination && (
                    <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-3 text-sm">
                        <p>
                            Tổng: <strong>{pagination.total}</strong> | Trang <strong>{pagination.page}</strong> /{" "}
                            {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                Trang trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
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