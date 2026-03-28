"use client"

import { useEffect, useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { AppModal, Button, Input, Label } from "@/components/atoms"
import { bannerSchema, type BannerFormData } from "@/lib/schemas/banner.schema"

interface BannerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  defaultValues?: BannerFormData
  isSubmitting?: boolean
  onSubmit: (payload: BannerFormData) => Promise<void>
}

export function BannerFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  isSubmitting,
  onSubmit,
}: BannerFormModalProps) {
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof bannerSchema>, unknown, BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: defaultValues ?? { files: [] },
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? { files: [] })
    }
  }, [defaultValues, open, reset])

  const watchedFiles = useWatch({ control, name: "files" })
  const files = useMemo<File[]>(() => {
    if (!watchedFiles) return []
    return Array.isArray(watchedFiles) ? watchedFiles : Array.from(watchedFiles)
  }, [watchedFiles])

  const previews = useMemo(
    () => files.map((file: File) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Tạo banner" : "Cập nhật banner"}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={submitHandler} disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Lưu"}
          </Button>
        </>
      }
    >
      <form className="space-y-3" onSubmit={submitHandler}>
        <div className="space-y-2">
          <Label htmlFor="banner-files-modal">
            Ảnh banner <span className="text-destructive">*</span>
          </Label>
          <Input
            id="banner-files-modal"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? [])
              setValue("files", nextFiles, { shouldValidate: true })
            }}
          />
          {errors.files?.message && <p className="text-sm text-destructive">{errors.files.message}</p>}
        </div>

        {previews.length > 0 && (
          <div className="space-y-2">
            <Label>Preview ảnh upload mới</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {previews.map(({ file, url }: { file: File; url: string }, index: number) => (
                <Image
                  key={`${file.name}-${index}`}
                  src={url}
                  alt={file.name}
                  width={160}
                  height={96}
                  unoptimized
                  className="h-24 w-full rounded-md border object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </form>
    </AppModal>
  )
}
