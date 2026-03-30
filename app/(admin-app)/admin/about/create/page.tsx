"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/atoms"
import { AboutForm } from "@/components/organisms/admin-about"
import { useCreateAbout } from "@/hooks/admin-app/src/hooks/admin/about"

import type { AboutFormData } from "@/lib/schemas/about.schema"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminCreateAboutPage() {
    const router = useRouter()
    const createMutation = useCreateAbout()

    const handleSubmit = async (payload: AboutFormData) => {
        try {
            const formData = new FormData()
            payload.files.forEach((file) => {
                formData.append("files", file)
            })

            const res = await createMutation.mutateAsync(formData)
            toast.success(res.message)
            router.push("/admin/about")
        } catch (err) {
            toast.error(getErrorMessage(err))
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Tạo about</h1>
                        <p className="mt-1 text-sm text-slate-500">Tạo document about mới với mảng images.</p>
                    </div>

                    <Link href="/admin/about">
                        <Button variant="outline">Quay lại danh sách</Button>
                    </Link>
                </div>

                <AboutForm isSubmitting={createMutation.isPending} submitLabel="Tạo about" onSubmit={handleSubmit} />
            </section>
        </main>
    )
}