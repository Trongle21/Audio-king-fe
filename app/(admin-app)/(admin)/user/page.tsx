"use client"

import { useMemo, useState } from "react"

import { toast } from "sonner"

import type {
  AdminUserItem,
  AdminUserRole,
  AdminUsersQueryParams,
} from "@/services/adminUser.service"

import { Badge, Button, Input, Label } from "@/components/atoms"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useAdminUsers,
  useRestoreAdminUser,
  useSoftDeleteAdminUser,
  useUpdateAdminUser,
} from "@/hooks/admin-app/src/hooks/admin/user/useAdminUsers"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    if (error.message.includes("401") || error.message.includes("403")) {
      return "Không có quyền truy cập. Vui lòng đăng nhập lại bằng tài khoản admin."
    }
    return error.message
  }

  return "Có lỗi xảy ra, vui lòng thử lại."
}

function formatDate(value?: string) {
  if (!value) return "--"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "--"
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

type EditFormState = {
  username: string
  email: string
  phone: string
  role: AdminUserRole
}

const DEFAULT_EDIT_FORM: EditFormState = {
  username: "",
  email: "",
  phone: "",
  role: "user",
}

export default function AdminUsersPage() {
  const [q, setQ] = useState("")
  const [role, setRole] = useState<"all" | AdminUserRole>("all")
  const [isDelete, setIsDelete] = useState<"all" | "false" | "true">("all")
  const [sortBy, setSortBy] = useState<"createdAt" | "username">("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [limit] = useState(12)

  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>(DEFAULT_EDIT_FORM)

  const queryParams: AdminUsersQueryParams = useMemo(
    () => ({
      q: q.trim() || undefined,
      role: role === "all" ? undefined : role,
      isDelete: isDelete === "all" ? undefined : isDelete === "true",
      sortBy,
      order,
      page,
      limit,
    }),
    [isDelete, limit, order, page, q, role, sortBy],
  )

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers(queryParams)

  const updateUserMutation = useUpdateAdminUser()
  const softDeleteMutation = useSoftDeleteAdminUser()
  const restoreMutation = useRestoreAdminUser()

  const items = data?.items ?? []
  const pagination = data?.pagination

  const openEditModal = (user: AdminUserItem) => {
    setEditingUser(user)
    setEditForm({
      username: user.username ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role,
    })
  }

  const closeEditModal = () => {
    setEditingUser(null)
    setEditForm(DEFAULT_EDIT_FORM)
  }

  const handleApplyFilters = () => {
    setPage(1)
  }

  const handleResetFilters = () => {
    setQ("")
    setRole("all")
    setIsDelete("all")
    setSortBy("createdAt")
    setOrder("desc")
    setPage(1)
  }

  const handleEditSubmit = async () => {
    if (!editingUser) return

    try {
      const response = await updateUserMutation.mutateAsync({
        id: editingUser._id,
        payload: {
          username: editForm.username.trim() || undefined,
          email: editForm.email.trim() || undefined,
          phone: editForm.phone.trim() || undefined,
          role: editForm.role,
        },
      })

      toast.success(response.message)
      closeEditModal()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleSoftDelete = async (user: AdminUserItem) => {
    const confirmed = window.confirm(`Xác nhận xóa mềm user ${user.username}?`)
    if (!confirmed) return

    try {
      const response = await softDeleteMutation.mutateAsync(user._id)
      toast.success(response.message)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleRestore = async (user: AdminUserItem) => {
    const confirmed = window.confirm(`Khôi phục user ${user.username}?`)
    if (!confirmed) return

    try {
      const response = await restoreMutation.mutateAsync(user._id)
      toast.success(response.message)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
          </div>
        </header>

        <div className="grid gap-3 rounded-xl border bg-slate-50 p-4 md:grid-cols-6">
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="q">Tìm kiếm</Label>
            <Input
              id="q"
              placeholder="username / email / phone"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as "all" | AdminUserRole)}
            >
              <option value="all">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="isDelete">Deleted</Label>
            <select
              id="isDelete"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              value={isDelete}
              onChange={(e) => setIsDelete(e.target.value as "all" | "false" | "true")}
            >
              <option value="all">All</option>
              <option value="false">Active</option>
              <option value="true">Deleted</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="sortBy">Sort by</Label>
            <select
              id="sortBy"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "createdAt" | "username")}
            >
              <option value="createdAt">Created date</option>
              <option value="username">Username</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="order">Order</Label>
            <select
              id="order"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              value={order}
              onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <div className="flex items-end gap-2 md:col-span-6">
            <Button onClick={handleApplyFilters}>Apply</Button>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Đang tải danh sách người dùng...
          </div>
        )}

        {isError && (
          <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            <p>{getErrorMessage(error)}</p>
            <Button variant="outline" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <div className="rounded-xl border bg-slate-50 p-6 text-sm text-slate-500">
            Không có dữ liệu người dùng.
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Username</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Created</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user._id} className="border-b last:border-b-0 hover:bg-slate-50/60">
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone || "--"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.isDelete ? "outline" : "default"}>
                        {user.isDelete ? "Deleted" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                          Edit
                        </Button>

                        {user.isDelete ? (
                          <Button
                            size="sm"
                            onClick={() => handleRestore(user)}
                            disabled={restoreMutation.isPending}
                          >
                            Restore
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleSoftDelete(user)}
                            disabled={softDeleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3 text-sm">
            <p>
              Tổng: <strong>{pagination.total}</strong> | Trang <strong>{pagination.page}</strong> /{" "}
              {pagination.totalPages}
              {isFetching && <span className="ml-2 text-slate-500">(đang cập nhật...)</span>}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </section>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && closeEditModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật user</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin cơ bản của người dùng.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editForm.username}
                onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, role: e.target.value as AdminUserRole }))
                }
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal} disabled={updateUserMutation.isPending}>
              Hủy
            </Button>
            <Button onClick={handleEditSubmit} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
