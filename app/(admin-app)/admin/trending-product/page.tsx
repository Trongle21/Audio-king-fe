"use client"

import { useMemo, useState } from "react"

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getProducts, type GetProductsParams, type Product } from "@/api/product"
import {
  getTrending,
  updateTrending,
  type TrendingItem,
} from "@/api/trending"
import { Badge, Button, Input } from "@/components/atoms"
import {
  productFilterSchema,
  type ProductFilterFormData,
  type ProductFilterSchemaInput,
} from "@/lib/schemas/product-filter.schema"

type SelectedTrendingItem = {
  productId: string
  product: Product
}

const PRODUCTS_LIMIT = 10

const defaultFilterValues: ProductFilterFormData = {
  q: "",
  status: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "createdAt",
  order: "desc",
}

function mapStatus(status?: number): "Visible" | "Hidden" {
  return status === 1 ? "Visible" : "Hidden"
}

function formatCurrency(price: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`
}

function toCategoryText(product: Product): string {
  if (!Array.isArray(product.categories) || product.categories.length === 0) return "N/A"
  const first = product.categories[0]
  if (typeof first === "string") return first
  return first.name
}

function toProductThumbnailSrc(product: Product): string | null {
  const thumb = product.thumbnail
  if (typeof thumb === "string" && thumb.trim()) return thumb
  if (thumb && typeof thumb === "object" && thumb.url?.trim()) return thumb.url

  const fallback = product.images?.[0]?.url
  return fallback?.trim() ? fallback : null
}

function toRequestParams(values: ProductFilterFormData, page: number): GetProductsParams {
  const minPrice = values.minPrice?.trim() ? Number(values.minPrice) : undefined
  const maxPrice = values.maxPrice?.trim() ? Number(values.maxPrice) : undefined

  return {
    q: values.q?.trim() || undefined,
    status: values.status ? Number(values.status) : undefined,
    categoryId: values.categoryId?.trim() || undefined,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    sortBy: values.sortBy,
    order: values.order,
    page,
    limit: PRODUCTS_LIMIT,
  }
}

function normalizeTrending(items: TrendingItem[]): SelectedTrendingItem[] {
  return [...items]
    .sort((a, b) => a.priority - b.priority)
    .map((item) => ({ productId: item.productId, product: item.product }))
}

function isSameTrending(
  a: SelectedTrendingItem[],
  b: SelectedTrendingItem[],
): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => item.productId === b[index]?.productId)
}

function SortableTrendingItem({
  item,
  index,
  onRemove
}: {
  item: SelectedTrendingItem
  index: number
  onRemove: (productId: string) => void
}) {
  const product = item.product
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.productId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const thumbnailSrc = toProductThumbnailSrc(product)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border bg-white p-3"
    >
      <button
        type="button"
        className="inline-flex cursor-grab items-center justify-center rounded-md border p-2 active:cursor-grabbing"
        aria-label={`Kéo thả thay đổi thứ tự ${product.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {thumbnailSrc ? (
        <Image
          src={thumbnailSrc}
          alt={product.name}
          width={48}
          height={48}
          unoptimized
          className="h-12 w-12 rounded-md border object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-slate-100 text-[10px] text-slate-400">
          No image
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {index}. {product.name}
        </p>
        <p className="text-xs text-slate-500">
          {product.sku} • {toCategoryText(product)} • {formatCurrency(product.price)}
        </p>
      </div>

      <Badge variant={mapStatus(product.status) === "Visible" ? "default" : "outline"}>
        {mapStatus(product.status)}
      </Badge>

      <Button
        variant="destructive"
        size="icon-sm"
        onClick={() => onRemove(item.productId)}
        aria-label={`Bỏ ${product.name} khỏi thịnh hành`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function AdminTrendingProductsPage() {
  const [page, setPage] = useState(1)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [localTrending, setLocalTrending] = useState<SelectedTrendingItem[] | null>(null)
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilterFormData>(defaultFilterValues)

  const form = useForm<ProductFilterSchemaInput, unknown, ProductFilterFormData>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: defaultFilterValues,
  })
  const requestParams = useMemo(
    () => toRequestParams(appliedFilters, page),
    [appliedFilters, page],
  )

  const {
    data: productsRes,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["admin-trending-products", requestParams],
    queryFn: () => getProducts(requestParams),
  })

  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ["admin-trending-list"],
    queryFn: getTrending,
  })

  const serverTrending = useMemo(
    () => normalizeTrending(trendingData ?? []),
    [trendingData],
  )
  const selectedTrending = localTrending ?? serverTrending

  const saveMutation = useMutation({
    mutationFn: () =>
      updateTrending({
        items: selectedTrending.map((item, index) => ({
          productId: item.productId,
          priority: index,
        })),
      }),
    onSuccess: async () => {
      await refetchTrending()
      setLocalTrending(null)
      toast.success("Cap nhat trending thanh cong.")
    },
    onError: (error) => {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "Cap nhat trending that bai."
      toast.error(message)
    },
  })

  const selectedIds = useMemo(
    () => new Set(selectedTrending.map((item) => item.productId)),
    [selectedTrending],
  )

  const sourceProducts = useMemo(
    () =>
      (productsRes?.data.items ?? []).filter((product) => !selectedIds.has(product._id)),
    [productsRes?.data.items, selectedIds],
  )

  const isDirty = useMemo(
    () => !isSameTrending(selectedTrending, serverTrending),
    [selectedTrending, serverTrending],
  )

  const addTrending = (product: Product) => {
    if (selectedIds.has(product._id)) {
      toast.info("San pham da co trong trending.")
      return
    }
    setLocalTrending((prev) => [...(prev ?? serverTrending), { productId: product._id, product }])
  }

  const removeTrending = (productId: string) => {
    setLocalTrending((prev) =>
      (prev ?? serverTrending).filter((item) => item.productId !== productId),
    )
  }

  const reorderTrending = (fromIndex: number, toIndex: number) => {
    setLocalTrending((prev) => arrayMove(prev ?? serverTrending, fromIndex, toIndex))
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIndex = selectedTrending.findIndex((item) => item.productId === String(active.id))
    const newIndex = selectedTrending.findIndex((item) => item.productId === String(over.id))
    if (oldIndex < 0 || newIndex < 0) return
    reorderTrending(oldIndex, newIndex)
  }

  const submitFilters = form.handleSubmit((values) => {
    setAppliedFilters(values)
    setPage(1)
  })

  const resetFilters = () => {
    form.reset(defaultFilterValues)
    setAppliedFilters(defaultFilterValues)
    setPage(1)
  }

  const pagination = productsRes?.data.pagination

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const trendingIds = useMemo(
    () => selectedTrending.map((item) => item.productId),
    [selectedTrending],
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
            <form onSubmit={submitFilters} className="grid gap-2 md:grid-cols-2">
              <Input placeholder="Search name" {...form.register("q")} />
              <Input placeholder="Category ID" {...form.register("categoryId")} />
              <Input placeholder="Min price" {...form.register("minPrice")} />
              <Input placeholder="Max price" {...form.register("maxPrice")} />
              <select
                className="h-9 rounded-md border bg-background px-3 text-sm"
                {...form.register("status")}
              >
                <option value="">All status</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                  {...form.register("sortBy")}
                >
                  <option value="createdAt">createdAt</option>
                  <option value="name">name</option>
                  <option value="price">price</option>
                </select>
                <select
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                  {...form.register("order")}
                >
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Apply</Button>
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </form>

            <div className="space-y-2 rounded-xl border bg-slate-50 p-3">
              {(productsLoading || trendingLoading) && (
                <p className="text-sm text-slate-500">Dang tai du lieu...</p>
              )}
              {productsError && (
                <p className="text-sm text-destructive">
                  {productsError instanceof Error
                    ? productsError.message
                    : "Khong tai duoc danh sach san pham."}
                </p>
              )}

              {!productsLoading && sourceProducts.length === 0 && (
                <p className="text-sm text-slate-500">Không còn sản phẩm để thêm.</p>
              )}

              {sourceProducts.map((item) => {
                const thumbnailSrc = toProductThumbnailSrc(item)

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-lg border bg-white p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {thumbnailSrc ? (
                        <Image
                          src={thumbnailSrc}
                          alt={item.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-12 w-12 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-slate-100 text-[10px] text-slate-400">
                          No image
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.sku} • {toCategoryText(item)} • {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => addTrending(item)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )
              })}

              {pagination && (
                <div className="flex items-center justify-between border-t pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={pagination.page <= 1}
                  >
                    Prev
                  </Button>
                  <p className="text-xs text-slate-500">
                    Trang {pagination.page} / {pagination.totalPages}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Sản phẩm thịnh hành (kéo thả để sắp xếp)
            </h2>

            <div className="space-y-2 rounded-xl border bg-slate-50 p-3">
              {trendingError && (
                <p className="text-sm text-destructive">
                  {trendingError instanceof Error
                    ? trendingError.message
                    : "Khong tai duoc danh sach trending."}
                </p>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={({ active }) => setActiveId(String(active.id))}
                onDragEnd={onDragEnd}
                onDragCancel={() => setActiveId(null)}
              >
                <SortableContext
                  items={trendingIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {selectedTrending.map((item, index) => (
                      <SortableTrendingItem
                        key={item.productId}
                        item={item}
                        index={index + 1}
                        onRemove={removeTrending}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {selectedTrending.length === 0 && (
                <p className="text-sm text-slate-500">Chưa có sản phẩm thịnh hành.</p>
              )}

              {activeId && (
                <p className="text-xs text-slate-500">
                  Đang kéo sản phẩm: {activeId}
                </p>
              )}

              <div className="flex gap-2 border-t pt-3">
                <Button
                  type="button"
                  className="bg-destructive text-white hover:bg-destructive/90"
                  disabled={!isDirty || selectedTrending.length === 0 || saveMutation.isPending}
                  onClick={() => saveMutation.mutate()}
                >
                  {saveMutation.isPending ? "Dang luu..." : "Save Trending"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isDirty}
                  onClick={() => setLocalTrending(null)}
                >
                  Discard changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void refetchTrending()
                    void refetchProducts()
                  }}
                >
                  Reload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
