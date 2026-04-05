"use client"

import { useState } from "react"

import { AppModal, Button, Input } from "@/components/atoms"
import { AdminEntityTable } from "@/components/organisms/admin-entity-table"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"
import { useCartsTable } from "@/hooks/admin-app/src/hooks/admin/useCartsTable"

export default function AdminCartsPage() {
  const {
    filteredData,
    columns,
    search,
    setSearch,
    paymentStatusFilter,
    setPaymentStatusFilter,
    resetFilters,
    onDelete,
    onTogglePaymentStatus,
    isLoading,
    isFetching,
    isError,
    error,
    isDeleting,
    isUpdatingPaymentStatus,
    updatingPaymentId,
  } = useCartsTable()

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
            <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm theo khách hàng, trạng thái hoặc tổng tiền..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />

          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={paymentStatusFilter ?? "all"}
            onChange={(e) => {
              const value = e.target.value
              setPaymentStatusFilter(value === "all" ? undefined : (value as "paid" | "unpaid"))
            }}
          >
            <option value="all">All payment</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        {isError && (
          <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error instanceof Error && error.message.trim()
              ? error.message
              : "Không tải được danh sách đơn hàng."}
          </p>
        )}

        {(isLoading || isFetching) && <p className="text-sm text-slate-500">Đang tải dữ liệu đơn hàng...</p>}

        {!isLoading && !isError && filteredData.length === 0 && (
          <p className="text-sm text-slate-500">Không có đơn hàng nào.</p>
        )}

        <AdminEntityTable
          table={table}
          renderActions={(row) => {
            const isUpdatingThisRow = isUpdatingPaymentStatus && updatingPaymentId === row.id
            const paymentStatusLabel = row.paymentStatus === "paid" ? "Đánh dấu chưa thanh toán" : "Đánh dấu đã thanh toán"

            return (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUpdatingThisRow}
                  onClick={() => onTogglePaymentStatus(row.id, row.paymentStatus)}
                >
                  {isUpdatingThisRow ? "Đang cập nhật..." : paymentStatusLabel}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting || isUpdatingThisRow}
                  onClick={() => openDeleteModal(row.id)}
                >
                  Xóa
                </Button>
              </div>
            )
          }}
        />
      </section>

      <AppModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Order"
        description="Bạn có chắc chắn muốn xoá đơn hàng này không? Hành động này không thể hoàn tác."
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
              disabled={isDeleting}
              onClick={confirmDelete}
            >
              Xóa
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Nhấn <strong>Delete</strong> để xác nhận xoá đơn hàng đã chọn.
        </p>
      </AppModal>
    </main>
  )
}
