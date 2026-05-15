"use client"

import * as React from "react"

import { ProductCard, type HomeProduct } from "@/components/organisms/ProductCard"

interface TrendingProductsSliderProps {
  products: HomeProduct[]
}

export function TrendingProductsSlider({ products }: TrendingProductsSliderProps) {
  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
