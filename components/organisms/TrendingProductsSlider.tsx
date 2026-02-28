"use client"

import * as React from "react"

import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import {
  HomeProductCard,
  type HomeProduct,
} from "@/components/organisms/HomeProductCard"

import type { Swiper as SwiperInstance } from "swiper"

import "swiper/css"

interface TrendingProductsSliderProps {
  products: HomeProduct[]
}

const AUTO_PLAY_INTERVAL = 5000 // 5s
// Lấy tối đa 12 sản phẩm, hiển thị 6 sản phẩm / màn hình desktop ⇒ vẫn có sản phẩm để trượt
const MAX_PRODUCTS = 12

export function TrendingProductsSlider({
  products,
}: TrendingProductsSliderProps) {
  // Di chuyển useRef lên trước early return để tuân thủ rules of hooks
  const swiperRef = React.useRef<SwiperInstance | null>(null)

  // Giới hạn tối đa MAX_PRODUCTS sản phẩm để hiển thị
  const visibleProducts = React.useMemo(
    () => products.slice(0, MAX_PRODUCTS),
    [products]
  )

  if (visibleProducts.length === 0) return null

  return (
    <div className="space-y-4">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: AUTO_PLAY_INTERVAL,
          disableOnInteraction: false,
        }}
        loop={visibleProducts.length > 1}
        onSwiper={(swiper: SwiperInstance) => {
          swiperRef.current = swiper
        }}
        spaceBetween={16}
        className="trending-swiper"
        // 1 dòng, responsive số lượng item; desktop tối đa 6 item
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 14 },
          768: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 18 },
          1280: { slidesPerView: 6, spaceBetween: 20 },
        }}
      >
        {visibleProducts.map((product) => (
          <SwiperSlide key={product.id} className="h-auto!">
            <HomeProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {visibleProducts.length > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-sm text-foreground shadow hover:bg-accent"
            aria-label="Xem nhóm sản phẩm trước"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-sm text-foreground shadow hover:bg-accent"
            aria-label="Xem nhóm sản phẩm tiếp theo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
