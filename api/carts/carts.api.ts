import { apiDelete, apiGet } from "@/api"

import type { ApiSuccessResponse, Cart } from "./carts.types"

const CARTS_BASE_PATH = "/carts"

export async function getCarts() {
  return apiGet<ApiSuccessResponse<Cart[]>>(CARTS_BASE_PATH)
}

export async function deleteCart(id: string) {
  return apiDelete<ApiSuccessResponse<Cart> | undefined>(`${CARTS_BASE_PATH}/${id}`)
}

