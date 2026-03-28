"use client"

import { useMemo } from "react"

import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { ProductForm } from "@/components/organisms"
import {
    useProductDetail,
    useUpdateProduct,
} from "@/hooks/admin-app/src/hooks/admin/product"

import type { ProductCategoryRef } from "@/api/product"
import type { ProductUpdateFormData } from "@/lib/schemas/product.schema"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return "Có lỗi xảy ra, vui lòng thử lại."
}

function toCategoryIdArray(categories: string[] | ProductCategoryRef[]) {
    if (!categories || categories.length === 0) return []
    if (typeof categories[0] === "string") return categories as string[]
    return (categories as ProductCategoryRef[]).map((c) => c._id)
}

export default function AdminEditProductPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const id = params?.id

    const { data, isLoading, isError, error } = useProductDetail(id)
    const updateMutation = useUpdateProduct()

    const defaultValues = useMemo(() => {
        if (!data) return undefined
        const thumbnail =
            typeof data.thumbnail === "string"
                ? { url: data.thumbnail }
                : data.thumbnail
        return {
            name: data.name,
            sku: data.sku,
            price: data.price,
            sale: data.sale,
            stock: data.stock,
            status: data.status,
            description: data.description,
            rating: data.rating,
            thumbnail,
            categories: toCategoryIdArray(data.categories),
            images: data.images?.map((img) => ({ url: img.url, alt: img.alt || "" })) ?? [],
            specifications: data.specifications ?? {},
            highlights: data.highlights ?? [],
        }
    }, [data])

    const handleSubmit = async (payload: ProductUpdateFormData & { files: File[] }) => {
        if (!id || !data) return

        try {
            const mergedImages = [...(payload.images ?? [])]

            // lưu ý: PATCH backend nhận JSON, file mới muốn upload phải đi qua upload-audio trước
            // ở đây giữ đúng contract update JSON
            const res = await updateMutation.mutateAsync({
                id,
                payload: {
                    name: payload.name,
                    sku: payload.sku,
                    price: payload.price,
                    sale: payload.sale,
                    stock: payload.stock,
                    status: payload.status,
                    description: payload.description,
                    rating: payload.rating,
                    categories: payload.categories,
                    images: mergedImages,
                    thumbnail: payload.thumbnail || undefined,
                    specifications: payload.specifications,
                    highlights: payload.highlights,
                },
            })

            toast.success(res.message)
            router.push(`/admin/product/${id}`)
        } catch (err) {
            toast.error(getErrorMessage(err))
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-100 p-6">
                <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
                    Đang tải dữ liệu sản phẩm...
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
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
                <h1 className="text-2xl font-bold text-slate-900">Chỉnh sửa sản phẩm</h1>
                <ProductForm
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                    isSubmitting={updateMutation.isPending}
                    submitLabel="Cập nhật sản phẩm"
                />
            </section>
        </main>
    )
}