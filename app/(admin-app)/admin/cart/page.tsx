"use client"

import { useState } from "react"

import { AppModal, Button, Input } from "@/components/atoms"
import { AdminEntityTable } from "@/components/organisms/admin-entity-table"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"
import { useCartsTable } from "@/hooks/admin-app/src/hooks/admin/useCartsTable"

export default function AdminCartsPage() {
  const { filteredData, columns, search, setSearch, resetFilters, onDelete } =
    useCartsTable()

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
            <h1 className="text-2xl font-bold text-slate-900">Cart Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý giỏ hàng của khách, hỗ trợ tìm kiếm và xoá giỏ hàng.
            </p>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo mã giỏ, khách hàng hoặc tổng tiền..."
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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => openDeleteModal(row.id)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </section>

      <AppModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Cart"
        description="Bạn có chắc chắn muốn xoá giỏ hàng này không? Hành động này không thể hoàn tác."
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
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Nhấn <strong>Delete</strong> để xác nhận xoá giỏ hàng đã chọn.
        </p>
      </AppModal>
    </main>
  )
}
