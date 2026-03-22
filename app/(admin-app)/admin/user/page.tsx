"use client"

import { flexRender } from "@tanstack/react-table"

import { Button } from "@/components/atoms"
import { useAdminTable } from "@/hooks/admin-app/src/hooks/admin/useAdminTable"
import { useUsersTable } from "@/hooks/admin-app/src/hooks/admin/useUsersTable"

export default function AdminUsersPage() {
    const { data, columns } = useUsersTable()
    const table = useAdminTable(data, columns)

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Quản lý danh sách người dùng để mở rộng thêm tính năng add/edit.
                        </p>
                    </div>
                    <Button className="bg-destructive text-white hover:bg-destructive/90">
                        Add User
                    </Button>
                </header>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left font-semibold text-slate-700"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b last:border-b-0 hover:bg-slate-50/60"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3 text-slate-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}
