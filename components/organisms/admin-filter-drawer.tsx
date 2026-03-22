"use client"

import { Button, Input, Label } from "@/components/atoms"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type AdminFilterDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  status: "all" | "Visible" | "Hidden"
  onChangeSearch: (value: string) => void
  onChangeStatus: (value: "all" | "Visible" | "Hidden") => void
  onApply: () => void
  onReset: () => void
}

export function AdminFilterDrawer({
  open,
  onOpenChange,
  search,
  status,
  onChangeSearch,
  onChangeStatus,
  onApply,
  onReset,
}: AdminFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Bộ lọc danh mục</SheetTitle>
          <SheetDescription>
            Lọc dữ liệu theo trạng thái và từ khoá để quản trị nhanh hơn.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="filterSearch">Tìm kiếm</Label>
            <Input
              id="filterSearch"
              placeholder="Tên hoặc slug..."
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="filterStatus">Trạng thái</Label>
            <select
              id="filterStatus"
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
              value={status}
              onChange={(e) =>
                onChangeStatus(e.target.value as "all" | "Visible" | "Hidden")
              }
            >
              <option value="all">Tất cả</option>
              <option value="Visible">Visible</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button className="bg-destructive text-white hover:bg-destructive/90" onClick={onApply}>
            Áp dụng
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
