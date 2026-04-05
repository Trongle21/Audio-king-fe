"use client"

import { useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { AboutFormData } from "@/lib/schemas/about.schema"

import { Button } from "@/components/atoms"
import { AboutForm } from "@/components/organisms/admin-about"
import {
    useAboutCloudinaryUpload,
    useCreateAbout,
} from "@/hooks/admin-app/src/hooks/admin/about"
import {
    buildAboutPayload,
    type UploadProgressItem,
} from "@/services/about.service"

function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message
    return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminCreateAboutPage() {
    const router = useRouter()
    const createMutation = useCreateAbout()
    const uploadMutation = useAboutCloudinaryUpload()

    const [uploadProgress, setUploadProgress] = useState<UploadProgressItem[]>([])

    const handleSubmit = async (payload: AboutFormData) => {
        try {
            setUploadProgress(
                payload.files.map((file) => ({
                    fileName: file.name,
                    progress: 0,
                    status: "pending" as const,
                })),
            )

            const images = await uploadMutation.mutateAsync({
                files: payload.files,
                onFileProgress: (progressItem) => {
                    setUploadProgress((prev) => {
                        const existingIndex = prev.findIndex((item) => item.fileName === progressItem.fileName)

                        if (existingIndex >= 0) {
                            const next = [...prev]
                            next[existingIndex] = { ...next[existingIndex], ...progressItem }
                            return next
                        }

                        return [...prev, progressItem]
                    })
                },
            })

            const res = await createMutation.mutateAsync(buildAboutPayload(images))
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
                    </div>

                    <Link href="/admin/about">
                        <Button variant="outline">Quay lại danh sách</Button>
                    </Link>
                </div>

                <AboutForm
                    isSubmitting={createMutation.isPending}
                    isUploading={uploadMutation.isPending}
                    uploadProgress={uploadProgress}
                    submitLabel="Tạo about"
                    onSubmit={handleSubmit}
                />
            </section>
        </main>
    )
}
