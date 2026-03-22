"use client"

import * as React from "react"

export type AdminProductItem = {
  id: string
  name: string
  sku: string
  category: string
  price: string
  status: "Visible" | "Hidden"
}

const allProductsMock: AdminProductItem[] = [
  {
    id: "P001",
    name: "Loa JBL CV1652T",
    sku: "JBL-CV1652T",
    category: "Loa Karaoke",
    price: "23.100.000đ",
    status: "Visible",
  },
  {
    id: "P002",
    name: "Micro BIK BJ-U25",
    sku: "BIK-U25",
    category: "Micro",
    price: "3.290.000đ",
    status: "Visible",
  },
  {
    id: "P003",
    name: "Vang Số JBL KX190",
    sku: "JBL-KX190",
    category: "Vang Số",
    price: "9.900.000đ",
    status: "Visible",
  },
  {
    id: "P004",
    name: "Cục Đẩy Crown XLi 2500",
    sku: "CR-XLI2500",
    category: "Cục Đẩy",
    price: "12.500.000đ",
    status: "Hidden",
  },
  {
    id: "P005",
    name: "Loa BIK BJ-S888II",
    sku: "BIK-S888II",
    category: "Loa Karaoke",
    price: "8.290.000đ",
    status: "Visible",
  },
]

const initialTrendingIds = ["P001", "P003", "P005"]

export function useTrendingProductsManager() {
  const [search, setSearch] = React.useState("")
  const [trendingIds, setTrendingIds] = React.useState<string[]>(initialTrendingIds)

  const trendingProducts = React.useMemo(
    () =>
      trendingIds
        .map((id) => allProductsMock.find((p) => p.id === id))
        .filter((p): p is AdminProductItem => Boolean(p)),
    [trendingIds],
  )

  const nonTrendingProducts = React.useMemo(() => {
    const q = search.trim().toLowerCase()

    return allProductsMock.filter((p) => {
      const notSelected = !trendingIds.includes(p.id)
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)

      return notSelected && matchSearch
    })
  }, [search, trendingIds])

  const addTrending = (id: string) => {
    setTrendingIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const removeTrending = (id: string) => {
    setTrendingIds((prev) => prev.filter((item) => item !== id))
  }

  const reorderTrending = (fromIndex: number, toIndex: number) => {
    setTrendingIds((prev) => {
      if (fromIndex === toIndex) return prev
      if (fromIndex < 0 || toIndex < 0) return prev
      if (fromIndex >= prev.length || toIndex >= prev.length) return prev

      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  return {
    search,
    setSearch,
    trendingProducts,
    nonTrendingProducts,
    addTrending,
    removeTrending,
    reorderTrending,
  }
}
