"use client"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { AppModal, Button, Input, Label } from "@/components/atoms"
import {
  categoryNameSchema,
  type CategoryNameFormData,
} from "@/lib/schemas/category.schema"

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  defaultName?: string
  isSubmitting?: boolean
  onSubmit: (payload: CategoryNameFormData) => Promise<void>
}

export function CategoryFormModal({
  open,
  onOpenChange,
  mode,
  defaultName,
  isSubmitting,
  onSubmit,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryNameFormData>({
    resolver: zodResolver(categoryNameSchema),
    defaultValues: { name: defaultName ?? "" },
  })

  useEffect(() => {
    if (open) {
      reset({ name: defaultName ?? "" })
    }
  }, [defaultName, open, reset])

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Thêm danh mục" : "Chỉnh sửa danh mục"}
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
      <form className="space-y-2" onSubmit={submitHandler}>
        <Label htmlFor="category-name">
          Tên danh mục <span className="text-destructive">*</span>
        </Label>
        <Input id="category-name" {...register("name")} placeholder="Ví dụ: Loa kéo" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </form>
    </AppModal>
  )
}
