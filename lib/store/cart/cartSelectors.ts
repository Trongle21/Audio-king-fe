import type { CartItem } from "@/lib/store/slices/cartSlice"
import type { RootState } from "@/lib/store/store"

export const selectCartItems = (state: RootState): CartItem[] => state.cart.items

export const selectCartCount = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

function estimateFinalUnitPrice(item: CartItem): number {
  const price = item.price ?? 0
  const sale = item.sale

  // If sale looks like a percent, estimate final price accordingly.
  if (typeof sale === "number" && sale >= 0 && sale <= 100) {
    return Math.round(price * (1 - sale / 100))
  }

  return price
}

export const selectCartSubtotalEstimate = (state: RootState): number =>
  state.cart.items.reduce(
    (sum, item) => sum + estimateFinalUnitPrice(item) * item.quantity,
    0,
  )

