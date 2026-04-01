import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  productId: string
  name: string
  thumbnail?: string
  price?: number
  sale?: number | null
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Omit<CartItem, "quantity">
        quantity?: number
      }>,
    ) => {
      const quantity = Math.max(1, Math.floor(action.payload.quantity ?? 1))
      const product = action.payload.product
      const existing = state.items.find((i) => i.productId === product.productId)
      if (existing) {
        existing.quantity += quantity
        return
      }

      state.items.push({ ...product, quantity })
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId)
      if (!item) return
      item.quantity = Math.max(1, Math.floor(action.payload.quantity))
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions

export default cartSlice.reducer

