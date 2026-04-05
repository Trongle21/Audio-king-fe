import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getAccessToken } from "@/api"

import type {
  AboutDocument,
  AboutImageMutationPayload,
  AboutImagesData,
  AboutImagesParams,
  AboutMutationPayload,
  AboutUploadSignatureData,
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

export async function getAboutById(id: string) {
  return apiGet<ApiSuccessResponse<AboutDocument>>(`${ABOUT_BASE_PATH}/${id}`, {}, { auth: false })
}

export async function getAboutUploadSignature() {
  const response = await apiGet<ApiSuccessResponse<AboutUploadSignatureData>>(
    `${ABOUT_BASE_PATH}/upload-signature`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )

  return response.data
}

export async function createAbout(payload: AboutMutationPayload) {
  return apiPost<ApiSuccessResponse<AboutDocument>, AboutMutationPayload>(
    ABOUT_BASE_PATH,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateAbout(id: string, payload: AboutMutationPayload) {
  return apiPut<ApiSuccessResponse<AboutDocument>, AboutMutationPayload>(
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

export async function addAboutImages(id: string, payload: AboutMutationPayload) {
  return apiPost<ApiSuccessResponse<AboutDocument>, AboutMutationPayload>(
    `${ABOUT_BASE_PATH}/${id}/images`,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function updateAboutImage(
  id: string,
  imageIndex: number,
  payload: AboutImageMutationPayload,
) {
  return apiPatch<ApiSuccessResponse<AboutDocument>, AboutImageMutationPayload>(
    `${ABOUT_BASE_PATH}/${id}/images/${imageIndex}`,
    {
      body: payload,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

export async function deleteAboutImage(id: string, imageIndex: number) {
  return apiDelete<ApiSuccessResponse<AboutDocument>>(
    `${ABOUT_BASE_PATH}/${id}/images/${imageIndex}`,
    {
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}
