"use client"

import * as React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import {
  deleteOrder,
  getOrders,
  updateOrderPaymentStatus,
  type AdminOrderStatus,
  type Order,
  type PaymentStatus,
} from "@/api/orders"

export type CartRow = {
  id: string
  customer: string
  items: number
  total: string
  status: string
  paymentStatus: PaymentStatus
  productImages: string[]
  updatedAt: string
}

const cartsQueryKey = ["admin-orders"] as const

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

function normalizeCartRow(order: Order): CartRow {
  const itemsCount = order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0
  const productImages = Array.from(
    new Set(
      (order.items ?? [])
        .map((item) => item.thumbnail)
        .filter((url): url is string => typeof url === "string" && url.trim().length > 0),
    ),
  )

  return {
    id: order._id,
    customer: order.customerName?.trim() || "Khách lẻ",
    items: itemsCount,
    total: formatCurrency(order.totalAmount ?? order.subtotal ?? 0),
    status: order.status ?? "-",
    paymentStatus: order.paymentStatus === "paid" ? "paid" : "unpaid",
    productImages,
    updatedAt: formatDateTime(order.updatedAt ?? order.createdAt),
  }
}

function extractOrderItems(payload: unknown): Order[] {
  if (!payload || typeof payload !== "object") return []

  const top = payload as Record<string, unknown>
  const topData = top.data

  if (topData && typeof topData === "object") {
    const dataObject = topData as Record<string, unknown>

    const directItems = dataObject.items
    if (Array.isArray(directItems)) return directItems as Order[]

    const nestedData = dataObject.data
    if (nestedData && typeof nestedData === "object") {
      const nestedItems = (nestedData as Record<string, unknown>).items
      if (Array.isArray(nestedItems)) return nestedItems as Order[]
    }

    if (Array.isArray(topData)) return topData as Order[]
  }

  return []
}

function toFriendlyError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message.trim() : ""
  if (message.includes("401") || message.includes("403")) {
    return "Bạn không có quyền thao tác đơn hàng. Vui lòng đăng nhập lại tài khoản admin."
  }
  return message || fallback
}

export function useCartsTable() {
  const queryClient = useQueryClient()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<AdminOrderStatus | undefined>(undefined)
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState<PaymentStatus | undefined>(undefined)
  const [updatingPaymentId, setUpdatingPaymentId] = React.useState<string | null>(null)

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [...cartsQueryKey, statusFilter, paymentStatusFilter],
    queryFn: () =>
      getOrders({
        page: 1,
        limit: 12,
        status: statusFilter,
        paymentStatus: paymentStatusFilter,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartsQueryKey })
      toast.success("Xóa đơn hàng thành công.")
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message.trim() : ""
      if (message.includes("404")) {
        toast.error("Đơn hàng không tồn tại hoặc đã bị xóa.")
        return
      }
      toast.error(toFriendlyError(err, "Xóa đơn hàng thất bại. Vui lòng thử lại."))
    },
  })

  const paymentMutation = useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) =>
      updateOrderPaymentStatus(id, paymentStatus),
    onMutate: ({ id }) => {
      setUpdatingPaymentId(id)
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thanh toán thành công.")
      queryClient.invalidateQueries({ queryKey: cartsQueryKey })
    },
    onError: (err) => {
      toast.error(toFriendlyError(err, "Cập nhật trạng thái thanh toán thất bại."))
    },
    onSettled: () => {
      setUpdatingPaymentId(null)
    },
  })

  const rawOrders = React.useMemo(() => extractOrderItems(ordersResponse), [ordersResponse])
  const data = React.useMemo(() => rawOrders.map(normalizeCartRow), [rawOrders])

  const columns = React.useMemo<ColumnDef<CartRow>[]>(
    () => [
      {
        id: "productImages",
        header: "Ảnh sản phẩm",
        cell: ({ row }) => {
          const images = row.original.productImages
          if (!images.length) return "Không có ảnh"

          return React.createElement(
            "div",
            { className: "flex items-center gap-1" },
            ...images.slice(0, 4).map((src, index) =>
              React.createElement("img", {
                key: `${src}-${index}`,
                src,
                alt: `Product ${index + 1}`,
                className: "h-8 w-8 rounded object-cover border",
              }),
            ),
            images.length > 4
              ? React.createElement(
                  "span",
                  { className: "text-xs text-slate-500" },
                  `+${images.length - 4}`,
                )
              : null,
          )
        },
      },
      { accessorKey: "customer", header: "Khách hàng" },
      { accessorKey: "items", header: "Số món" },
      { accessorKey: "total", header: "Tổng tiền" },
      { accessorKey: "status", header: "Trạng thái đơn" },
      {
        accessorKey: "paymentStatus",
        header: "Thanh toán",
        cell: ({ row }) => {
          const paid = row.original.paymentStatus === "paid"
          return React.createElement(
            "span",
            {
              className: paid
                ? "inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
                : "inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700",
            },
            paid ? "Đã thanh toán" : "Chưa thanh toán",
          )
        },
      },
      { accessorKey: "updatedAt", header: "Cập nhật" },
    ],
    [],
  )

  const filteredData = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data

    return data.filter(
      (item) =>
        item.customer.toLowerCase().includes(q) ||
        item.total.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    )
  }, [data, search])

  const onDelete = React.useCallback(
    (id: string) => {
      deleteMutation.mutate(id)
    },
    [deleteMutation],
  )

  const onTogglePaymentStatus = React.useCallback(
    (id: string, currentStatus: PaymentStatus) => {
      const nextStatus: PaymentStatus = currentStatus === "paid" ? "unpaid" : "paid"
      const confirmed = window.confirm(
        `Xác nhận chuyển trạng thái thanh toán sang ${
          nextStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
        }?`,
      )
      if (!confirmed) return

      paymentMutation.mutate({ id, paymentStatus: nextStatus })
    },
    [paymentMutation],
  )

  const resetFilters = React.useCallback(() => {
    setSearch("")
    setStatusFilter(undefined)
    setPaymentStatusFilter(undefined)
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
    isUpdatingPaymentStatus: paymentMutation.isPending,
    updatingPaymentId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    resetFilters,
    onDelete,
    onTogglePaymentStatus,
  }
}
