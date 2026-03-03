/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"

import "swiper/css"
import "swiper/css/navigation"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperInstance } from "swiper"

type ProductImageGalleryProps = {
  images: string[]
  alt: string
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [mainSwiper, setMainSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const hasMultiple = images.length > 1

  return (
    <div className="space-y-3">
      {/* Ảnh lớn */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
        <Swiper
          onSwiper={setMainSwiper}
          modules={[Autoplay, Navigation]}
          autoplay={hasMultiple ? { delay: 4000, disableOnInteraction: false } : false}
          loop={hasMultiple}
          navigation
          grabCursor
          onSlideChange={(swiper: SwiperInstance) => {
            const nextIndex =
              typeof swiper.realIndex === "number"
                ? swiper.realIndex
                : swiper.activeIndex ?? 0
            setActiveIndex(nextIndex)
          }}
          className="h-full w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-cover"
                itemProp={index === 0 ? "image" : undefined}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="w-full">
          <Swiper
            modules={[Navigation]}
            navigation
            grabCursor
            spaceBetween={8}
            slidesPerView={3}
            breakpoints={{
              480: { slidesPerView: 4 },
              640: { slidesPerView: 4 },
            }}
            className="h-20 md:h-24"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border bg-muted"
                  onClick={() => {
                    if (mainSwiper) {
                      if (mainSwiper.params.loop) {
                        mainSwiper.slideToLoop(index)
                      } else {
                        mainSwiper.slideTo(index)
                      }
                    }
                  }}
                >
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {index === activeIndex && (
                    <div className="pointer-events-none absolute inset-0 bg-black/30" />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}

