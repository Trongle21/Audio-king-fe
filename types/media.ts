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
