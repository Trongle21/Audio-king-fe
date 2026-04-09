import { apiDelete, apiGet, apiPatch, apiPost, getAccessToken } from "@/api"

import type { ApiSuccessResponse, Banner } from "./banner.types"
import type { SingletonDoc } from "@/types/media"

const BANNER_BASE_PATH = "/banners"

function buildTokenHeader(): Record<string, string> {
  const accessToken = getAccessToken()

  return {
    token: accessToken ? `Bearer ${accessToken}` : "",
  }
}

export async function getBanners() {
  const response = await apiGet<ApiSuccessResponse<Banner[]>>(
    BANNER_BASE_PATH,
    {},
    { auth: false },
  )
  return response.data
}

export async function createBanner(payload: FormData | File[]) {
  const formData = payload instanceof FormData ? payload : buildFilesFormData(payload)
  return apiPost<ApiSuccessResponse<Banner>, FormData>(
    BANNER_BASE_PATH,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )
}

function buildFilesFormData(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))
  return formData
}

export async function getBannerSingleton(): Promise<SingletonDoc | null> {
  const response = await apiGet<ApiSuccessResponse<SingletonDoc[]>>(
    BANNER_BASE_PATH,
    {},
    { auth: false },
  )

  return response.data[0] ?? null
}

export async function createBannerSingleton(files: File[]): Promise<SingletonDoc> {
  const response = await createBanner(files)
  return response.data as SingletonDoc
}

export async function updateBannerById(id: string, files: File[]): Promise<SingletonDoc> {
  const response = await apiPatch<ApiSuccessResponse<SingletonDoc>, FormData>(
    `${BANNER_BASE_PATH}/${id}`,
    {
      body: buildFilesFormData(files),
      headers: buildTokenHeader(),
    },
    { auth: false },
  )

  return response.data
}

export async function addBannerImages(files: File[]): Promise<SingletonDoc> {
  const response = await apiPost<ApiSuccessResponse<SingletonDoc>, FormData>(
    `${BANNER_BASE_PATH}/images`,
    {
      body: buildFilesFormData(files),
      headers: buildTokenHeader(),
    },
    { auth: false },
  )

  return response.data
}

export async function replaceBannerImages(indices: number[], files: File[]): Promise<SingletonDoc> {
  const formData = buildFilesFormData(files)
  formData.append("indices", JSON.stringify(indices))

  const response = await apiPatch<ApiSuccessResponse<SingletonDoc>, FormData>(
    `${BANNER_BASE_PATH}/images`,
    {
      body: formData,
      headers: buildTokenHeader(),
    },
    { auth: false },
  )

  return response.data
}

export async function deleteBannerImages(payload: {
  indices?: number[]
  publicIds?: string[]
}): Promise<SingletonDoc> {
  const response = await apiDelete<ApiSuccessResponse<SingletonDoc>>(
    `${BANNER_BASE_PATH}/images`,
    {
      headers: buildTokenHeader(),
      body: JSON.stringify(payload),
    },
    { auth: false },
  )

  return response.data
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
