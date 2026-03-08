"use client"

import { useMemo } from "react"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  addItem as addItemAction,
  clearCart as clearCartAction,
  removeItem as removeItemAction,
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
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const addItem = (item: {
    id: string
    name: string
    price: number
    imageUrl?: string
  }) => {
    dispatch(addItemAction(item))
  }

  const removeItem = (id: string) => {
    dispatch(removeItemAction(id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantityAction({ id, quantity }))
  }

  const clearCart = () => {
    dispatch(clearCartAction())
  }

  return {
    items,
    totalItems,
    totalPrice,
    isLoading: false,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}

