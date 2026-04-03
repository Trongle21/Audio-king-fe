"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { ProductFormSubmitPayload } from "@/components/organisms/admin-product/product-form"

import { uploadProductFile } from "@/api/product"
import { Button } from "@/components/atoms"
import { ProductForm } from "@/components/organisms"
import { useCreateProduct } from "@/hooks/admin-app/src/hooks/admin/product"


function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminCreateProductPage() {
    const router = useRouter()
    const createMutation = useCreateProduct()

    const handleSubmit = async (payload: ProductFormSubmitPayload) => {
        try {
            const uploaded = await Promise.all(payload.files.map((file) => uploadProductFile(file)))

            const uploadedImages = uploaded.map((item, index) => ({
                url: item.data.url,
                alt: `${payload.name} ${index + 1}`,
            }))

            const thumbnail = uploadedImages[0]

            if (!payload.name || payload.price === undefined || payload.stock === undefined || !payload.categories) {
                throw new Error("Dữ liệu sản phẩm không hợp lệ")
            }

            const response = await createMutation.mutateAsync({
                name: payload.name,
                price: payload.price,
                stock: payload.stock,
                categories: payload.categories,
                images: uploadedImages,
                thumbnail,
                files: [],
                ...(payload.sale !== undefined ? { sale: payload.sale } : {}),
                ...(payload.description !== undefined ? { description: payload.description } : {}),
                ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
                ...(payload.specifications !== undefined ? { specifications: payload.specifications } : {}),
                ...(payload.highlights !== undefined ? { highlights: payload.highlights } : {}),
            })

            toast.success(response.message)
            router.push("/admin/product")
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Thêm sản phẩm</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Tạo sản phẩm mới và upload ảnh theo chuẩn multipart/form-data.
                        </p>
                    </div>

                    <Link href="/admin/product">
                        <Button variant="outline">Quay lại danh sách</Button>
                    </Link>
                </div>

                <ProductForm
                    isSubmitting={createMutation.isPending}
                    submitLabel="Tạo sản phẩm"
                    onSubmit={handleSubmit}
                />
            </section>
        </main>
    )
}