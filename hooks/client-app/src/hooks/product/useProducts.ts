"use client"

import { useState, useEffect } from "react"

interface Product {
  id: number
  name: string
  price: string
  status: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Fetch products from API
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setProducts([
          {
            id: 1,
            name: "Audio Premium",
            price: "999,000đ",
            status: "Còn hàng",
          },
          {
            id: 2,
            name: "Audio Standard",
            price: "599,000đ",
            status: "Còn hàng",
          },
          { id: 3, name: "Audio Basic", price: "299,000đ", status: "Hết hàng" },
        ])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải sản phẩm")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return {
    products,
    isLoading,
    error,
    refetch: () => {
      // TODO: Implement refetch logic
    },
  }
}
