"use client"

import * as React from "react"

import ReactPaginate from "react-paginate"

import {
  HomeProductCard,
  type HomeProduct,
} from "@/components/organisms/HomeProductCard"

interface PaginatedProductGridProps {
  products: HomeProduct[]
  itemsPerPage?: number
}

export function PaginatedProductGrid({
  products,
  itemsPerPage = 8,
}: PaginatedProductGridProps) {
  const [currentPage, setCurrentPage] = React.useState(0)

  const pageCount = Math.ceil(products.length / itemsPerPage)

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
    // Scroll nhẹ lên đầu grid khi đổi trang
    if (typeof window !== "undefined") {
      window.scrollBy({ top: -200, behavior: "smooth" })
    }
  }

  const startIndex = currentPage * itemsPerPage
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="grid items-stretch gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {currentItems.map((product) => (
          <HomeProductCard key={product.id} product={product} />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center pt-2">
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName="inline-flex items-center gap-1 text-sm"
            pageClassName="border rounded-md cursor-pointer overflow-hidden"
            previousClassName="border rounded-md cursor-pointer overflow-hidden"
            nextClassName="border rounded-md cursor-pointer overflow-hidden"
            breakClassName="px-2 py-1"
            pageLinkClassName="block px-2 py-1 hover:bg-accent"
            previousLinkClassName="block px-2 py-1 hover:bg-accent"
            nextLinkClassName="block px-2 py-1 hover:bg-accent"
            activeLinkClassName="bg-destructive text-white"
            disabledClassName="opacity-40 cursor-default"
            previousLabel="«"
            nextLabel="»"
          />
        </div>
      )}
    </div>
  )
}
