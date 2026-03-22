"use client"

import { useMemo, useState } from "react"

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2 } from "lucide-react"

import { Badge, Button, Input } from "@/components/atoms"
import { useTrendingProductsManager } from "@/hooks/admin-app/src/hooks/admin/useTrendingProductsManager"

function SortableTrendingItem({
  item,
  index,
  onRemove,
}: {
  item: {
    id: string
    name: string
    sku: string
    category: string
    price: string
    status: "Visible" | "Hidden"
  }
  index: number
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border bg-white p-3"
    >
      <button
        type="button"
        className="inline-flex cursor-grab items-center justify-center rounded-md border p-2 active:cursor-grabbing"
        aria-label={`Kéo thả thay đổi thứ tự ${item.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {index + 1}. {item.name}
        </p>
        <p className="text-xs text-slate-500">
          {item.sku} • {item.category} • {item.price}
        </p>
      </div>

      <Badge variant={item.status === "Visible" ? "default" : "outline"}>
        {item.status}
      </Badge>

      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => onRemove(item.id)}
        aria-label={`Bỏ ${item.name} khỏi thịnh hành`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function AdminTrendingProductsPage() {
  const {
    search,
    setSearch,
    trendingProducts,
    nonTrendingProducts,
    addTrending,
    removeTrending,
    reorderTrending,
  } = useTrendingProductsManager()

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const trendingIds = useMemo(
    () => trendingProducts.map((item) => item.id),
    [trendingProducts],
  )

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Trending Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Chọn sản phẩm từ danh sách sản phẩm và kéo thả để đổi thứ tự hiển thị.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Danh sách sản phẩm</h2>
            <Input
              placeholder="Tìm theo tên, SKU hoặc danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />

            <div className="space-y-2 rounded-xl border bg-slate-50 p-3">
              {nonTrendingProducts.length === 0 && (
                <p className="text-sm text-slate-500">Không còn sản phẩm để thêm.</p>
              )}

              {nonTrendingProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.sku} • {item.category} • {item.price}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => addTrending(item.id)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Chọn
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Sản phẩm thịnh hành (kéo thả để sắp xếp)
            </h2>

            <div className="space-y-2 rounded-xl border bg-slate-50 p-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={({ active }: { active: any }) => setActiveId(String(active.id))}
                onDragEnd={({ active, over }: { active: any, over: any }) => {
                  setActiveId(null)
                  if (!over || active.id === over.id) return

                  const oldIndex = trendingIds.indexOf(String(active.id))
                  const newIndex = trendingIds.indexOf(String(over.id))
                  if (oldIndex < 0 || newIndex < 0) return

                  reorderTrending(oldIndex, newIndex)
                }}
                onDragCancel={() => setActiveId(null)}
              >
                <SortableContext
                  items={trendingIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {trendingProducts.map((item, index) => (
                      <SortableTrendingItem
                        key={item.id}
                        item={item}
                        index={index}
                        onRemove={removeTrending}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {trendingProducts.length === 0 && (
                <p className="text-sm text-slate-500">Chưa có sản phẩm thịnh hành.</p>
              )}

              {activeId && (
                <p className="text-xs text-slate-500">
                  Đang kéo sản phẩm: {activeId}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
