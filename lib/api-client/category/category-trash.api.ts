import { apiDelete, apiGet, getAccessToken } from "@/api"

import { restoreCategory } from "./category.api"

import type {
  ApiSuccessResponse,
  CategoriesQuery,
  Category,
  CategoryListData,
} from "./category.types"

const CATEGORY_BASE_PATH = "/categories"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()
  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

function buildDeletedCategoriesQueryString(query: CategoriesQuery = {}) {
  const searchParams = new URLSearchParams()

  const q = query.q?.trim()
  if (q) searchParams.set("q", q)
  if (query.page !== undefined) searchParams.set("page", String(query.page))
  if (query.limit !== undefined) searchParams.set("limit", String(query.limit))

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

export async function getDeletedCategories(query: CategoriesQuery = {}) {
  const queryString = buildDeletedCategoriesQueryString(query)

  return apiGet<ApiSuccessResponse<CategoryListData>>(
    `${CATEGORY_BASE_PATH}/deleted${queryString}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function restoreDeletedCategory(id: string) {
  return restoreCategory(id)
}

export async function hardDeleteCategory(id: string) {
  return apiDelete<ApiSuccessResponse<Category>>(
    `${CATEGORY_BASE_PATH}/${id}/hard`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}
