"use client"

import * as React from "react"

import { SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { GetProductsParams } from "@/api/product/product.types"
import { Button, Input, Label } from "@/components/atoms"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCategories } from "@/hooks/client-app/src/hooks/category/useCategories"
import {
  buildProductListHref,
  normalizeMinMaxPrice,
  parseProductListSearchParams,
} from "@/lib/product-list/product-list-params"

type FilterFormState = {
  categoryId: string
  status: string
  minPrice: string
  maxPrice: string
}

function stateFromUrl(searchParams: URLSearchParams): FilterFormState {
  const p = parseProductListSearchParams(searchParams)
  return {
    categoryId: p.categoryId ?? "",
    status: p.status !== undefined ? String(p.status) : "",
    minPrice: p.minPrice !== undefined ? String(Math.round(p.minPrice)) : "",
    maxPrice: p.maxPrice !== undefined ? String(Math.round(p.maxPrice)) : "",
  }
}

function parseOptionalNumber(raw: string): number | undefined {
  const t = raw.trim()
  if (!t) return undefined
  const n = Number(t)
  return Number.isFinite(n) ? n : undefined
}

function FilterFields({
  state,
  setState,
  categories,
}: {
  state: FilterFormState
  setState: React.Dispatch<React.SetStateAction<FilterFormState>>
  categories: { _id: string; name: string }[]
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Danh mục</Label>
        <select
          id="categoryId"
          name="categoryId"
          className="w-full rounded-md border bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={state.categoryId}
          onChange={(e) =>
            setState((s) => ({ ...s, categoryId: e.target.value }))
          }
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <select
          id="status"
          name="status"
          className="w-full rounded-md border bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={state.status}
          onChange={(e) =>
            setState((s) => ({ ...s, status: e.target.value }))
          }
        >
          <option value="">Tất cả</option>
          <option value="1">Đang bán</option>
          <option value="0">Ngừng bán</option>
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Khoảng giá (VND)</legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="minPrice" className="text-xs">
              Từ
            </Label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              min={0}
              placeholder="0"
              inputMode="numeric"
              className="h-9"
              value={state.minPrice}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  minPrice: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxPrice" className="text-xs">
              Đến
            </Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min={0}
              placeholder="Không giới hạn"
              inputMode="numeric"
              className="h-9"
              value={state.maxPrice}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  maxPrice: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </fieldset>
    </div>
  )
}

export function ProductFiltersSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [state, setState] = React.useState<FilterFormState>(() =>
    stateFromUrl(new URLSearchParams(searchParams.toString())),
  )

  const { data: catData } = useCategories({ page: 1, limit: 200 })
  const categories =
    catData?.items?.filter((c) => !c.isDelete) ?? []

  React.useEffect(() => {
    setState(stateFromUrl(new URLSearchParams(searchParams.toString())))
  }, [searchParams])

  const apply = () => {
    const base = parseProductListSearchParams(
      new URLSearchParams(searchParams.toString()),
    )
    let minP = parseOptionalNumber(state.minPrice)
    let maxP = parseOptionalNumber(state.maxPrice)
    const fixed = normalizeMinMaxPrice(minP, maxP)
    minP = fixed.minPrice
    maxP = fixed.maxPrice

    const statusParsed =
      state.status === ""
        ? undefined
        : Number.parseInt(state.status, 10)
    const status =
      statusParsed !== undefined && !Number.isNaN(statusParsed)
        ? statusParsed
        : undefined

    const next: GetProductsParams = {
      ...base,
      categoryId: state.categoryId.trim() || undefined,
      status,
      minPrice: minP,
      maxPrice: maxP,
      page: 1,
    }

    router.push(buildProductListHref(pathname, next))
  }

  const clear = () => {
    const base = parseProductListSearchParams(
      new URLSearchParams(searchParams.toString()),
    )
    router.push(
      buildProductListHref(pathname, {
        q: base.q,
        sortBy: base.sortBy,
        order: base.order,
        page: 1,
        limit: base.limit,
      }),
    )
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <FilterFields
        state={state}
        setState={setState}
        categories={categories}
      />

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          onClick={apply}
          className="flex-1 bg-destructive text-white hover:bg-destructive/90"
        >
          Áp dụng
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={clear}>
          Xoá lọc
        </Button>
      </div>
    </div>
  )
}

export function ProductFiltersDrawer() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState<FilterFormState>(() =>
    stateFromUrl(new URLSearchParams(searchParams.toString())),
  )

  const { data: catData } = useCategories({ page: 1, limit: 200 })
  const categories =
    catData?.items?.filter((c) => !c.isDelete) ?? []

  React.useEffect(() => {
    setState(stateFromUrl(new URLSearchParams(searchParams.toString())))
  }, [searchParams])

  const apply = () => {
    const base = parseProductListSearchParams(
      new URLSearchParams(searchParams.toString()),
    )
    let minP = parseOptionalNumber(state.minPrice)
    let maxP = parseOptionalNumber(state.maxPrice)
    const fixed = normalizeMinMaxPrice(minP, maxP)
    minP = fixed.minPrice
    maxP = fixed.maxPrice

    const statusParsed =
      state.status === ""
        ? undefined
        : Number.parseInt(state.status, 10)
    const status =
      statusParsed !== undefined && !Number.isNaN(statusParsed)
        ? statusParsed
        : undefined

    const next: GetProductsParams = {
      ...base,
      categoryId: state.categoryId.trim() || undefined,
      status,
      minPrice: minP,
      maxPrice: maxP,
      page: 1,
    }

    router.push(buildProductListHref(pathname, next))
    setOpen(false)
  }

  const clear = () => {
    const base = parseProductListSearchParams(
      new URLSearchParams(searchParams.toString()),
    )
    router.push(
      buildProductListHref(pathname, {
        q: base.q,
        sortBy: base.sortBy,
        order: base.order,
        page: 1,
        limit: base.limit,
      }),
    )
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2"
          aria-label="Mở bộ lọc"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[92vw] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
          <SheetDescription>
            Chọn danh mục, trạng thái và khoảng giá, sau đó nhấn Áp dụng.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <FilterFields
            state={state}
            setState={setState}
            categories={categories}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              onClick={apply}
              className="flex-1 bg-destructive text-white hover:bg-destructive/90"
            >
              Áp dụng
            </Button>
            <Button type="button" variant="outline" onClick={clear}>
              Xoá lọc
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
