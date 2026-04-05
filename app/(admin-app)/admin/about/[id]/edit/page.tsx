"use client"

import { useMemo, useState } from "react"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import type { AboutFormData } from "@/lib/schemas/about.schema"

import { Button } from "@/components/atoms"
import { AboutForm } from "@/components/organisms/admin-about"
import {
  useAboutCloudinaryUpload,
  useAboutImages,
  useUpdateAbout,
} from "@/hooks/admin-app/src/hooks/admin/about"
import {
  buildAboutPayload,
  type UploadProgressItem,
} from "@/services/about.service"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminEditAboutPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const id = params?.id ?? ""

  const { data, isLoading, isError, error } = useAboutImages({ page: 1, limit: 100 })
  const updateMutation = useUpdateAbout()
  const uploadMutation = useAboutCloudinaryUpload()

  const [uploadProgress, setUploadProgress] = useState<UploadProgressItem[]>([])

  const currentAbout = useMemo(
    () => (data?.items ?? []).find((item) => item._id === id),
    [data?.items, id],
  )

  const handleSubmit = async (payload: AboutFormData) => {
    if (!id) return

    try {
      setUploadProgress(
        payload.files.map((file) => ({
          fileName: file.name,
          progress: 0,
          status: "pending" as const,
        })),
      )

      const uploadedImages = await uploadMutation.mutateAsync({
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

      const res = await updateMutation.mutateAsync({
        id,
        payload: buildAboutPayload(uploadedImages),
      })
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
            <h1 className="text-2xl font-bold text-slate-900">Cập nhật about</h1>
            <p className="mt-1 text-sm text-slate-500">Upload ảnh mới trực tiếp lên Cloudinary trước khi lưu.</p>
          </div>

          <Link href="/admin/about">
            <Button variant="outline">Quay lại danh sách</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">Đang tải dữ liệu about...</div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && !currentAbout && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">Không tìm thấy about theo id.</div>
        )}

        {!isLoading && !isError && currentAbout && (
          <AboutForm
            existingImages={currentAbout.images}
            isSubmitting={updateMutation.isPending}
            isUploading={uploadMutation.isPending}
            uploadProgress={uploadProgress}
            submitLabel="Cập nhật about"
            onSubmit={handleSubmit}
          />
        )}
      </section>
    </main>
  )
}
