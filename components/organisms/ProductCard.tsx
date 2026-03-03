/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"

import "swiper/css"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { Button } from "@/components/atoms"
import { Card, CardContent } from "@/components/molecules"

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
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl]

  const detailHref = `/product/${product.id}`

  return (
    <article
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link
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

          <Link href={detailHref} className="mt-auto">
            <Button
              size="sm"
              className="w-full bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              aria-label={`Xem chi tiết ${product.name}`}
            >
              Xem chi tiết
            </Button>
          </Link>
        </CardContent>
      </Card>
    </article>
  )
}
