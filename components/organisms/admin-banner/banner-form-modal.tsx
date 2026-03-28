"use client"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"

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
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: defaultValues ?? {
      images: [{ url: "", alt: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          images: [{ url: "", alt: "" }],
        },
      )
    }
  }, [defaultValues, open, reset])

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      images: values.images.map((image) => ({
        url: image.url.trim(),
        alt: image.alt?.trim() || undefined,
      })),
    })
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
        <div className="flex items-center justify-between">
          <Label>Danh sách ảnh banner</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ url: "", alt: "" })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm ảnh
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
                placeholder="Banner khuyến mãi"
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
      </form>
    </AppModal>
  )
}
