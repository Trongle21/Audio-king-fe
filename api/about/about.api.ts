import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type {
  AboutDocument,
  AboutImagesData,
  AboutImagesParams,
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
  const response = await apiGet<ApiSuccessResponse<AboutImagesData>>(
    `${ABOUT_BASE_PATH}${query}`,
    {},
    { auth: false },
  )
  return response.data
}

export async function createAbout(formData: FormData) {
  return apiPost<ApiSuccessResponse<AboutDocument>, FormData>(
    ABOUT_BASE_PATH,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateAbout(id: string, formData: FormData) {
  return apiPatch<ApiSuccessResponse<AboutDocument>, FormData>(
    `${ABOUT_BASE_PATH}/${id}`,
    {
      body: formData,
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