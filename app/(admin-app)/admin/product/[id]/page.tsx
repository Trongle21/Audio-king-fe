"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { Button } from "@/components/atoms"
import { useProductDetail } from "@/hooks/admin-app/src/hooks/admin/product"

import type { ProductCategoryRef } from "@/api/product"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return "Có lỗi xảy ra, vui lòng thử lại."
}

function formatPrice(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value)
}

function renderCategories(categories: string[] | ProductCategoryRef[]) {
    if (!categories || categories.length === 0) return "Không có danh mục"
    if (typeof categories[0] === "string") return (categories as string[]).join(", ")
    return (categories as ProductCategoryRef[]).map((c) => c.name).join(", ")
}

export default function AdminProductDetailPage() {
    const params = useParams<{ id: string }>()
    const id = params?.id

    const { data, isLoading, isError, error } = useProductDetail(id)

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-100 p-6">
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                    Đang tải chi tiết sản phẩm...
                </div>
            </main>
        )
    }

    if (isError || !data) {
        return (
            <main className="min-h-screen bg-slate-100 p-6 space-y-4">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                    {getErrorMessage(error)}
                </div>
                <Link href="/admin/product">
                    <Button variant="outline">Quay lại danh sách</Button>
                </Link>
            </main>
        )
    }

    const gallery = data.images ?? []
    const thumb = data.thumbnail || gallery[0]?.url

    return (
        <main className="min-h-screen bg-slate-100 p-6 space-y-4">
            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
                    <div className="flex gap-2">
                        <Link href={`/admin/product/${data._id}/edit`}>
                            <Button>Sửa</Button>
                        </Link>
                        <Link href="/admin/product">
                            <Button variant="outline">Danh sách</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <p><strong>ID:</strong> {data._id}</p>
                    <p><strong>SKU:</strong> {data.sku}</p>
                    <p><strong>Slug:</strong> {data.slug}</p>
                    <p><strong>Giá:</strong> {formatPrice(data.price)}đ</p>
                    <p><strong>Sale:</strong> {data.sale ?? 0}</p>
                    <p><strong>Tồn kho:</strong> {data.stock}</p>
                    <p><strong>Status:</strong> {data.status ?? ""}</p>
                    <p><strong>Rating:</strong> {data.rating ?? 0}</p>
                    <p className="md:col-span-2"><strong>Danh mục:</strong> {renderCategories(data.categories)}</p>
                    <p className="md:col-span-2"><strong>Mô tả:</strong> {data.description || "Không có mô tả"}</p>
                </div>
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold">Thư viện ảnh</h2>

                {thumb && (
                    <div>
                        <p className="mb-1 text-sm text-slate-500">Thumbnail</p>
                        <img src={thumb} alt={data.name} className="h-48 w-48 rounded-lg border object-cover" />
                    </div>
                )}

                {gallery.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        {gallery.map((img, idx) => (
                            <figure key={`${img.url}-${idx}`} className="rounded-md border p-2">
                                <img src={img.url} alt={img.alt || `Ảnh ${idx + 1}`} className="h-24 w-full object-cover rounded" />
                                <figcaption className="mt-1 text-xs text-slate-500 truncate">
                                    {img.alt || img.url}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Không có ảnh sản phẩm.</p>
                )}
            </section>
        </main>
    )
}