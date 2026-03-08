/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import "swiper/css"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { Button } from "@/components/atoms"
import { Card, CardContent } from "@/components/molecules"
import { useCart } from "@/hooks/client-app/src/hooks/cart"

export type HomeProduct = {
  id: string
  name: string
  imageUrl: string
  images?: string[]
  price: string
  oldPrice?: string
  discountLabel?: string
  badge?: string
  meta?: string
}

export function ProductCard({ product }: { product: HomeProduct }) {
  const imageContainerRef = React.useRef<HTMLAnchorElement | null>(null)
  const { addItem } = useCart()

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl]

  const detailHref = `/product/${product.id}`

  const handleAddToCart = () => {
    const numericPrice = Number(product.price.replace(/[^\d]/g, "")) || 0

    addItem({
      id: product.id,
      name: product.name,
      price: numericPrice,
      imageUrl: product.imageUrl,
    })

    if (typeof document === "undefined") return

    const sourceEl = imageContainerRef.current
    const cartEl = document.getElementById("cart-icon")
    if (!sourceEl || !cartEl) return

    const sourceRect = sourceEl.getBoundingClientRect()
    const cartRect = cartEl.getBoundingClientRect()

    const clone = sourceEl.cloneNode(true) as HTMLElement
    clone.style.position = "fixed"
    clone.style.left = `${sourceRect.left}px`
    clone.style.top = `${sourceRect.top}px`
    clone.style.width = `${sourceRect.width}px`
    clone.style.height = `${sourceRect.height}px`
    clone.style.zIndex = "9999"
    clone.style.pointerEvents = "none"
    clone.style.overflow = "hidden"
    clone.style.borderRadius = "0.75rem"
    clone.style.transition = "transform 0.7s ease, opacity 0.7s ease"

    document.body.appendChild(clone)

    const translateX =
      cartRect.left +
      cartRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2)
    const translateY =
      cartRect.top +
      cartRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2)

    // Trigger transition in next frame
    requestAnimationFrame(() => {
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.1)`
      clone.style.opacity = "0"
    })

    clone.addEventListener(
      "transitionend",
      () => {
        clone.remove()
      },
      { once: true },
    )
  }

  return (
    <article
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link
        ref={imageContainerRef}
        href={detailHref}
        aria-label={product.name}
        className="relative aspect-4/3 w-full bg-muted overflow-hidden cursor-pointer"
      >
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={images.length > 1}
          className="h-full w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 cursor-pointer"
                itemProp="image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </Link>

      <Card className="flex flex-1 flex-col border-0 shadow-none">
        <CardContent className="flex flex-1 flex-col space-y-2 p-3">
          <h3
            className="line-clamp-2 text-sm font-semibold hover:underline cursor-pointer"
            itemProp="name"
            title={product.name}
          >
            <Link href={detailHref}>{product.name}</Link>
          </h3>
          {product.meta && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {product.meta}
            </p>
          )}

          <div
            className="space-y-1"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <p
              className="text-base font-bold text-destructive"
              itemProp="price"
            >
              {product.price}
            </p>
            {product.oldPrice && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="line-through">{product.oldPrice}</span>
                {product.discountLabel && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {product.discountLabel}
                  </span>
                )}
              </p>
            )}
            <meta itemProp="priceCurrency" content="VND" />
          </div>

          <div className="mt-auto flex flex-col gap-2 sm:flex-row">
            <Link href={detailHref} className="sm:flex-1">
              <Button
                size="sm"
                className="w-full bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                aria-label={`Xem chi tiết ${product.name}`}
              >
                Chi tiết
              </Button>
            </Link>

            <Button
              type="button"
              size="sm"
              onClick={handleAddToCart}
              className="sm:flex-1 border border-destructive bg-white text-destructive hover:bg-destructive/5 cursor-pointer"
              aria-label={`Thêm ${product.name} vào giỏ hàng`}
            >
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              Thêm vào giỏ
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
