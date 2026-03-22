"use client"

import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"

export function useAdminTable<TData>(data: TData[], columns: ColumnDef<TData>[]) {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
}
