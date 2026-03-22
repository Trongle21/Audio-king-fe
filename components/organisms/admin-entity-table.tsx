"use client"

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

type AdminEntityTableProps<TData> = {
    table: TanstackTable<TData>
    actionsHeader?: string
    renderActions?: (row: TData) => React.ReactNode
}

export function AdminEntityTable<TData>({
    table,
    actionsHeader = "Actions",
    renderActions,
}: AdminEntityTableProps<TData>) {
    return (
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
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                            {renderActions && (
                                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                                    {actionsHeader}
                                </th>
                            )}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b last:border-b-0 hover:bg-slate-50/60">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3 text-slate-700">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            {renderActions && (
                                <td className="px-4 py-3">{renderActions(row.original)}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
