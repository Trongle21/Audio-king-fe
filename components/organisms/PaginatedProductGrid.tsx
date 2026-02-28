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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            activeClassName="bg-destructive text-white"
            pageClassName="border rounded-md px-2 py-1 hover:bg-accent cursor-pointer"
            previousClassName="border rounded-md px-2 py-1 hover:bg-accent cursor-pointer"
            nextClassName="border rounded-md px-2 py-1 hover:bg-accent cursor-pointer"
            disabledClassName="opacity-40 cursor-default"
            breakClassName="px-2 py-1"
            previousLabel="«"
            nextLabel="»"
          />
        </div>
      )}
    </div>
  )
}
