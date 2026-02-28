"use client"

import { useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  price: string
  status: string
}

export function useProduct(productId: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Fetch single product from API
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setProduct({
          id: productId,
          name: `Product ${productId}`,
          price: "999,000đ",
          status: "Còn hàng",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải sản phẩm")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  return {
    product,
    isLoading,
    error,
  }
}
