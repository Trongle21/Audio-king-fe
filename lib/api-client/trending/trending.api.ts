import { apiGet, apiPut, getAccessToken } from "@/api"

import type {
  ApiSuccessResponse,
  TrendingItem,
  UpdateTrendingBody,
} from "./trending.types"

const TRENDING_BASE_PATH = "/trending"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()
  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

export async function getTrending() {
  const response = await apiGet<ApiSuccessResponse<TrendingItem[]>>(
    TRENDING_BASE_PATH,
    {},
    { auth: false },
  )
  return response.data
}

export async function updateTrending(body: UpdateTrendingBody) {
  const response = await apiPut<ApiSuccessResponse<TrendingItem[]>, UpdateTrendingBody>(
    TRENDING_BASE_PATH,
    {
      body,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
  return response.data
}

