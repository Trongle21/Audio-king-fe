"use client"

import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"

export function useAdminTable<TData>(data: TData[], columns: ColumnDef<TData>[]) {
  // TanStack Table hook intentionally used here; return value includes non-memoizable functions by design.
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
}
