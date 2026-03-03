"use client"

import * as React from "react"

import { SlidersHorizontal } from "lucide-react"
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

import { Button, Input, Label } from "@/components/atoms"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type FilterState = {
  category: string
  priceMin: string
  priceMax: string
  sort: string
}

function getInitialState(searchParams: URLSearchParams): FilterState {
  return {
    category: searchParams.get("category") ?? "",
    priceMin: searchParams.get("priceMin") ?? "",
    priceMax: searchParams.get("priceMax") ?? "",
    sort: searchParams.get("sort") ?? "",
  }
}

function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string | undefined
) {
  const v = (value ?? "").trim()
  if (!v) params.delete(key)
  else params.set(key, v)
}

function buildNextUrl(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  next: FilterState
) {
  const params = new URLSearchParams(searchParams.toString())
  setOrDelete(params, "category", next.category)
  setOrDelete(params, "priceMin", next.priceMin)
  setOrDelete(params, "priceMax", next.priceMax)
  setOrDelete(params, "sort", next.sort)
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

function FilterFields({
  state,
  setState,
}: {
  state: FilterState
  setState: React.Dispatch<React.SetStateAction<FilterState>>
}) {
  return (
    <div className="space-y-4">


      <div className="space-y-2">
        <Label htmlFor="category">Loại sản phẩm</Label>
        <select
          id="category"
          name="category"
          className="w-full rounded-md border bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={state.category}
          onChange={(e) =>
            setState((s) => ({
              ...s,
              category: e.target.value,
            }))
          }
        >
          <option value="">Tất cả loại</option>
          <option value="karaoke">Loa karaoke</option>
          <option value="hall">Dàn hội trường / sân khấu</option>
          <option value="combo">Combo dàn karaoke</option>
          <option value="micro">Micro</option>
          <option value="processor">Vang số / DSP</option>
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Khoảng giá (VND)</legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="priceMin" className="text-xs">
              Từ
            </Label>
            <Input
              id="priceMin"
              name="priceMin"
              type="number"
              placeholder="1.000.000"
              inputMode="numeric"
              className="h-9"
              value={state.priceMin}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  priceMin: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="priceMax" className="text-xs">
              Đến
            </Label>
            <Input
              id="priceMax"
              name="priceMax"
              type="number"
              placeholder="50.000.000"
              inputMode="numeric"
              className="h-9"
              value={state.priceMax}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  priceMax: e.target.value,
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
  const [state, setState] = React.useState<FilterState>(() =>
    getInitialState(new URLSearchParams(searchParams.toString()))
  )

  React.useEffect(() => {
    setState(getInitialState(new URLSearchParams(searchParams.toString())))
  }, [searchParams])

  const apply = () => {
    router.push(buildNextUrl(pathname, searchParams, state))
  }

  const clear = () => {
    router.push(pathname)
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <FilterFields state={state} setState={setState} />

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          onClick={apply}
          className="flex-1 bg-destructive text-white hover:bg-destructive/90"
        >
          Áp dụng
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={clear}>
          Xoá
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
  const [state, setState] = React.useState<FilterState>(() =>
    getInitialState(new URLSearchParams(searchParams.toString()))
  )

  React.useEffect(() => {
    setState(getInitialState(new URLSearchParams(searchParams.toString())))
  }, [searchParams])

  const apply = () => {
    router.push(buildNextUrl(pathname, searchParams, state))
    setOpen(false)
  }

  const clear = () => {
    router.push(pathname)
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
          <SheetTitle>Bộ sản phẩm</SheetTitle>
          <SheetDescription>
            Lọc sản phẩm ở đây
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <FilterFields state={state} setState={setState} />
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              onClick={apply}
              className="flex-1 bg-destructive text-white hover:bg-destructive/90"
            >
              Áp dụng
            </Button>
            <Button type="button" variant="outline" onClick={clear}>
              Xoá
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

