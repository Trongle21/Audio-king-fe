"use client"

import { BarChart3 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules"

export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <header className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Quản trị tổng quan hệ thống FE-Audio</p>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">1,245</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">58</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">1,932</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Active Carts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">324</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-lg border border-dashed border-slate-300 bg-slate-50" />
        </CardContent>
      </Card>
    </section>
  )
}
