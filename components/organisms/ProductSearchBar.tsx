"use client"

import * as React from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button, Input } from "@/components/atoms"

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  const v = value.trim()
  if (!v) params.delete(key)
  else params.set(key, v)
}

export function ProductSearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = React.useState(searchParams.get("q") ?? "")

  React.useEffect(() => {
    setQ(searchParams.get("q") ?? "")
  }, [searchParams])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    setOrDelete(params, "q", q)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full justify-between">
      <div className="flex items-center gap-2 min-w-0 max-w-md  md:min-w-120">
        <Input
          id="q"
          name="q"
          placeholder="Tìm sản phẩm..."
          className="h-10 w-full"
          aria-label="Tìm kiếm sản phẩm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button
          type="submit"
          className="h-10 bg-destructive text-white hover:bg-destructive/90"
        >
          Tìm
        </Button>

      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-[160px] space-y-1">
          <select
            id="sort"
            name="sort"
            className="w-full rounded-md border bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          // value={state.sort}
          // onChange={(e) =>
          //   setState((s) => ({
          //     ...s,
          //     sort: e.target.value,
          //   }))
          // }
          >
            <option value="">Mặc định</option>
            <option value="price_desc">Giá cao → thấp</option>
            <option value="price_asc">Giá thấp → cao</option>
          </select>
        </div>
      </div>

    </form>
  )
}

