"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { Button } from "@/components/atoms"
import { useCategoryDetail } from "@/hooks/admin-app/src/hooks/admin/category"

function formatPrice(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value)
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminCategoryDetailPage() {
    const params = useParams<{ id: string }>()
    const id = params?.id

    const { data, isLoading, isError, error } = useCategoryDetail(id)

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-100 p-6">
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                    Đang tải chi tiết category...
                </div>
            </main>
        )
    }

    if (isError || !data) {
        return (
            <main className="min-h-screen bg-slate-100 p-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                    {getErrorMessage(error)}
                </div>
                <div className="mt-4">
                    <Link href="/admin/category">
                        <Button variant="outline">Quay lại list</Button>
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 space-y-4">
            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Category Detail</h1>
                <p><strong>ID:</strong> {data._id}</p>
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Slug:</strong> {data.slug}</p>
                <p><strong>isDelete:</strong> {String(data.isDelete)}</p>

                <Link href="/admin/category">
                    <Button variant="outline" className="mt-2">Quay lại list</Button>
                </Link>
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Products thuộc category</h2>

                {data.products?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.products.map((product) => (
                            <article key={product._id} className="rounded-lg border p-3 bg-slate-50">
                                <p><strong>Name:</strong> {product.name}</p>
                                <p><strong>Slug:</strong> {product.slug}</p>
                                <p><strong>Price:</strong> {formatPrice(product.price)}đ</p>
                                {product.description && <p><strong>Description:</strong> {product.description}</p>}
                                {product.thumbnail && (
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className="mt-2 h-28 w-28 object-cover rounded-md border"
                                    />
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Category này chưa có sản phẩm.</p>
                )}
            </section>
        </main>
    )
}