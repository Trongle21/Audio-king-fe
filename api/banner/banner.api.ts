import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type { ApiSuccessResponse, Banner } from "./banner.types"

const BANNER_BASE_PATH = "/banners"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()

  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

export async function getBanners() {
  return apiGet<ApiSuccessResponse<Banner[]>>(BANNER_BASE_PATH, {}, { auth: false })
}

export async function createBanner(formData: FormData) {
  return apiPost<ApiSuccessResponse<Banner>, FormData>(
    BANNER_BASE_PATH,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateBanner(id: string, formData: FormData) {
  return apiPatch<ApiSuccessResponse<Banner>, FormData>(
    `${BANNER_BASE_PATH}/${id}`,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function deleteBanner(id: string) {
  return apiDelete<ApiSuccessResponse<Banner>>(
    `${BANNER_BASE_PATH}/${id}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}
