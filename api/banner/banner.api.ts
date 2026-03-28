import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type { ApiSuccessResponse, Banner, BannerPayload } from "./banner.types"

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

export async function getBannerById(id: string) {
  return apiGet<ApiSuccessResponse<Banner>>(`${BANNER_BASE_PATH}/${id}`, {}, { auth: false })
}

export async function createBanner(payload: BannerPayload) {
  return apiPost<ApiSuccessResponse<Banner>, BannerPayload>(
    BANNER_BASE_PATH,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateBanner(id: string, payload: Partial<BannerPayload>) {
  return apiPatch<ApiSuccessResponse<Banner>, Partial<BannerPayload>>(
    `${BANNER_BASE_PATH}/${id}`,
    {
      body: payload,
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
