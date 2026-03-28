import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type {
  AboutDocument,
  AboutImagesData,
  AboutImagesParams,
  AboutPayload,
  ApiSuccessResponse,
} from "./about.types"

const ABOUT_BASE_PATH = "/about"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()

  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

function buildAboutImagesQuery(params: AboutImagesParams = {}) {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) searchParams.set("page", String(params.page))
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit))

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

export async function getAboutImages(params: AboutImagesParams = {}) {
  const query = buildAboutImagesQuery(params)

  return apiGet<ApiSuccessResponse<AboutImagesData>>(`${ABOUT_BASE_PATH}${query}`, {}, { auth: false })
}

export async function createAbout(payload: AboutPayload) {
  return apiPost<ApiSuccessResponse<AboutDocument>, AboutPayload>(
    ABOUT_BASE_PATH,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateAbout(id: string, payload: Partial<AboutPayload>) {
  return apiPatch<ApiSuccessResponse<AboutDocument>, Partial<AboutPayload>>(
    `${ABOUT_BASE_PATH}/${id}`,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function deleteAbout(id: string) {
  return apiDelete<ApiSuccessResponse<AboutDocument>>(
    `${ABOUT_BASE_PATH}/${id}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}