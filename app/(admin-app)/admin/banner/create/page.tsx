"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { BannerFormData } from "@/lib/schemas/banner.schema"

import { Button } from "@/components/atoms"
import { BannerForm } from "@/components/organisms/admin-banner/banner-form"
import { useCreateBanner } from "@/hooks/admin-app/src/hooks/admin/banner"


function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminCreateBannerPage() {
  const router = useRouter()
  const createMutation = useCreateBanner()

  const handleSubmit = async (payload: BannerFormData) => {
    try {
      const formData = new FormData()
      payload.files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await createMutation.mutateAsync(formData)
      toast.success(response.message)
      router.push("/admin/banner")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tạo banner</h1>
            <p className="mt-1 text-sm text-slate-500">Tạo banner mới theo đúng JSON contract.</p>
          </div>

          <Link href="/admin/banner">
            <Button variant="outline">Quay lại danh sách</Button>
          </Link>
        </div>

        <BannerForm
          isSubmitting={createMutation.isPending}
          submitLabel="Tạo banner"
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  )
}
