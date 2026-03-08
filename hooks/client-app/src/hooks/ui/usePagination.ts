"use client"

import * as React from "react"

interface UsePaginationParams<T> {
  items: T[]
  itemsPerPage: number
}

export function usePagination<T>({ items, itemsPerPage }: UsePaginationParams<T>) {
  const [currentPage, setCurrentPage] = React.useState(0)

  const pageCount = React.useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage],
  )

  const currentItems = React.useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, items, itemsPerPage])

  const handlePageChange = React.useCallback((selected: number) => {
    setCurrentPage(selected)
    if (typeof window !== "undefined") {
      window.scrollBy({ top: -180, behavior: "smooth" })
    }
  }, [])

  return {
    currentPage,
    pageCount,
    currentItems,
    handlePageChange,
  }
}
