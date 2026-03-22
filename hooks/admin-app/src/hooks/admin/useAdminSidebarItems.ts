"use client"

import { LayoutDashboard, ListTree, Package, ShoppingCart, Users } from "lucide-react"

import type { AdminSidebarItem } from "./types"

export function useAdminSidebarItems(): AdminSidebarItem[] {
  return [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "categories", label: "Category", icon: ListTree },
    { key: "products", label: "Product", icon: Package },
    { key: "carts", label: "Cart", icon: ShoppingCart },
  ]
}
