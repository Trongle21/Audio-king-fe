export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export interface CartCustomer {
  _id?: string
  name?: string
  fullName?: string
  username?: string
  email?: string
}

export interface CartItem {
  productId?: string
  product?: string
  name?: string
  quantity?: number
  unitPrice?: number
  price?: number
  finalPrice?: number
  lineTotal?: number
}

export interface Cart {
  _id: string
  customer?: string | CartCustomer
  customerName?: string
  items?: CartItem[]
  totalAmount?: number
  subtotal?: number
  updatedAt?: string
  createdAt?: string
}

