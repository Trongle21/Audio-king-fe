"use client"

import type { Category } from "@/api/category"
import type { ProductFilterFormData } from "@/lib/schemas/product-filter.schema"
import type { ProductOrder, ProductSortBy } from "@/api/product"

import { Button, Input, Label } from "@/components/atoms"
import { useCategories } from "@/hooks/admin-app/src/hooks/admin/category"

interface ProductFiltersProps {
  q: string
  categoryId: string
  sortBy: ProductSortBy
  order: ProductOrder
  onChangeQ: (value: string) => void
  onChangeCategoryId: (value: string) => void
  onChangeSortBy: (value: ProductSortBy) => void
  onChangeOrder: (value: ProductOrder) => void
  onReset: () => void
}

export function ProductFilters({
  q,
  categoryId,
  sortBy,
  order,
  onChangeQ,
  onChangeCategoryId,
  onChangeSortBy,
  onChangeOrder,
  onReset,
}: ProductFiltersProps) {
  const { data: categoryData } = useCategories({ page: 1, limit: 100 })
  const categories = categoryData?.items ?? []

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[280px] space-y-1">
        <Label>Tìm kiếm</Label>
        <Input
          placeholder="Nhập tên sản phẩm..."
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>Danh mục</Label>
        <select
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          value={categoryId}
          onChange={(e) => onChangeCategoryId(e.target.value)}
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
        <Label>Sắp xếp theo</Label>
        <select
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value as ProductSortBy)}
        >
          <option value="createdAt">Ngày tạo</option>
          <option value="name">Tên</option>
          <option value="price">Giá</option>
        </select>
      </div>

      <div className="space-y-1">
        <Label>Thứ tự</Label>
        <select
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
          value={order}
          onChange={(e) => onChangeOrder(e.target.value as ProductOrder)}
        >
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
      </div>

      <Button variant="outline" onClick={onReset}>
        Đặt lại
      </Button>
    </div>
  )
}
