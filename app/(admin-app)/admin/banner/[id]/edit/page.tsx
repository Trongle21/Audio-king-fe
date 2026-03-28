"use client"

import { useMemo } from "react"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/atoms"
import { BannerForm } from "@/components/organisms/admin-banner/banner-form"
import {
  useBannerDetail,
  useUpdateBanner,
} from "@/hooks/admin-app/src/hooks/admin/banner"

import type { BannerFormData } from "@/lib/schemas/banner.schema"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminEditBannerPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const bannerId = params?.id ?? ""

  const { data: currentBanner, isLoading, isError, error } = useBannerDetail(bannerId)
  const updateMutation = useUpdateBanner()

  const defaultValues = useMemo<BannerFormData | undefined>(() => {
    if (!currentBanner) return undefined

    return {
      images: currentBanner.images.map((image) => ({
        url: image.url,
        alt: image.alt ?? "",
      })),
    }
  }, [currentBanner])

  const handleSubmit = async (payload: BannerFormData) => {
    try {
      const response = await updateMutation.mutateAsync({
        id: bannerId,
        payload,
      })
      toast.success(response.message)
      router.push("/admin/banner")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cập nhật banner</h1>
            <p className="mt-1 text-sm text-slate-500">Chỉnh sửa mảng images theo backend contract.</p>
          </div>

          <Link href="/admin/banner">
            <Button variant="outline">Quay lại danh sách</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải dữ liệu banner...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && !currentBanner && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Không tìm thấy banner.
          </div>
        )}

        {!isLoading && !isError && currentBanner && defaultValues && (
          <BannerForm
            defaultValues={defaultValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Cập nhật banner"
            onSubmit={handleSubmit}
          />
        )}
      </section>
    </main>
  )
}
