"use client"

import { useQuery } from "@tanstack/react-query"

import { getCategories } from "@/api/category"
import { getOrders } from "@/api/orders"
import { getProducts } from "@/api/product"
import { getAdminUsers } from "@/services/adminUser.service"

export interface DashboardStats {
  totalUsers: number
  totalCategories: number
  totalProducts: number
  totalOrders: number
  paidOrders: number
  totalRevenue: number
}

const DASHBOARD_QUERY_KEY = ["admin-dashboard-stats"] as const

const DEFAULT_STATS: DashboardStats = {
  totalUsers: 0,
  totalCategories: 0,
  totalProducts: 0,
  totalOrders: 0,
  paidOrders: 0,
  totalRevenue: 0,
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [usersRes, categoriesRes, productsRes, ordersRes] = await Promise.all([
    getAdminUsers({ page: 1, limit: 1 }),
    getCategories({ page: 1, limit: 1 }),
    getProducts({ page: 1, limit: 1 }),
    getOrders({ page: 1, limit: 1000 }),
  ])

  const orders = ordersRes.data.items ?? []
  const paidOrders = orders.filter(
    (order) => String(order.paymentStatus ?? "").toLowerCase() === "paid",
  )
  const totalRevenue = paidOrders.reduce((sum, order) => {
    const revenue =
      Number((order as { totalAmount?: number }).totalAmount) ||
      Number((order as { total?: number }).total) ||
      Number((order as { subtotal?: number }).subtotal) ||
      0

    return sum + revenue
  }, 0)

  return {
    totalUsers: usersRes.data.pagination?.total ?? 0,
    totalCategories: categoriesRes.data.pagination?.total ?? 0,
    totalProducts: productsRes.data.pagination?.total ?? 0,
    totalOrders: ordersRes.data.pagination?.total ?? orders.length,
    paidOrders: paidOrders.length,
    totalRevenue,
  }
}

export function useDashboard() {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardStats,
  })

  return {
    stats: query.data ?? DEFAULT_STATS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
