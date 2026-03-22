"use client"

import * as React from "react"

import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/atoms"

export type ProductRow = {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: "Visible" | "Hidden"
}

export type ProductFormData = {
  name: string
  sku: string
  category: string
  price: string
  stock: number
  status: "Visible" | "Hidden"
}

export type ProductFilterStatus = "all" | "Visible" | "Hidden"

const initialProductsData: ProductRow[] = [
  {
    id: "P001",
    name: "Loa JBL CV1652T",
    sku: "JBL-CV1652T",
    category: "Loa Karaoke",
    price: "23.100.000đ",
    stock: 12,
    status: "Visible",
  },
  {
    id: "P002",
    name: "Micro BIK BJ-U25",
    sku: "BIK-U25",
    category: "Micro",
    price: "3.290.000đ",
    stock: 40,
    status: "Visible",
  },
  {
    id: "P003",
    name: "Vang Số JBL KX190",
    sku: "JBL-KX190",
    category: "Vang Số",
    price: "9.900.000đ",
    stock: 15,
    status: "Visible",
  },
  {
    id: "P004",
    name: "Cục Đẩy Crown XLi 2500",
    sku: "CR-XLI2500",
    category: "Cục Đẩy",
    price: "12.500.000đ",
    stock: 9,
    status: "Hidden",
  },
  {
    id: "P005",
    name: "Loa BIK BJ-S888II",
    sku: "BIK-S888II",
    category: "Loa Karaoke",
    price: "8.290.000đ",
    stock: 26,
    status: "Visible",
  },
]

const initialFormState: {
  name: string
  sku: string
  category: string
  price: string
  stock: string
  status: "Visible" | "Hidden"
} = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "0",
  status: "Visible",
}

export function useProductsTable() {
  const [data, setData] = React.useState<ProductRow[]>(initialProductsData)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState(initialFormState)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<ProductFilterStatus>("all")

  const toggleProductStatus = React.useCallback((id: string) => {
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

  const columns = React.useMemo<ColumnDef<ProductRow>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Sản phẩm" },
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "category", header: "Danh mục" },
      { accessorKey: "price", header: "Giá" },
      { accessorKey: "stock", header: "Tồn kho" },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) =>
          React.createElement(
            "button",
            {
              type: "button",
              onClick: () => toggleProductStatus(row.original.id),
              className: "cursor-pointer",
              "aria-label": `Đổi trạng thái sản phẩm ${row.original.name}`,
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
    [toggleProductStatus],
  )

  const filteredData = React.useMemo(() => {
    const q = search.trim().toLowerCase()

    return data.filter((item) => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
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
      const product = data.find((item) => item.id === id)
      if (!product) return

      setEditingId(id)
      setForm({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: String(product.stock),
        status: product.status,
      })
      setIsModalOpen(true)
    },
    [data],
  )

  const addProduct = React.useCallback((payload: ProductFormData) => {
    setData((prev) => {
      const numeric = prev
        .map((item) => Number(item.id.replace("P", "")))
        .filter((n) => !Number.isNaN(n))
      const nextNumber = (numeric.length > 0 ? Math.max(...numeric) : 0) + 1
      const nextId = `P${String(nextNumber).padStart(3, "0")}`

      return [...prev, { id: nextId, ...payload }]
    })
  }, [])

  const updateProduct = React.useCallback((id: string, payload: ProductFormData) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)))
  }, [])

  const deleteProduct = React.useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const onSave = React.useCallback(() => {
    const payload: ProductFormData = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: form.price.trim(),
      stock: Number(form.stock) || 0,
      status: form.status,
    }

    if (!payload.name || !payload.sku || !payload.category || !payload.price) return

    if (editingId) {
      updateProduct(editingId, payload)
    } else {
      addProduct(payload)
    }

    setIsModalOpen(false)
    setEditingId(null)
    setForm(initialFormState)
  }, [addProduct, editingId, form, updateProduct])

  const onDelete = React.useCallback(
    (id: string) => {
      deleteProduct(id)
    },
    [deleteProduct],
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

    addProduct,
    updateProduct,
    deleteProduct,
  }
}
