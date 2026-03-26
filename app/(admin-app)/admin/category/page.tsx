"use client"

import { useMemo, useState } from "react"

import { type ColumnDef } from "@tanstack/react-table"
import { Filter } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button, Input } from "@/components/atoms"
import {
  AdminEntityTable,
  AdminFilterDrawer,
  CategoryFormModal,
  DeleteCategoryModal
} from "@/components/organisms"
import {
  useCategories,
  useCreateCategory,
  useSoftDeleteCategory,
  useUpdateCategory,
} from "@/hooks/admin-app/src/hooks/admin/category"
import { useRestoreCategory } from "@/hooks/admin-app/src/hooks/admin/category/useCategoryQueries"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"
import { useDebounce } from "@/hooks/client-app/src/hooks/ui/useDebounce"

import type { Category } from "@/api/category"
import type { CategoryNameFormData } from "@/lib/schemas/category.schema"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Có lỗi xảy ra, vui lòng thử lại."
}

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 450)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useCategories({ q: debouncedSearch })

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useSoftDeleteCategory()
  const restoreMutation = useRestoreCategory()

  const categories = data ?? []

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "slug",
        header: "Slug",
      },
      {
        id: "products",
        header: "Products",
        cell: ({ row }) => row.original.products?.length ?? 0,
      },
      {
        id: "detail",
        header: "Detail",
        cell: ({ row }) => (
          <Link
            href={`/admin/category/${row.original._id}`}
            className="text-blue-600 hover:underline"
          >
            View detail
          </Link>
        ),
      },
    ],
    [],
  )

  const table = useAdminTable(categories, columns)

  const openAddModal = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const openDeleteModal = (id: string) => {
    setDeletingId(id)
    setIsDeleteOpen(true)
  }

  const handleSubmitForm = async (payload: CategoryNameFormData) => {
    try {
      if (editingCategory) {
        const res = await updateMutation.mutateAsync({
          id: editingCategory._id,
          payload: { name: payload.name },
        })
        toast.success(res.message)
      } else {
        const res = await createMutation.mutateAsync({ name: payload.name })
        toast.success(res.message)
      }

      setIsFormOpen(false)
      setEditingCategory(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const res = await deleteMutation.mutateAsync(deletingId)
      toast.success(res.message)
      setIsDeleteOpen(false)
      setDeletingId(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleRestore = async (id: string) => {
    try {
      const res = await restoreMutation.mutateAsync(id)
      toast.success(res.message)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý category theo đúng API backend.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button onClick={openAddModal}>Add Category</Button>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo tên hoặc slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" onClick={() => setSearch("")}>
            Reset
          </Button>
        </div>

        {/* <RestoreCategoryForm
          isSubmitting={restoreMutation.isPending}
          onSubmit={handleRestore}
        /> */}

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải danh sách category...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {getErrorMessage(error)}
          </div>
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Không có category nào.
          </div>
        )}

        {!isLoading && !isError && categories.length > 0 && (
          <AdminEntityTable
            table={table}
            renderActions={(row) => (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(row)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteModal(row._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          />
        )}
      </section>

      <AdminFilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        search={search}
        status="all"
        onChangeSearch={setSearch}
        onChangeStatus={() => undefined}
        onApply={() => setIsFilterOpen(false)}
        onReset={() => setSearch("")}
      />

      <CategoryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={editingCategory ? "edit" : "create"}
        defaultName={editingCategory?.name}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmitForm}
      />

      <DeleteCategoryModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        isSubmitting={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </main>
  )
}