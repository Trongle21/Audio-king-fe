import { apiPost } from "@/api"

import type { ApiSuccessResponse, CreateOrderBody, Order } from "./orders.types"

const ORDERS_BASE_PATH = "/orders"

export async function createOrder(body: CreateOrderBody) {
  return apiPost<ApiSuccessResponse<Order>, CreateOrderBody>(
    ORDERS_BASE_PATH,
    { body },
    { auth: false },
  )
}

