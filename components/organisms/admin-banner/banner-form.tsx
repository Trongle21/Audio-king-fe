"use client"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button, Input, Label } from "@/components/atoms"
import { bannerEditSchema, type BannerEditFormData } from "@/lib/schemas/banner.schema"

interface BannerFormProps {
  isSubmitting?: boolean
  submitLabel?: string
  requireUpload?: boolean
  existingImages?: Array<{ url: string; alt?: string }>
  onSubmit: (
    payload: BannerEditFormData,
    context?: { keptExistingImageUrls: string[] },
  ) => Promise<void>
}

export function BannerForm({
  isSubmitting,
  submitLabel = "Lưu banner",
  requireUpload = true,
  existingImages,
  onSubmit,
}: BannerFormProps) {
  const {
    control,
    setError,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof bannerEditSchema>, unknown, BannerEditFormData>({
    resolver: zodResolver(bannerEditSchema),
    defaultValues: { files: [], keptExistingImageUrls: [] },
  })

  const [keptExistingImages, setKeptExistingImages] = useState<Array<{ url: string; alt?: string }>>(
    existingImages ?? [],
  )

  useEffect(() => {
    setKeptExistingImages(existingImages ?? [])
  }, [existingImages])

  const watchedFiles = useWatch({ control, name: "files" })
  const files = useMemo<File[]>(() => {
    if (!watchedFiles) return []
    return Array.isArray(watchedFiles) ? watchedFiles : Array.from(watchedFiles)
  }, [watchedFiles])

  const previews = useMemo(
    () => files.map((file: File) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )

  const removeExistingImage = (indexToRemove: number) => {
    setKeptExistingImages((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const submitHandler = handleSubmit(async (values) => {
    const keptExistingImageUrls = keptExistingImages.map((image) => image.url)

    if (requireUpload && values.files.length === 0 && keptExistingImageUrls.length === 0) {
      setError("files", { message: "Banner phải có ít nhất 1 ảnh" })
      return
    }

    clearErrors("files")

    await onSubmit(
      {
        ...values,
        keptExistingImageUrls,
      },
      { keptExistingImageUrls },
    )
  })

  return (
    <form className="space-y-4" onSubmit={submitHandler}>
      <div className="space-y-2">
        <Label htmlFor="banner-files">
          Ảnh banner {requireUpload && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="banner-files"
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

      {keptExistingImages.length > 0 && (
        <div className="space-y-2">
          <Label>Ảnh hiện tại</Label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {keptExistingImages.map((image, index) => (
              <div key={`${image.url}-${index}`} className="space-y-2">
                <Image
                  src={image.url}
                  alt={image.alt || `banner-current-${index + 1}`}
                  width={160}
                  height={96}
                  unoptimized
                  className="h-24 w-full rounded-md border object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => removeExistingImage(index)}
                >
                  Xóa ảnh
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </Button>
    </form>
  )
}
