"use client"

import { useMemo } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/atoms"
import { ProductCard } from "@/components/organisms/ProductCard"
import {
  ProductFiltersDrawer,
  ProductFiltersSidebar,
} from "@/components/organisms/ProductFilters"
import { ProductSearchBar } from "@/components/organisms/ProductSearchBar"
import {
  PRODUCT_QUERY_FALLBACK_MESSAGE,
  useProducts,
} from "@/hooks/client-app/src/hooks/product/useProducts"
import { mapProductToHomeProduct } from "@/lib/product-list/map-product-to-card"
import type { ProductListPagination } from "@/api/product/product.types"
import {
  buildProductListHref,
  parseProductListSearchParams,
} from "@/lib/product-list/product-list-params"

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }
  return PRODUCT_QUERY_FALLBACK_MESSAGE
}

function ProductListPagination({
  pagination,
  pathname,
  searchString,
}: {
  pagination: ProductListPagination | undefined
  pathname: string
  searchString: string
}) {
  if (!pagination || pagination.totalPages <= 1) return null

  const { page, totalPages } = pagination
  const base = parseProductListSearchParams(new URLSearchParams(searchString))

  const hrefForPage = (p: number) => {
    const next = { ...base, page: p }
    return buildProductListHref(pathname, next)
  }

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Phân trang danh sách sản phẩm"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        asChild={page > 1}
      >
        {page > 1 ? (
          <Link href={hrefForPage(page - 1)} prefetch={false}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Trước
          </Link>
        ) : (
          <span className="inline-flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Trước
          </span>
        )}
      </Button>

      <span className="text-sm text-muted-foreground">
        Trang {page} / {totalPages}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        asChild={page < totalPages}
      >
        {page < totalPages ? (
          <Link href={hrefForPage(page + 1)} prefetch={false}>
            Sau
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center">
            Sau
            <ChevronRight className="ml-1 h-4 w-4" />
          </span>
        )}
      </Button>
    </nav>
  )
}

export function ProductListingClient() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchString = searchParams.toString()

  const listParams = useMemo(
    () => parseProductListSearchParams(new URLSearchParams(searchString)),
    [searchString],
  )

  const { data, isLoading, isError, error, isFetching } = useProducts(listParams)

  const items = data?.items ?? []
  const mapped = useMemo(
    () => items.map((p) => mapProductToHomeProduct(p)),
    [items],
  )

  return (
    <div className="space-y-4 flex-1">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ProductSearchBar />
        <div className="flex justify-end lg:hidden">
          <ProductFiltersDrawer />
        </div>
      </div>

      {isError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {getErrorMessage(error)}
        </p>
      )}

      {(isLoading || isFetching) && !data && (
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-lg border bg-muted/40"
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && mapped.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Không tìm thấy sản phẩm phù hợp. Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
        </p>
      )}

      {mapped.length > 0 && (
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
          {mapped.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <ProductListPagination
        pagination={data?.pagination}
        pathname={pathname}
        searchString={searchString}
      />
    </div>
  )
}
