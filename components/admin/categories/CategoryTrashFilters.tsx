"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Resolver } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import {
  categoryTrashFilterSchema,
  type CategoryTrashFilterFormValues,
} from "@/lib/validation/categoryTrashFilterSchema"

interface CategoryTrashFiltersProps {
  defaultValues: CategoryTrashFilterFormValues
  onSubmit: (values: CategoryTrashFilterFormValues) => void
  onReset: () => void
}

export function CategoryTrashFilters({ defaultValues, onSubmit, onReset }: CategoryTrashFiltersProps) {
  const form = useForm<CategoryTrashFilterFormValues>({
    resolver: zodResolver(categoryTrashFilterSchema) as Resolver<CategoryTrashFilterFormValues>,
    defaultValues,
  })

  return (
    <form className="flex flex-wrap items-end gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="min-w-[260px] space-y-1">
        <Label htmlFor="cat-trash-q">Tìm kiếm</Label>
        <Input id="cat-trash-q" placeholder="Nhập tên danh mục..." {...form.register("q")} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="cat-trash-limit">Số lượng/trang</Label>
        <select
          id="cat-trash-limit"
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          {...form.register("limit")}
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={36}>36</option>
        </select>
      </div>

      <Button type="submit">Áp dụng</Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          form.reset({ q: "", page: 1, limit: 12 })
          onReset()
        }}
      >
        Đặt lại
      </Button>
    </form>
  )
}
