export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface ApiErrorResponse {
  message: string
  data?: unknown
  error?: string
}

export interface CategoryProduct {
  _id: string
  name: string
  slug: string
  price: number
  description?: string
  thumbnail?: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  isDelete: boolean
  products: CategoryProduct[]
  createdAt?: string
  updatedAt?: string
}

export interface CategoryListPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CategoryListFilter {
  q: string | null
}

export interface CategoryListData {
  items: Category[]
  filter: CategoryListFilter
  pagination: CategoryListPagination
}

export interface CreateCategoryPayload {
  name: string
}

export interface UpdateCategoryPayload {
  name: string
}

export interface CategoriesQuery {
  q?: string
  page?: number
  limit?: number
}