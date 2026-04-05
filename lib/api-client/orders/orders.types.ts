export interface ApiSuccessResponse<T> {
  message: string
  data: T
}

export type CreateOrderBody = {
  customerName: string
  phone: string
  address: string
  note?: string
  items: Array<{
    productId: string
    quantity: number
  }>
}

export type OrderItemSnapshot = {
  product: string
  name: string
  thumbnail?: string
  quantity: number
  unitPrice: number
  sale?: number | null
  finalPrice: number
  lineTotal: number
}

export type PaymentStatus = "unpaid" | "paid"

export type Order = {
  _id: string
  customerName: string
  phone: string
  address: string
  note?: string
  items: OrderItemSnapshot[]
  subtotal: number
  shippingFee: number
  totalAmount: number
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" | string
  paymentStatus?: PaymentStatus
  createdAt?: string
  updatedAt?: string
}

