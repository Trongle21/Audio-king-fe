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
  items: AboutImage[]
  pagination: AboutImagesPagination
}

export interface AboutImagesParams {
  page?: number
  limit?: number
}

export interface AboutPayload {
  images: AboutImage[]
}