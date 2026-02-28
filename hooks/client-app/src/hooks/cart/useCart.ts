"use client"

import { useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage or API
    const loadCart = async () => {
      try {
        const stored = localStorage.getItem("cart")
        if (stored) {
          setItems(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Failed to load cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        const updated = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        localStorage.setItem("cart", JSON.stringify(updated))
        return updated
      }
      const updated = [...prev, { ...item, quantity: 1 }]
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id)
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
