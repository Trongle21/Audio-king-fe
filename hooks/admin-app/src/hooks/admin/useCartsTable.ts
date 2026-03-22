"use client"

import * as React from "react"

import { type ColumnDef } from "@tanstack/react-table"

export type CartRow = {
  id: string
  customer: string
  items: number
  total: string
  updatedAt: string
}

const initialCartsData: CartRow[] = [
  {
    id: "CRT001",
    customer: "Nguyễn Văn A",
    items: 3,
    total: "41.290.000đ",
    updatedAt: "2026-01-08 09:35",
  },
  {
    id: "CRT002",
    customer: "Trần Thị B",
    items: 1,
    total: "8.290.000đ",
    updatedAt: "2026-01-08 10:12",
  },
  {
    id: "CRT003",
    customer: "Lê Quốc C",
    items: 2,
    total: "19.900.000đ",
    updatedAt: "2026-01-08 10:45",
  },
  {
    id: "CRT004",
    customer: "Phạm Ngọc D",
    items: 5,
    total: "72.990.000đ",
    updatedAt: "2026-01-08 11:03",
  },
]

export function useCartsTable() {
  const [data, setData] = React.useState<CartRow[]>(initialCartsData)
  const [search, setSearch] = React.useState("")

  const columns = React.useMemo<ColumnDef<CartRow>[]>(
    () => [
      { accessorKey: "id", header: "Mã giỏ" },
      { accessorKey: "customer", header: "Khách hàng" },
      { accessorKey: "items", header: "Số món" },
      { accessorKey: "total", header: "Tổng tiền" },
      { accessorKey: "updatedAt", header: "Cập nhật" },
    ],
    [],
  )

  const filteredData = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data

    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.total.toLowerCase().includes(q),
    )
  }, [data, search])

  const onDelete = React.useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const resetFilters = React.useCallback(() => {
    setSearch("")
  }, [])

  return {
    columns,
    data,
    filteredData,
    search,
    setSearch,
    resetFilters,
    onDelete,
  }
}
