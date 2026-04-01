"use client"

import * as React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button, Input } from "@/components/atoms"
import { useDebounce } from "@/hooks/client-app/src/hooks/ui/useDebounce"
import type { ProductOrder, ProductSortBy } from "@/api/product/product.types"
import {
  buildProductListHref,
  parseProductListSearchParams,
} from "@/lib/product-list/product-list-params"

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Mặc định" },
  { value: "price:asc", label: "Giá thấp → cao" },
  { value: "price:desc", label: "Giá cao → thấp" },
  { value: "createdAt:desc", label: "Mới nhất" },
  { value: "name:asc", label: "Tên A → Z" },
]

function parseSortValue(
  v: string,
): { sortBy?: ProductSortBy; order?: ProductOrder } {
  if (!v) return {}
  const [sortBy, order] = v.split(":") as [ProductSortBy, ProductOrder]
  if (!sortBy || !order) return {}
  return { sortBy, order }
}

export function ProductSearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchString = searchParams.toString()

  const params = React.useMemo(
    () => parseProductListSearchParams(new URLSearchParams(searchString)),
    [searchString],
  )

  const [qInput, setQInput] = React.useState(params.q ?? "")

  React.useEffect(() => {
    setQInput(params.q ?? "")
  }, [params.q])

  const debouncedQ = useDebounce(qInput, 400)

  React.useEffect(() => {
    const fromUrl = (
      new URLSearchParams(searchString).get("q") ?? ""
    ).trim()
    const next = debouncedQ.trim()
    if (next === fromUrl) return

    const base = parseProductListSearchParams(new URLSearchParams(searchString))
    router.replace(
      buildProductListHref(pathname, {
        ...base,
        q: next || undefined,
        page: 1,
      }),
    )
  }, [debouncedQ, pathname, router, searchString])

  const sortValue =
    params.sortBy && params.order
      ? `${params.sortBy}:${params.order}`
      : ""

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    const { sortBy, order } = parseSortValue(v)
    const base = parseProductListSearchParams(new URLSearchParams(searchString))
    router.replace(
      buildProductListHref(pathname, {
        ...base,
        sortBy,
        order,
        page: 1,
      }),
    )
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form
        className="flex min-w-0 flex-1 items-center gap-2 md:max-w-md"
        onSubmit={(e) => {
          e.preventDefault()
          const base = parseProductListSearchParams(
            new URLSearchParams(searchString),
          )
          router.replace(
            buildProductListHref(pathname, {
              ...base,
              q: qInput.trim() || undefined,
              page: 1,
            }),
          )
        }}
      >
        <Input
          id="q"
          name="q"
          placeholder="Tìm sản phẩm..."
          className="h-10 w-full min-w-0"
          aria-label="Tìm kiếm sản phẩm"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
        />
        <Button
          type="submit"
          className="h-10 shrink-0 bg-destructive text-white hover:bg-destructive/90"
        >
          Tìm
        </Button>
      </form>

      <div className="min-w-[180px] space-y-1 sm:shrink-0">
        <label htmlFor="sort" className="sr-only">
          Sắp xếp
        </label>
        <select
          id="sort"
          name="sort"
          className="h-10 w-full rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={sortValue}
          onChange={onSortChange}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value || "default"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
