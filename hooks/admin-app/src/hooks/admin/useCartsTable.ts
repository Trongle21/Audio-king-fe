"use client"

import * as React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { deleteCart, getCarts, type Cart, type CartCustomer } from "@/api/carts"

export type CartRow = {
  id: string
  customer: string
  items: number
  total: string
  updatedAt: string
}

const cartsQueryKey = ["admin-carts"] as const

function formatCurrency(n: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`
}

function formatDateTime(value?: string): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("vi-VN", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function resolveCustomerName(customer?: string | CartCustomer, fallback?: string) {
  if (fallback?.trim()) return fallback.trim()
  if (typeof customer === "string" && customer.trim()) return customer.trim()
  if (!customer || typeof customer !== "object") return "Khách lẻ"

  return (
    customer.fullName?.trim() ||
    customer.name?.trim() ||
    customer.username?.trim() ||
    customer.email?.trim() ||
    customer._id?.trim() ||
    "Khách lẻ"
  )
}

function normalizeCartRow(cart: Cart): CartRow {
  const totalFromItems = (cart.items ?? []).reduce((sum, item) => {
    const lineTotal = item.lineTotal
    if (typeof lineTotal === "number") return sum + lineTotal
    const qty = item.quantity ?? 0
    const price = item.finalPrice ?? item.unitPrice ?? item.price ?? 0
    return sum + qty * price
  }, 0)

  const total = cart.totalAmount ?? cart.subtotal ?? totalFromItems

  return {
    id: cart._id,
    customer: resolveCustomerName(cart.customer, cart.customerName),
    items: cart.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0,
    total: formatCurrency(total),
    updatedAt: formatDateTime(cart.updatedAt ?? cart.createdAt),
  }
}

export function useCartsTable() {
  const queryClient = useQueryClient()
  const [search, setSearch] = React.useState("")

  const {
    data: cartsResponse,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: cartsQueryKey,
    queryFn: getCarts,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartsQueryKey })
      toast.success("Da xoa gio hang thanh cong.")
    },
    onError: (err) => {
      const message =
        err instanceof Error && err.message.trim()
          ? err.message
          : "Xoa gio hang that bai. Vui long thu lai."
      toast.error(message)
    },
  })

  const data = React.useMemo(
    () => (cartsResponse?.data ?? []).map(normalizeCartRow),
    [cartsResponse?.data],
  )

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
    deleteMutation.mutate(id)
  }, [deleteMutation])

  const resetFilters = React.useCallback(() => {
    setSearch("")
  }, [])

  return {
    columns,
    data,
    filteredData,
    isLoading,
    isFetching,
    isError,
    error,
    isDeleting: deleteMutation.isPending,
    search,
    setSearch,
    resetFilters,
    onDelete,
  }
}
