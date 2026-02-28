"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export function useSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return

      setQuery(searchQuery)
      // Navigate to search page with query
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    },
    [router]
  )

  return {
    query,
    setQuery,
    handleSearch,
  }
}
