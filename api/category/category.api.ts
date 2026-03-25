import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type {
  ApiSuccessResponse,
  CategoriesQuery,
  Category,
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
  const q = query?.q?.trim()
  const search = q ? `?q=${encodeURIComponent(q)}` : ""

  return apiGet<ApiSuccessResponse<Category[]>>(
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