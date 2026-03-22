"use client"

import * as React from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/atoms"

export type CategoryRow = {
  id: string
  name: string
  slug: string
  productCount: number
  status: "Visible" | "Hidden"
}

export type CategoryFormData = {
  name: string
  slug: string
  productCount: number
  status: "Visible" | "Hidden"
}

export type CategoryFilterStatus = "all" | "Visible" | "Hidden"

const initialCategoriesData: CategoryRow[] = [
  {
    id: "C001",
    name: "Loa Karaoke",
    slug: "loa-karaoke",
    productCount: 48,
    status: "Visible",
  },
  {
    id: "C002",
    name: "Micro",
    slug: "micro",
    productCount: 31,
    status: "Visible",
  },
  {
    id: "C003",
    name: "Cục Đẩy",
    slug: "cuc-day",
    productCount: 19,
    status: "Visible",
  },
  {
    id: "C004",
    name: "Vang Số",
    slug: "vang-so",
    productCount: 22,
    status: "Visible",
  },
  {
    id: "C005",
    name: "Tin Tức",
    slug: "tin-tuc",
    productCount: 0,
    status: "Hidden",
  },
]

const initialFormState: {
  name: string
  slug: string
  productCount: string
  status: "Visible" | "Hidden"
} = {
  name: "",
  slug: "",
  productCount: "0",
  status: "Visible",
}

export function useCategoriesTable() {
  const [data, setData] = React.useState<CategoryRow[]>(initialCategoriesData)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState(initialFormState)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<CategoryFilterStatus>("all")

  const toggleCategoryStatus = React.useCallback((id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Visible" ? "Hidden" : "Visible",
            }
          : item,
      ),
    )
  }, [])

  const columns = React.useMemo<ColumnDef<CategoryRow>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Danh mục" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "productCount", header: "Sản phẩm" },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) =>
          React.createElement(
            "button",
            {
              type: "button",
              onClick: () => toggleCategoryStatus(row.original.id),
              className: "cursor-pointer",
              "aria-label": `Đổi trạng thái danh mục ${row.original.name}`,
            },
            React.createElement(
              Badge,
              {
                variant: row.original.status === "Visible" ? "default" : "outline",
              },
              row.original.status,
            ),
          ),
      },
    ],
    [toggleCategoryStatus],
  )

  const filteredData = React.useMemo(() => {
    const q = search.trim().toLowerCase()

    return data.filter((item) => {
      const matchSearch =
        !q || item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || item.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  const openAddModal = React.useCallback(() => {
    setEditingId(null)
    setForm(initialFormState)
    setIsModalOpen(true)
  }, [])

  const openEditModal = React.useCallback(
    (id: string) => {
      const category = data.find((item) => item.id === id)
      if (!category) return

      setEditingId(id)
      setForm({
        name: category.name,
        slug: category.slug,
        productCount: String(category.productCount),
        status: category.status,
      })
      setIsModalOpen(true)
    },
    [data],
  )

  const addCategory = React.useCallback((payload: CategoryFormData) => {
    setData((prev) => {
      const numeric = prev
        .map((item) => Number(item.id.replace("C", "")))
        .filter((n) => !Number.isNaN(n))
      const nextNumber = (numeric.length > 0 ? Math.max(...numeric) : 0) + 1
      const nextId = `C${String(nextNumber).padStart(3, "0")}`

      return [...prev, { id: nextId, ...payload }]
    })
  }, [])

  const updateCategory = React.useCallback((id: string, payload: CategoryFormData) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)))
  }, [])

  const deleteCategory = React.useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const onSave = React.useCallback(() => {
    const payload: CategoryFormData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      productCount: Number(form.productCount) || 0,
      status: form.status,
    }

    if (!payload.name || !payload.slug) return

    if (editingId) {
      updateCategory(editingId, payload)
    } else {
      addCategory(payload)
    }

    setIsModalOpen(false)
    setEditingId(null)
    setForm(initialFormState)
  }, [addCategory, editingId, form, updateCategory])

  const onDelete = React.useCallback(
    (id: string) => {
      deleteCategory(id)
    },
    [deleteCategory],
  )

  const resetFilters = React.useCallback(() => {
    setSearch("")
    setStatusFilter("all")
  }, [])

  return {
    columns,
    data,
    filteredData,

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

    addCategory,
    updateCategory,
    deleteCategory,
  }
}
