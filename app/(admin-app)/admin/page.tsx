"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules"
import { useDashboard } from "@/hooks/admin-app/src/hooks/admin"

export default function AdminDashboardPage() {
  const { stats, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <main className="container py-12">
        <div className="text-center" role="status" aria-live="polite">
          Đang tải...
        </div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <article className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý hệ thống FE-Audio
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article>
            <Card>
              <CardHeader>
                <CardTitle>Người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-2xl font-bold"
                  aria-label="Tổng số người dùng"
                >
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tổng số người dùng
                </p>
              </CardContent>
            </Card>
          </article>

          <article>
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" aria-label="Tổng số sản phẩm">
                  {stats.totalProducts}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tổng số sản phẩm
                </p>
              </CardContent>
            </Card>
          </article>

          <article>
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" aria-label="Tổng số đơn hàng">
                  {stats.totalOrders}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tổng số đơn hàng
                </p>
              </CardContent>
            </Card>
          </article>
        </section>
      </article>
    </main>
  )
}
