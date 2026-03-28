"use client"

import Image from "next/image"
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

// removed unused formatDate

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
    const thumbnailUrl =
        typeof data.thumbnail === "string" ? data.thumbnail : data.thumbnail?.url || gallery[0]?.url

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
                    <p><strong>Name:</strong> {data.name || "-"}</p>
                    <p><strong>Price:</strong> {formatPrice(data.price)}đ</p>
                    <p><strong>Sale:</strong> {data.sale ?? 0}</p>
                    <p><strong>Stock:</strong> {data.stock}</p>
                    <p><strong>Description:</strong> {data.description || "Không có mô tả"}</p>
                    <p><strong>Rating:</strong> {data.rating ?? 0}</p>
                    <p><strong>Categories:</strong> {renderCategories(data.categories)}</p>
                    <p><strong>Images count:</strong> {gallery.length}</p>
                </div>
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold">Specifications</h2>
                {data.specifications && Object.keys(data.specifications).length > 0 ? (
                    <div className="grid gap-2 text-sm md:grid-cols-2">
                        {Object.entries(data.specifications).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key}:</strong> {value}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Không có specifications.</p>
                )}
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold">Highlights</h2>
                {data.highlights && data.highlights.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {data.highlights.map((item, index) => (
                            <li key={`${item}-${index}`}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Không có highlights.</p>
                )}
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                <h2 className="text-lg font-semibold">Thư viện ảnh</h2>

                {thumbnailUrl && (
                    <div>
                        <p className="mb-1 text-sm text-slate-500">Thumbnail</p>
                        <Image
                            src={thumbnailUrl}
                            alt={data.name}
                            width={192}
                            height={192}
                            unoptimized
                            className="h-48 w-48 rounded-lg border object-cover"
                        />
                    </div>
                )}

                {gallery.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        {gallery.map((img, idx) => (
                            <figure key={`${img.url}-${idx}`} className="rounded-md border p-2">
                                <Image
                                    src={img.url}
                                    alt={img.alt || `Ảnh ${idx + 1}`}
                                    width={160}
                                    height={120}
                                    unoptimized
                                    className="h-24 w-full object-cover rounded"
                                />
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
