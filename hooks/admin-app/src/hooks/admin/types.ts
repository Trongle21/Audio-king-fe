import type { ColumnDef } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"

export type AdminTab = "dashboard" | "users" | "categories" | "products" | "carts"

export interface AdminSidebarItem {
  key: AdminTab
  label: string
  icon: LucideIcon
}

export interface AdminStatItem {
  label: string
  value: string
}

export type UserRole = "Admin" | "Staff" | "Customer"
export type UserStatus = "Active" | "Pending" | "Blocked"

export interface UserRow {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export type CategoryStatus = "Visible" | "Hidden"

export interface CategoryRow {
  id: string
  name: string
  slug: string
  productCount: number
  status: CategoryStatus
}

export interface ProductRow {
  id: string
  name: string
  sku: string
  category: string
  price: string
  stock: number
}

export interface CartRow {
  id: string
  customer: string
  items: number
  total: string
  updatedAt: string
}

export interface AdminTableResource<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
}
