"use client"

import Image from "next/image"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { Button } from "@/components/atoms"
import { BannerSkeleton } from "@/components/common/BannerSkeleton"
import { useBanners } from "@/hooks/client-app/src/hooks/banner"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function HomeBanner() {
  const { slides, isLoading, error, refetch } = useBanners()

  if (isLoading) {
    return <BannerSkeleton />
  }

  if (error) {
    return (
      <section className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        <p className="text-destructive">{error}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() => {
            void refetch()
          }}
        >
          Thu lai
        </Button>
      </section>
    )
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Banner FE-Audio"
      className="relative w-full overflow-hidden rounded-lg"
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        navigation={slides.length > 1}
        className="h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80"
      >
        {slides.map((image, index) => (
          <SwiperSlide key={`${image.url}-${index}`}>
            <div className="relative h-full w-full">
              <Image
                src={image.url}
                alt={image.alt?.trim() || "banner"}
                fill
                className="object-cover"
                sizes="100vw"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

