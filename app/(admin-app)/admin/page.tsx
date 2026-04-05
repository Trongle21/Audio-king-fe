"use client"

import { BarChart3, Boxes, CircleDollarSign, Package, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/atoms"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules"
import { useDashboard } from "@/hooks/admin-app/src/hooks/admin/useDashboard"

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminDashboardPage() {
  const { stats, isLoading, isError, isFetching, error, refetch } = useDashboard()

  const cards = [
    {
      title: "Tổng Users",
      value: formatNumber(stats.totalUsers),
      icon: Users,
    },
    {
      title: "Tổng Category",
      value: formatNumber(stats.totalCategories),
      icon: Boxes,
    },
    {
      title: "Tổng Product",
      value: formatNumber(stats.totalProducts),
      icon: Package,
    },
    {
      title: "Tổng Order",
      value: formatNumber(stats.totalOrders),
      icon: ShoppingBag,
    },
    {
      title: "Đơn đã thanh toán",
      value: `${formatNumber(stats.paidOrders)}/${formatNumber(stats.totalOrders)}`,
      icon: CircleDollarSign,
    },
  ]

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Quản trị tổng quan hệ thống FE-Audio</p>
      </header>

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error instanceof Error ? error.message : "Không thể tải dữ liệu dashboard"}</p>
          <Button className="mt-3" variant="outline" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Card key={card.title} className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm text-slate-500">
                  <span>{card.title}</span>
                  <Icon className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">{isLoading ? "..." : card.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tổng doanh thu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">Doanh thu từ các đơn hàng đã thanh toán</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {isLoading ? "..." : formatCurrency(stats.totalRevenue)}
            </p>
            {isFetching && !isLoading && (
              <p className="mt-2 text-xs text-slate-500">Đang cập nhật dữ liệu...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
