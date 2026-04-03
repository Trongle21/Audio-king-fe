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

export type ProductThumbnail = string | ProductImage

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
  thumbnail?: ProductThumbnail
  images?: ProductImage[]
  specifications?: Record<string, string>
  highlights?: string[]
  categories: string[] | ProductCategoryRef[]
  isDelete: boolean
  createdAt?: string
  updatedAt?: string
}

/** Alias theo domain backend — một bản ghi sản phẩm trong danh sách / chi tiết */
export type ProductItem = Product

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

/** Response list (items + pagination + filter) — tương đương `data` từ API */
export type ProductListResponse = ProductListData

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
  sku?: string
  price: number | string
  sale?: number | string
  stock: number | string
  status?: number | string
  description?: string
  rating?: number | string
  categories: string[]
  images?: ProductImageInput[]
  thumbnail?: ProductImage
  specifications?: Record<string, string>
  highlights?: string[]
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
  thumbnail?: ProductImage
  specifications?: Record<string, string>
  highlights?: string[]
}
