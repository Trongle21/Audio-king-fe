"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import Image from "next/image"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button, Input, Label } from "@/components/atoms"
import { aboutSchema, type AboutFormData } from "@/lib/schemas/about.schema"

interface AboutFormProps {
  defaultValues?: AboutFormData
  isSubmitting?: boolean
  submitLabel?: string
  existingImages?: Array<{ url: string; alt?: string }>
  onSubmit: (payload: AboutFormData) => Promise<void>
}

export function AboutForm({
  defaultValues,
  isSubmitting,
  submitLabel = "Lưu about",
  existingImages,
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
    return Array.isArray(watchedFiles)
      ? watchedFiles
      : Array.from(watchedFiles)
  }, [watchedFiles])

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
  })

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
          onChange={(event) => {
            const nextFiles = Array.from(event.target.files ?? [])
            setValue("files", nextFiles, { shouldValidate: true })
          }}
        />
        {errors.files?.message && (
          <p className="text-sm text-destructive">{errors.files.message}</p>
        )}
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </Button>
    </form>
  )
}