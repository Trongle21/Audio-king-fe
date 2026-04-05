export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface ApiErrorResponse {
  message: string
  data?: unknown
  error?: string
}

export interface AboutImage {
  url: string
  alt?: string
}

export interface AboutDocument {
  _id: string
  images: AboutImage[]
  createdAt?: string
  updatedAt?: string
}

export interface AboutImagesPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AboutImagesData {
  items: AboutDocument[]
  pagination: AboutImagesPagination
}

export interface AboutImagesParams {
  page?: number
  limit?: number
}

export interface AboutPayload {
  images: AboutImage[]
}

export type AboutMutationPayload = AboutPayload | FormData

export interface AboutImagePayload {
  url: string
  alt?: string
}

export type AboutImageMutationPayload = AboutImagePayload | FormData

export interface AboutUploadSignatureData {
  timestamp: number
  folder: string
  signature: string
  cloudName: string
  apiKey: string
}
