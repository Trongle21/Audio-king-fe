"use client"

import { useMemo } from "react"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

import type { Product } from "@/api/product"

import { Button } from "@/components/atoms"
import { AdminEntityTable } from "@/components/organisms"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"

interface ProductTrashTableProps {
  items: Product[]
  onRestore: (product: Product) => void
  onHardDelete: (product: Product) => void
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`
}

function formatDateTime(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("vi-VN")
}

export function ProductTrashTable({ items, onRestore, onHardDelete }: ProductTrashTableProps) {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "thumbnail",
        header: "Ảnh",
        cell: ({ row }) => {
          const raw = row.original.thumbnail || row.original.images?.[0]?.url
          const src = typeof raw === "string" ? raw : raw?.url
          if (!src) return <span className="text-xs text-slate-400">Không có ảnh</span>

          return (
            <Image
              src={src}
              alt={row.original.name}
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 rounded-md border object-cover"
            />
          )
        },
      },
      { accessorKey: "name", header: "Tên sản phẩm" },
      {
        id: "price",
        header: "Giá",
        cell: ({ row }) => formatPrice(row.original.price),
      },
      { accessorKey: "stock", header: "Tồn kho" },
      {
        id: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status
          if (status === 1) return "Hiển thị"
          if (status === 2) return "Ẩn"
          return "Không xác định"
        },
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
      renderActions={(product) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onRestore(product)}>
            Khôi phục
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onHardDelete(product)}>
            Xóa vĩnh viễn
          </Button>
        </div>
      )}
    />
  )
}
