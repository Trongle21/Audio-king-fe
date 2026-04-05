"use client"

import Image from "next/image"

import { Button } from "@/components/atoms"
import { AboutSkeleton } from "@/components/common/AboutSkeleton"
import { useAboutImages } from "@/hooks/client-app/src/hooks/about"

type AboutGalleryProps = {
  initialPage?: number
  initialLimit?: number
}

export function AboutGallery({ initialPage = 1, initialLimit = 12 }: AboutGalleryProps) {
  const { items, pagination, page, setPage, isLoading, error, refetch } = useAboutImages(
    initialPage,
    initialLimit,
  )

  if (isLoading) return <AboutSkeleton />

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
          Thử lại
        </Button>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Chưa có hình ảnh giới thiệu.
      </section>
    )
  }

  const isFirstPage = page <= 1
  const isLastPage = page >= pagination.totalPages

  return (
    <section className="space-y-5" aria-label="Hinh anh gioi thieu">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((image, index) => (
          <article
            key={`${image.url}-${index}`}
            className="group relative overflow-hidden rounded-lg border bg-card"
          >
            <div className="relative aspect-4/3 w-full">
              <Image
                src={image.url}
                alt={image.alt || "about-image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPage(page - 1)}
          disabled={isFirstPage}
        >
          Prev
        </Button>
        <p className="text-sm text-muted-foreground">
          Trang {pagination.page} / {pagination.totalPages}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={isLastPage}
        >
          Next
        </Button>
      </div>
    </section>
  )
}

