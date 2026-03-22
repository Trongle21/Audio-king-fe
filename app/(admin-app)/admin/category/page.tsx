"use client"

import { useState } from "react"

import { Filter } from "lucide-react"

import { AppModal, Button, Input, Label } from "@/components/atoms"
import { AdminEntityTable } from "@/components/organisms/admin-entity-table"
import { AdminFilterDrawer } from "@/components/organisms/admin-filter-drawer"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"
import {
  useCategoriesTable,
  type CategoryFilterStatus,
} from "@/hooks/admin-app/src/hooks/admin/useCategoriesTable"

export default function AdminCategoriesPage() {
  const {
    filteredData,
    columns,
    isModalOpen,
    setIsModalOpen,
    isFilterOpen,
    setIsFilterOpen,
    editingId,
    form,
    setForm,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    resetFilters,
    openAddModal,
    openEditModal,
    onSave,
    onDelete,
  } = useCategoriesTable()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const table = useAdminTable(filteredData, columns)

  const openDeleteModal = (id: string) => {
    setDeletingId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!deletingId) return
    onDelete(deletingId)
    setIsDeleteModalOpen(false)
    setDeletingId(null)
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục sản phẩm, hỗ trợ thêm/sửa/xoá/tìm kiếm và filter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-destructive text-white hover:bg-destructive/90" onClick={openAddModal}>
              Add Category
            </Button>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo tên hoặc slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        <AdminEntityTable
          table={table}
          renderActions={(row) => (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openEditModal(row.id)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => openDeleteModal(row.id)}>
                Delete
              </Button>
            </div>
          )}
        />
      </section>

      <AdminFilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        search={search}
        status={statusFilter}
        onChangeSearch={setSearch}
        onChangeStatus={(value) => setStatusFilter(value as CategoryFilterStatus)}
        onApply={() => setIsFilterOpen(false)}
        onReset={resetFilters}
      />

      <AppModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingId ? "Edit Category" : "Add Category"}
        description="Nhập thông tin danh mục"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-destructive text-white hover:bg-destructive/90" onClick={onSave}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="categoryName">Name</Label>
            <Input
              id="categoryName"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="categorySlug">Slug</Label>
            <Input
              id="categorySlug"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="categoryCount">Product Count</Label>
            <Input
              id="categoryCount"
              type="number"
              min={0}
              value={form.productCount}
              onChange={(e) => setForm((prev) => ({ ...prev, productCount: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="categoryStatus">Status</Label>
            <select
              id="categoryStatus"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as "Visible" | "Hidden",
                }))
              }
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="Visible">Visible</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
      </AppModal>

      <AppModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Category"
        description="Bạn có chắc chắn muốn xoá danh mục này không? Hành động này không thể hoàn tác."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setDeletingId(null)
              }}
            >
              Cancel
            </Button>
            <Button className="bg-destructive text-white hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Nhấn <strong>Delete</strong> để xác nhận xoá danh mục đã chọn.
        </p>
      </AppModal>
    </main>
  )
}
