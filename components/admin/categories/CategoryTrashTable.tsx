"use client"

import { useMemo } from "react"

import { type ColumnDef } from "@tanstack/react-table"

import type { Category } from "@/api/category"

import { Button } from "@/components/atoms"
import { AdminEntityTable } from "@/components/organisms"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"

interface CategoryTrashTableProps {
  items: Category[]
  onRestore: (category: Category) => void
  onHardDelete: (category: Category) => void
}

function formatDateTime(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("vi-VN")
}

export function CategoryTrashTable({ items, onRestore, onHardDelete }: CategoryTrashTableProps) {
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      { accessorKey: "name", header: "Tên danh mục" },
      { accessorKey: "slug", header: "Slug" },
      {
        id: "products",
        header: "Số sản phẩm",
        cell: ({ row }) => row.original.products?.length ?? 0,
      },
      {
        id: "deletedAt",
        header: "Thời gian xóa",
        cell: ({ row }) => formatDateTime(row.original.updatedAt),
      },
    ],
    [],
  )

  const table = useAdminTable(items, columns)

  return (
    <AdminEntityTable
      table={table}
      actionsHeader="Thao tác"
      renderActions={(category) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onRestore(category)}>
            Khôi phục
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onHardDelete(category)}>
            Xóa vĩnh viễn
          </Button>
        </div>
      )}
    />
  )
}
