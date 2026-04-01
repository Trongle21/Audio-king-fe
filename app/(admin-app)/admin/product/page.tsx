"use client"

import { useMemo, useState } from "react"

import { type ColumnDef } from "@tanstack/react-table"
import { Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import type { Product, ProductOrder, ProductSortBy } from "@/api/product"

import { Button, Input, Label } from "@/components/atoms"
import {
  AdminEntityTable,
  AdminFilterDrawer,
  DeleteProductModal
} from "@/components/organisms"
import {
  useProducts,
  useSoftDeleteProduct,
} from "@/hooks/admin-app/src/hooks/admin/product"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"
import { useDebounce } from "@/hooks/client-app/src/hooks/ui/useDebounce"


function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại."
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price)
}

export default function AdminProductsPage() {
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState<ProductSortBy>("createdAt")
  const [order, setOrder] = useState<ProductOrder>("desc")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const debouncedQ = useDebounce(q, 450)

  const params = useMemo(
    () => ({
      q: debouncedQ || undefined,
      status: statusFilter !== "" ? Number(statusFilter) : undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice !== "" ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
      sortBy,
      order,
      page,
      limit,
    }),
    [debouncedQ, statusFilter, categoryId, minPrice, maxPrice, sortBy, order, page, limit],
  )

  const { data, isLoading, isError, error } = useProducts(params)
  const deleteMutation = useSoftDeleteProduct()

  const items = data?.items ?? []
  const pagination = data?.pagination

  const drawerStatus: "all" | "Visible" | "Hidden" =
    statusFilter === "Visible" || statusFilter === "Hidden"
      ? statusFilter
      : "all"

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "thumbnail",
        header: "Ảnh",
        cell: ({ row }) => {
          const raw = row.original.thumbnail || row.original.images?.[0]?.url
          const src = typeof raw === "string" ? raw : raw?.url
          if (!src) return <span className="text-xs text-slate-400">Không có ảnh</span>
          return (
            <Image
              src={src}
              alt={row.original.name}
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 rounded-md border object-cover"
            />
          )
        },
      },
      {
        accessorKey: "name",
        header: "Tên sản phẩm",
      },
      {
        id: "price",
        header: "Giá",
        cell: ({ row }) => `${formatPrice(row.original.price)}đ`,
      },
      {
        accessorKey: "stock",
        header: "Tồn kho",
      },
      {
        id: "detail",
        header: "Chi tiết",
        cell: ({ row }) => (
          <Link
            href={`/admin/product/${row.original._id}`}
            className="text-blue-600 hover:underline"
          >
            Xem
          </Link>
        ),
      },
    ],
    [],
  )

  const table = useAdminTable(items, columns)

  const openDeleteModal = (id: string) => {
    setDeletingId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      const res = await deleteMutation.mutateAsync(deletingId)
      toast.success(res.message)
      setDeletingId(null)
      setIsDeleteModalOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  // removed unused handleRestore

  const resetFilters = () => {
    setQ("")
    setStatusFilter("")
    setCategoryId("")
    setMinPrice("")
    setMaxPrice("")
    setSortBy("createdAt")
    setOrder("desc")
    setPage(1)
    setLimit(12)
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 space-y-4">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý sản phẩm</h1>
            <p className="mt-1 text-sm text-slate-500">
              Danh sách sản phẩm với tìm kiếm, lọc, sắp xếp, phân trang.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>
            <Link href="/admin/product/create">
              <Button>Thêm sản phẩm</Button>
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[280px] space-y-1">
            <Label>Tìm kiếm</Label>
            <Input
              placeholder="Nhập tên sản phẩm..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div className="space-y-1">
            <Label>Sắp xếp theo</Label>
            <select
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
            >
              <option value="createdAt">Ngày tạo</option>
              <option value="name">Tên</option>
              <option value="price">Giá</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label>Thứ tự</Label>
            <select
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
              value={order}
              onChange={(e) => setOrder(e.target.value as ProductOrder)}
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>

          {/* <div className="space-y-1">
            <Label>Limit</Label>
            <select
              className="border-input bg-background rounded-md border px-3 py-2 text-sm"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value))
                setPage(1)
              }}
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
            </select>
          </div> */}

          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        {/* <RestoreProductForm
          isSubmitting={restoreMutation.isPending}
          onSubmit={handleRestore}
        /> */}

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải danh sách sản phẩm...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Không có sản phẩm nào.
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <AdminEntityTable
            table={table}
            renderActions={(row) => (
              <div className="flex gap-2">
                <Link href={`/admin/product/${row._id}/edit`}>
                  <Button variant="outline" size="sm">
                    Sửa
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteModal(row._id)}
                >
                  Xóa
                </Button>
              </div>
            )}
          />
        )}

        {pagination && (
          <div className="flex items-center justify-between rounded-lg border bg-slate-50 p-3 text-sm">
            <p>
              Tổng: <strong>{pagination.total}</strong> | Trang{" "}
              <strong>{pagination.page}</strong> / {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </section>

      <AdminFilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        search={q}
        status={drawerStatus}
        onChangeSearch={(value) => {
          setQ(value)
          setPage(1)
        }}
        onChangeStatus={(value) => {
          const next = value === "all" ? "" : value
          setStatusFilter(next)
          setPage(1)
        }}
        onApply={() => setIsFilterOpen(false)}
        onReset={resetFilters}
      />

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        isSubmitting={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </main>
  )
}