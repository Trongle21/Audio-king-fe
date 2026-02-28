"use client"

import Image from "next/image"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/pagination"

const slides = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Hệ thống loa karaoke gia đình hiện đại",
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Dàn âm thanh sân khấu chuyên nghiệp",
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Hệ thống loa nghe nhạc cao cấp",
  },
  {
    id: 4,
    src: "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Không gian giải trí gia đình với âm thanh sống động",
  },
] as const

export function HomeBannerSlider() {
  return (
    <section
      aria-label="Banner khuyến mãi FE-Audio"
      className="relative w-full overflow-hidden rounded-none"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        pagination={{ clickable: true }}
        className="h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={slide.id === 1}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
