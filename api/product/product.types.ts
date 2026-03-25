export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface ApiErrorResponse {
  message: string
  data?: unknown
  error?: string
}

export type ProductSortBy = "name" | "price" | "createdAt"
export type ProductOrder = "asc" | "desc"

export interface ProductCategoryRef {
  _id: string
  name: string
  slug: string
}

export interface ProductImage {
  url: string
  alt?: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  sku: string
  description?: string
  price: number
  sale?: number
  stock: number
  status?: number
  rating?: number
  thumbnail?: string
  images?: ProductImage[]
  categories: string[] | ProductCategoryRef[]
  isDelete: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UploadFileResponse {
  url: string
  publicId: string
  resourceType: "image" | "video" | "raw"
}

export interface ProductListPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductListFilter {
  q: string | null
  status: number | null
  categoryId: string | null
  minPrice: number | null
  maxPrice: number | null
  sortBy: ProductSortBy
  order: ProductOrder
}

export interface ProductListData {
  items: Product[]
  pagination: ProductListPagination
  filter: ProductListFilter
}

export interface GetProductsParams {
  q?: string
  status?: number
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: ProductSortBy
  order?: ProductOrder
  page?: number
  limit?: number
}

export interface ProductImageInput {
  url: string
  alt?: string
}

export interface CreateProductPayload {
  name: string
  price: number | string
  sale?: number | string
  stock: number | string
  status?: number | string
  description?: string
  sku: string
  rating?: number | string
  categories: string[]
  images?: ProductImageInput[]
  thumbnail?: string
  files?: File[]
}

export interface UpdateProductPayload {
  name?: string
  price?: number
  sale?: number
  stock?: number
  status?: number
  description?: string
  sku?: string
  rating?: number
  categories?: string[]
  images?: ProductImageInput[]
  thumbnail?: string
}
