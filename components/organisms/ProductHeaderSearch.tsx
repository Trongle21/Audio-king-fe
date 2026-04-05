"use client"

import * as React from "react"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import type { Product } from "@/api/product/product.types"

import { getProducts } from "@/api/product"
import { Input } from "@/components/atoms"
import { useDebounce } from "@/hooks/client-app/src/hooks/ui/useDebounce"
import { mapProductToHomeProduct } from "@/lib/product-list/map-product-to-card"
import { buildProductListHref } from "@/lib/product-list/product-list-params"
import { cn } from "@/lib/utils"

type AutocompleteItem = {
  id: string
  name: string
  imageUrl: string
  price: string
}

export type ProductHeaderSearchProps = {
  placeholder?: string
  className?: string
  inputClassName?: string
  searchButtonClassName?: string
  limit?: number
  debounceMs?: number
  minQueryLength?: number
}

export function ProductHeaderSearch({
  placeholder = "Bạn tìm thiết bị âm thanh gì?",
  className,
  inputClassName,
  searchButtonClassName,
  limit = 6,
  debounceMs = 400,
  minQueryLength = 1,
}: ProductHeaderSearchProps) {
  const router = useRouter()

  const [value, setValue] = React.useState("")
  const trimmed = value.trim()
  const debouncedQ = useDebounce(value, debounceMs).trim()

  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  const { data, isFetching } = useQuery({
    queryKey: ["product-autocomplete", debouncedQ],
    enabled: debouncedQ.length >= minQueryLength,
    staleTime: 30_000,
    queryFn: async (): Promise<Product[]> => {
      const res = await getProducts({
        q: debouncedQ,
        page: 1,
        limit,
      })
      return res.data.items
    },
  })

  const suggestions = React.useMemo(() => {
    const items = data ?? []
    return items
      .slice(0, limit)
      .map((p) => {
        const mapped = mapProductToHomeProduct(p)
        return {
          id: mapped.id,
          name: mapped.name,
          imageUrl: mapped.imageUrl,
          price: mapped.price,
        }
      }) as AutocompleteItem[]
  }, [data, limit])

  const close = React.useCallback(() => setOpen(false), [])

  React.useEffect(() => {
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = rootRef.current
      if (!el) return
      if (!e.target) return
      if (!el.contains(e.target as Node)) close()
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
    }
  }, [close])

  const submit = React.useCallback(() => {
    const q = trimmed
    if (!q) return
    router.push(buildProductListHref("/product", { q, page: 1 }))
    close()
  }, [close, router, trimmed])

  const onItemClick = React.useCallback(() => close(), [close])

  const showDropdown = open && debouncedQ.length >= minQueryLength

  return (
    <div ref={rootRef} className={className}>
      <div className="relative flex w-full items-center gap-2">
        <Input
          type="search"
          value={value}
          onChange={(e) => {
            const next = e.target.value
            setValue(next)
            setOpen(next.trim().length >= minQueryLength)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
            if (e.key === "Escape") close()
          }}
          placeholder={placeholder}
          aria-label="Tìm kiếm sản phẩm"
          className={cn("flex-1 min-w-0", inputClassName)}
        />

        {showDropdown && (
          <div
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-black/10 bg-white shadow-lg"
            role="listbox"
            aria-label="Kết quả gợi ý"
          >
            <div className="max-h-80 overflow-y-auto">
              {isFetching && suggestions.length === 0 ? (
                <div className="px-3 py-3 text-sm text-muted-foreground">
                  Đang tìm...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-3 py-3 text-sm text-muted-foreground">
                  Không tìm thấy sản phẩm.
                </div>
              ) : (
                <ul className="divide-y divide-black/5">
                  {suggestions.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/product/${item.id}`}
                        onClick={onItemClick}
                        className="group flex items-center gap-3 px-3 py-2 hover:bg-muted/70"
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-black/5 bg-muted/40">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 block text-sm text-black font-medium group-hover:underline">
                            {item.name}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-black">
                            {item.price}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

