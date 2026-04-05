import { apiDelete, apiGet, apiPatch, apiPost } from "@/api"

import type {
  ApiSuccessResponse,
  CreateOrderBody,
  Order,
  PaymentStatus,
} from "./orders.types"

const ORDERS_BASE_PATH = "/orders"

export type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled"

export interface AdminOrdersQuery {
  page?: number
  limit?: number
  status?: AdminOrderStatus
  paymentStatus?: PaymentStatus
}

export interface AdminOrdersData {
  items: Order[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  filter?: {
    status?: AdminOrderStatus
    paymentStatus?: PaymentStatus
  }
}

export async function getOrders(query: AdminOrdersQuery = {}) {
  const params = new URLSearchParams()
  if (typeof query.page === "number") params.set("page", String(query.page))
  if (typeof query.limit === "number") params.set("limit", String(query.limit))
  if (query.status) params.set("status", query.status)
  if (query.paymentStatus) params.set("paymentStatus", query.paymentStatus)

  const suffix = params.toString()
  const path = suffix ? `${ORDERS_BASE_PATH}?${suffix}` : ORDERS_BASE_PATH

  return apiGet<ApiSuccessResponse<AdminOrdersData>>(path)
}

export async function deleteOrder(id: string) {
  return apiDelete<ApiSuccessResponse<Order> | undefined>(`${ORDERS_BASE_PATH}/${id}`)
}

export async function createOrder(body: CreateOrderBody) {
  return apiPost<ApiSuccessResponse<Order>, CreateOrderBody>(
    ORDERS_BASE_PATH,
    { body },
    { auth: false },
  )
}

export async function updateOrderPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  return apiPatch<ApiSuccessResponse<Order>, { paymentStatus: PaymentStatus }>(
    `${ORDERS_BASE_PATH}/${id}/payment-status`,
    {
      body: { paymentStatus },
    },
  )
}
