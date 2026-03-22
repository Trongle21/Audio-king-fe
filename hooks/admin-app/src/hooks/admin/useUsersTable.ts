"use client"

import * as React from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/atoms"

export type UserRow = {
  id: string
  name: string
  email: string
  role: "Admin" | "Staff" | "Customer"
  status: "Active" | "Pending" | "Blocked"
}

const usersData: UserRow[] = [
  { id: "U001", name: "Nguyễn Minh An", email: "an@feaudio.vn", role: "Admin", status: "Active" },
  { id: "U002", name: "Trần Hải Long", email: "long@feaudio.vn", role: "Staff", status: "Active" },
  { id: "U003", name: "Phạm Thu Trang", email: "trang@gmail.com", role: "Customer", status: "Pending" },
  { id: "U004", name: "Lê Tuấn Kiệt", email: "kiet@gmail.com", role: "Customer", status: "Blocked" },
  { id: "U005", name: "Đỗ Bảo Nam", email: "nam@gmail.com", role: "Customer", status: "Active" },
]

export function useUsersTable(): {
  data: UserRow[]
  columns: ColumnDef<UserRow>[]
} {
  const columns = React.useMemo<ColumnDef<UserRow>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Tên" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Vai trò" },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) =>
          React.createElement(
            Badge,
            { variant: row.original.status === "Active" ? "default" : "outline" },
            row.original.status,
          ),
      },
    ],
    [],
  )

  return { data: usersData, columns }
}
