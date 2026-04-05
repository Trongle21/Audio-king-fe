"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button, Input, Label } from "@/components/atoms"
import {
  aboutSchema,
  MAX_ABOUT_FILE_SIZE_MB,
  type AboutFormData,
} from "@/lib/schemas/about.schema"
import type { UploadProgressItem } from "@/services/about.service"

interface AboutFormProps {
  defaultValues?: AboutFormData
  isSubmitting?: boolean
  isUploading?: boolean
  submitLabel?: string
  existingImages?: Array<{ url: string; alt?: string }>
  uploadProgress?: UploadProgressItem[]
  onSubmit: (payload: AboutFormData) => Promise<void>
}

export function AboutForm({
  defaultValues,
  isSubmitting,
  isUploading,
  submitLabel = "Lưu about",
  existingImages,
  uploadProgress,
  onSubmit,
}: AboutFormProps) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof aboutSchema>, unknown, AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: defaultValues ?? { files: [] },
  })

  const watchedFiles = useWatch({ control, name: "files" })
  const files = useMemo<File[]>(() => {
    if (!watchedFiles) return []
    return Array.isArray(watchedFiles) ? watchedFiles : Array.from(watchedFiles)
  }, [watchedFiles])

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  const isBusy = Boolean(isSubmitting || isUploading)

  return (
    <form className="space-y-4" onSubmit={submitHandler}>
      <div className="space-y-2">
        <Label htmlFor="about-files">
          Ảnh about <span className="text-destructive">*</span>
        </Label>
        <Input
          id="about-files"
          type="file"
          accept="image/*"
          multiple
          disabled={isBusy}
          onChange={(event) => {
            const nextFiles = Array.from(event.target.files ?? [])
            setValue("files", nextFiles, { shouldValidate: true })
          }}
        />
        <p className="text-xs text-slate-500">Tối đa {MAX_ABOUT_FILE_SIZE_MB}MB mỗi ảnh.</p>
        {errors.files?.message && <p className="text-sm text-destructive">{errors.files.message}</p>}

        {existingImages && existingImages.length > 0 && files.length === 0 && (
          <div className="space-y-2">
            <Label>Ảnh hiện tại</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {existingImages.map((image, index) => (
                <Image
                  key={`${image.url}-${index}`}
                  src={image.url}
                  alt={image.alt || `about-current-${index + 1}`}
                  width={160}
                  height={96}
                  unoptimized
                  className="h-24 w-full rounded-md border object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="space-y-2">
          <Label>Preview ảnh upload mới</Label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {previews.map(({ file, url }, index) => (
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

      {uploadProgress && uploadProgress.length > 0 && (
        <div className="space-y-2">
          <Label>Tiến trình upload</Label>
          <div className="space-y-2 rounded-md border bg-slate-50 p-3">
            {uploadProgress.map((item) => (
              <div key={item.fileName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate text-slate-700">{item.fileName}</span>
                  <span className={item.status === "error" ? "text-destructive" : "text-slate-500"}>
                    {item.status === "error" ? "Lỗi" : `${item.progress}%`}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-200">
                  <div className="h-full bg-slate-900 transition-all" style={{ width: `${item.progress}%` }} />
                </div>
                {item.error && <p className="text-xs text-destructive">{item.error}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" disabled={isBusy}>
        {isUploading ? "Đang upload..." : isSubmitting ? "Đang lưu..." : submitLabel}
      </Button>
    </form>
  )
}
