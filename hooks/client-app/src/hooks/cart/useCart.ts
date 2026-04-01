"use client"

import { useMemo } from "react"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  addToCart as addToCartAction,
  clearCart as clearCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
} from "@/lib/store/slices/cartSlice"

export function useCart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0),
    [items],
  )

  const addToCart = (payload: {
    product: {
      productId: string
      name: string
      thumbnail?: string
      price?: number
      sale?: number | null
    }
    quantity?: number
  }) => {
    dispatch(addToCartAction(payload))
  }

  const removeFromCart = (productId: string) => {
    dispatch(removeFromCartAction(productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantityAction({ productId, quantity }))
  }

  const clearCart = () => {
    dispatch(clearCartAction())
  }

  return {
    items,
    totalItems,
    totalPrice,
    isLoading: false,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}

