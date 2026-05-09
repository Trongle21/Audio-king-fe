"use client"

import * as React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { buildProductListHref } from "@/lib/product-list/product-list-params"

interface SearchContextValue {
  searchValue: string
  setSearchValue: (value: string) => void
  submitSearch: () => void
  clearSearch: () => void
}

const SearchContext = React.createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValueState] = React.useState("")

  const isOnProductPage = pathname === "/product"

  const setSearchValue = React.useCallback((value: string) => {
    setSearchValueState(value)
  }, [])

  const clearSearch = React.useCallback(() => {
    setSearchValueState("")
    if (isOnProductPage) {
      const currentParams = Object.fromEntries(searchParams.entries())
      const { q: _q, ...restParams } = currentParams
      const newUrl = buildProductListHref(pathname, { ...restParams, page: 1 })
      router.push(newUrl)
    }
  }, [isOnProductPage, pathname, router, searchParams])

  const submitSearch = React.useCallback(() => {
    const q = searchValue.trim()
    const targetPath = isOnProductPage ? pathname : "/product"
    const params: Record<string, unknown> = { q: q || undefined, page: 1 }
    
    if (isOnProductPage) {
      const currentParams = Object.fromEntries(searchParams.entries())
      const { q: _q, ...restParams } = currentParams
      router.push(buildProductListHref(targetPath, { ...restParams, ...params }))
    } else {
      router.push(buildProductListHref(targetPath, params))
    }
  }, [searchValue, isOnProductPage, pathname, router, searchParams])

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue, submitSearch, clearSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = React.useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider")
  }
  return context
}
