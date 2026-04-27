export type MediaImage = {
  url: string
  alt: string
  publicId?: string
  resourceType?: string
}

export type SingletonDoc = {
  _id: string
  images: MediaImage[]
  createdAt?: string
  updatedAt?: string
}

export type AboutImagesPagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type AboutImagesData = {
  items: SingletonDoc[]
  pagination: AboutImagesPagination
}
