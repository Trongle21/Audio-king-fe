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
    <form onSubmit={onSubmit} className="flex w-full gap-2 sm:max-w-md">
      <Input
        id="q"
        name="q"
        placeholder="Tìm sản phẩm..."
        className="h-10"
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
    </form>
  )
}

