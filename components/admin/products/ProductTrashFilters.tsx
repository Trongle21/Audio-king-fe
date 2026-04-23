"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Category } from "@/api/category"
import type { Resolver } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import {
  productTrashFilterSchema,
  type ProductTrashFilterFormValues,
} from "@/lib/validation/productTrashFilterSchema"

interface ProductTrashFiltersProps {
  defaultValues: ProductTrashFilterFormValues
  categories: Category[]
  onSubmit: (values: ProductTrashFilterFormValues) => void
  onReset: () => void
}

export function ProductTrashFilters({
  defaultValues,
  categories,
  onSubmit,
  onReset,
}: ProductTrashFiltersProps) {
  const form = useForm<ProductTrashFilterFormValues>({
    resolver: zodResolver(productTrashFilterSchema) as Resolver<ProductTrashFilterFormValues>,
    defaultValues,
  })

  const { reset, getValues } = form

  const handleFieldChange = (field: keyof ProductTrashFilterFormValues, value: unknown) => {
    const currentValues = getValues()
    onSubmit({ ...currentValues, [field]: value })
  }

  return (
    <form className="flex flex-wrap items-end gap-3">
      <div className="min-w-[260px] space-y-1">
        <Label htmlFor="trash-q">Tìm kiếm</Label>
        <Input
          id="trash-q"
          placeholder="Nhập tên sản phẩm..."
          {...form.register("q", {
            onChange: (e) => handleFieldChange("q", e.target.value),
          })}
        />
      </div>

      {/* <div className="space-y-1">
        <Label htmlFor="trash-status">Trạng thái</Label>
        <select
          id="trash-status"
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          {...form.register("status", {
            onChange: (e) => handleFieldChange("status", e.target.value),
          })}
        >
          <option value="">Tất cả</option>
          <option value="1">Hiển thị</option>
          <option value="2">Ẩn</option>
          <option value="0">Khác</option>
        </select>
      </div> */}

      <div className="space-y-1">
        <Label htmlFor="trash-category">Danh mục</Label>
        <select
          id="trash-category"
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          {...form.register("categoryId", {
            onChange: (e) => handleFieldChange("categoryId", e.target.value),
          })}
        >
          <option value="">Tất cả</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="trash-sortBy">Sắp xếp theo</Label>
        <select
          id="trash-sortBy"
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          {...form.register("sortBy", {
            onChange: (e) => handleFieldChange("sortBy", e.target.value),
          })}
        >
          <option value="createdAt">Ngày tạo</option>
          <option value="name">Tên</option>
          <option value="price">Giá</option>
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="trash-order">Thứ tự</Label>
        <select
          id="trash-order"
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          {...form.register("order", {
            onChange: (e) => handleFieldChange("order", e.target.value),
          })}
        >
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
      </div>

      {/* <Button type="submit">Áp dụng</Button> */}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          reset({
            q: "",
            status: "",
            categoryId: "",
            sortBy: "createdAt",
            order: "desc",
            page: 1,
            limit: 12,
          })
          onReset()
        }}
      >
        Đặt lại
      </Button>
    </form>
  )
}
