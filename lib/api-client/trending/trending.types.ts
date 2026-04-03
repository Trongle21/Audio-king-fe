import type { Product } from "@/api/product"

export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface TrendingItem {
  _id: string
  productId: string
  priority: number
  product: Product
}

export interface UpdateTrendingBody {
  items: Array<{
    productId: string
    priority: number
  }>
}

