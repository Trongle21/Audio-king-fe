import { apiDelete, apiGet, getAccessToken } from "@/api"

import { restoreProduct } from "./product.api"

import type {
  ApiSuccessResponse,
  GetProductsParams,
  Product,
  ProductListData,
} from "./product.types"

const PRODUCT_BASE_PATH = "/products"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()
  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

function buildDeletedProductsQueryString(params: GetProductsParams = {}) {
  const searchParams = new URLSearchParams()

  const q = params.q?.trim()
  if (q) searchParams.set("q", q)
  if (params.status !== undefined) searchParams.set("status", String(params.status))
  if (params.categoryId) searchParams.set("categoryId", params.categoryId)
  if (params.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params.order) searchParams.set("order", params.order)
  if (params.page !== undefined) searchParams.set("page", String(params.page))
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit))

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

export async function getDeletedProducts(params: GetProductsParams = {}) {
  const queryString = buildDeletedProductsQueryString(params)

  return apiGet<ApiSuccessResponse<ProductListData>>(
    `${PRODUCT_BASE_PATH}/deleted${queryString}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function restoreDeletedProduct(id: string) {
  return restoreProduct(id)
}

export async function hardDeleteProduct(id: string) {
  return apiDelete<ApiSuccessResponse<Product>>(
    `${PRODUCT_BASE_PATH}/${id}/hard`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}
