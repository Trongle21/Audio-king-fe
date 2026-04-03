import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type {
  ApiSuccessResponse,
  CreateProductPayload,
  GetProductsParams,
  Product,
  ProductListData,
  UpdateProductPayload,
  UploadFileResponse,
} from "./product.types"

const PRODUCT_BASE_PATH = "/products"

export const DEFAULT_PRODUCT_LIST_PAGE = 1
export const DEFAULT_PRODUCT_LIST_LIMIT = 12

/** Loại bỏ param rỗng / không hợp lệ trước khi gọi API (giữ contract query backend). */
export function sanitizeGetProductsParams(params: GetProductsParams): GetProductsParams {
  const out: GetProductsParams = {}

  const q = params.q?.trim()
  if (q) out.q = q

  if (params.status !== undefined && params.status !== null) {
    out.status = params.status
  }

  const categoryId = params.categoryId?.trim()
  if (categoryId) out.categoryId = categoryId

  if (params.minPrice !== undefined && Number.isFinite(params.minPrice)) {
    out.minPrice = params.minPrice
  }
  if (params.maxPrice !== undefined && Number.isFinite(params.maxPrice)) {
    out.maxPrice = params.maxPrice
  }

  if (params.sortBy) out.sortBy = params.sortBy
  if (params.order) out.order = params.order

  if (params.page !== undefined) out.page = params.page
  if (params.limit !== undefined) out.limit = params.limit

  return out
}

/** Chuẩn hoá page/limit mặc định cho request + cache key ổn định. */
export function normalizeGetProductsParamsForRequest(
  params: GetProductsParams,
): GetProductsParams {
  const s = sanitizeGetProductsParams(params)
  return {
    ...s,
    page: s.page ?? DEFAULT_PRODUCT_LIST_PAGE,
    limit: s.limit ?? DEFAULT_PRODUCT_LIST_LIMIT,
  }
}

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()

  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

function appendIfDefined(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") {
    return
  }

  formData.append(key, String(value))
}

function buildCreateProductFormData(payload: CreateProductPayload) {
  const formData = new FormData()

  formData.append("name", payload.name)
  appendIfDefined(formData, "price", payload.price)
  appendIfDefined(formData, "sale", payload.sale)
  appendIfDefined(formData, "stock", payload.stock)
  appendIfDefined(formData, "description", payload.description)
  appendIfDefined(formData, "rating", payload.rating)
  formData.append("categories", JSON.stringify(payload.categories))

  if (payload.images && payload.images.length > 0) {
    formData.append("images", JSON.stringify(payload.images))
  }

  if (payload.specifications && Object.keys(payload.specifications).length > 0) {
    formData.append("specifications", JSON.stringify(payload.specifications))
  }

  if (payload.highlights && payload.highlights.length > 0) {
    formData.append("highlights", JSON.stringify(payload.highlights))
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", JSON.stringify({
      url: payload.thumbnail.url,
      alt: payload.thumbnail.alt,
    }))
  }

  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files", file)
    })
  }

  return formData
}

function buildProductsQueryString(params: GetProductsParams = {}) {
  const searchParams = new URLSearchParams()
  const p = normalizeGetProductsParamsForRequest(params)

  if (p.q) searchParams.set("q", p.q)
  if (p.status !== undefined) searchParams.set("status", String(p.status))
  if (p.categoryId) searchParams.set("categoryId", p.categoryId)
  if (p.minPrice !== undefined) searchParams.set("minPrice", String(p.minPrice))
  if (p.maxPrice !== undefined) searchParams.set("maxPrice", String(p.maxPrice))
  if (p.sortBy) searchParams.set("sortBy", p.sortBy)
  if (p.order) searchParams.set("order", p.order)
  searchParams.set("page", String(p.page ?? DEFAULT_PRODUCT_LIST_PAGE))
  searchParams.set("limit", String(p.limit ?? DEFAULT_PRODUCT_LIST_LIMIT))

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

export async function uploadProductFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  return apiPost<ApiSuccessResponse<UploadFileResponse>, FormData>(
    `${PRODUCT_BASE_PATH}/upload-audio`,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function createProduct(payload: CreateProductPayload) {
  const formData = buildCreateProductFormData(payload)

  return apiPost<ApiSuccessResponse<Product>, FormData>(
    PRODUCT_BASE_PATH,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateProduct(id: string, payload: UpdateProductPayload) {
  return apiPatch<ApiSuccessResponse<Product>, UpdateProductPayload>(
    `${PRODUCT_BASE_PATH}/${id}`,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function softDeleteProduct(id: string) {
  return apiDelete<ApiSuccessResponse<Product>>(
    `${PRODUCT_BASE_PATH}/${id}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function restoreProduct(id: string) {
  return apiPatch<ApiSuccessResponse<Product>, undefined>(
    `${PRODUCT_BASE_PATH}/${id}/restore`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function getProducts(params: GetProductsParams = {}) {
  const queryString = buildProductsQueryString(params)

  return apiGet<ApiSuccessResponse<ProductListData>>(
    `${PRODUCT_BASE_PATH}${queryString}`,
    {},
    { auth: false },
  )
}

export async function getProductById(id: string) {
  return apiGet<ApiSuccessResponse<Product>>(`${PRODUCT_BASE_PATH}/${id}`, {}, { auth: false })
}
