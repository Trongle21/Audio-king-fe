export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface ApiErrorResponse {
  message: string
  data?: unknown
  error?: string
}

export interface BannerImage {
  url: string
  alt?: string
}

export interface Banner {
  _id: string
  images: BannerImage[]
  createdAt?: string
  updatedAt?: string
}
