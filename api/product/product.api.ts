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

  if (params.q) searchParams.set("q", params.q)
  if (params.status !== undefined) searchParams.set("status", String(params.status))
  if (params.categoryId) searchParams.set("categoryId", params.categoryId)
  if (params.minPrice !== undefined) searchParams.set("minPrice", String(params.minPrice))
  if (params.maxPrice !== undefined) searchParams.set("maxPrice", String(params.maxPrice))
  if (params.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params.order) searchParams.set("order", params.order)
  if (params.page !== undefined) searchParams.set("page", String(params.page))
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit))

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
