import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type {
  ApiSuccessResponse,
  CategoriesQuery,
  Category,
  CategoryListData,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "./category.types"

const CATEGORY_BASE_PATH = "/categories"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()

  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

export async function getCategories(query?: CategoriesQuery) {
  const searchParams = new URLSearchParams()

  const q = query?.q?.trim()
  if (q) searchParams.set("q", q)
  if (query?.page !== undefined) searchParams.set("page", String(query.page))
  if (query?.limit !== undefined) searchParams.set("limit", String(query.limit))

  const queryString = searchParams.toString()
  const search = queryString ? `?${queryString}` : ""

  return apiGet<ApiSuccessResponse<CategoryListData>>(
    `${CATEGORY_BASE_PATH}${search}`,
    {},
    { auth: false },
  )
}

export async function getCategoryById(id: string) {
  return apiGet<ApiSuccessResponse<Category>>(
    `${CATEGORY_BASE_PATH}/${id}`,
    {},
    { auth: false },
  )
}

export async function createCategory(payload: CreateCategoryPayload) {
  return apiPost<ApiSuccessResponse<Category>, CreateCategoryPayload>(
    CATEGORY_BASE_PATH,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return apiPatch<ApiSuccessResponse<Category>, UpdateCategoryPayload>(
    `${CATEGORY_BASE_PATH}/${id}`,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function softDeleteCategory(id: string) {
  return apiDelete<ApiSuccessResponse<Category>>(
    `${CATEGORY_BASE_PATH}/${id}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function restoreCategory(id: string) {
  return apiPatch<ApiSuccessResponse<Category>, undefined>(
    `${CATEGORY_BASE_PATH}/${id}/restore`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}
