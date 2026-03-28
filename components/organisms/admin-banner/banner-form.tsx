"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import { bannerSchema, type BannerFormData } from "@/lib/schemas/banner.schema"

interface BannerFormProps {
  defaultValues?: BannerFormData
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (payload: BannerFormData) => Promise<void>
}

export function BannerForm({
  defaultValues,
  isSubmitting,
  submitLabel = "Lưu banner",
  onSubmit,
}: BannerFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: defaultValues ?? { images: [{ url: "", alt: "" }] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      images: values.images.map((image) => ({
        url: image.url.trim(),
        alt: image.alt?.trim() || undefined,
      })),
    })
  })

  return (
    <form className="space-y-4" onSubmit={submitHandler}>
      <div className="flex items-center justify-between">
        <Label>Danh sách ảnh banner</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ url: "", alt: "" })}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm dòng ảnh
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="rounded-md border p-3 space-y-2">
          <div className="space-y-1">
            <Label htmlFor={`images.${index}.url`}>
              URL ảnh <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`images.${index}.url`}
              placeholder="https://example.com/banner.jpg"
              {...register(`images.${index}.url`)}
            />
            {errors.images?.[index]?.url && (
              <p className="text-sm text-destructive">{errors.images[index]?.url?.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor={`images.${index}.alt`}>Alt text</Label>
            <Input
              id={`images.${index}.alt`}
              placeholder="Banner 1"
              {...register(`images.${index}.alt`)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Xóa dòng
            </Button>
          </div>
        </div>
      ))}

      {errors.images?.message && (
        <p className="text-sm text-destructive">{errors.images.message}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : submitLabel}
      </Button>
    </form>
  )
}
