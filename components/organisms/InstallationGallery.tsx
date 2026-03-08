"use client"

import Image from "next/image"
import ReactPaginate from "react-paginate"

import { usePagination } from "@/hooks/client-app/src/hooks/ui"

type InstallationGalleryProps = {
  images: string[]
  itemsPerPage?: number
}

export function InstallationGallery({
  images,
  itemsPerPage = 12,
}: InstallationGalleryProps) {
  const { currentItems, pageCount, handlePageChange } = usePagination({
    items: images,
    itemsPerPage,
  })

  return (
    <section className="space-y-5" aria-label="Hình ảnh công trình đã lắp đặt">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {currentItems.map((src, index) => (
          <article
            key={`${src}-${index}`}
            className="group relative overflow-hidden rounded-lg border bg-card"
          >
            <div className="relative aspect-4/3 w-full">
              <Image
                src={src}
                alt={`Công trình karaoke ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </article>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center pt-1">
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={(selectedItem) => handlePageChange(selectedItem.selected)}
            containerClassName="inline-flex items-center gap-1 text-sm"
            pageClassName="overflow-hidden rounded-md border"
            previousClassName="overflow-hidden rounded-md border"
            nextClassName="overflow-hidden rounded-md border"
            breakClassName="px-2 py-1"
            pageLinkClassName="block cursor-pointer px-3 py-1.5 hover:bg-accent"
            previousLinkClassName="block cursor-pointer px-3 py-1.5 hover:bg-accent"
            nextLinkClassName="block cursor-pointer px-3 py-1.5 hover:bg-accent"
            activeLinkClassName="bg-destructive text-white"
            disabledClassName="opacity-40 cursor-default"
            previousLabel="«"
            nextLabel="»"
          />
        </div>
      )}
    </section>
  )
}
