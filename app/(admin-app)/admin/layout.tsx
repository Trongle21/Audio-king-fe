import Link from "next/link"

import { Button } from "@/components/atoms"
import { AdminSidebarNav } from "@/components/organisms/admin-sidebar-nav"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Admin Dashboard",
  description: "Trang quản trị hệ thống FE-Audio",
  noindex: true,
})

const adminMenus = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/user", label: "Users" },
  { href: "/admin/category", label: "Category" },
  { href: "/admin/product", label: "Product" },
  { href: "/admin/trending-product", label: "Trending Products" },
  { href: "/admin/cart", label: "Cart" },
]

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header
        className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur"
        role="banner"
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link
            href="/admin"
            className="cursor-pointer text-xl font-bold text-slate-900"
            aria-label="Admin Panel - Về dashboard"
          >
            FE-Audio Admin
          </Link>

          <Link href="/" aria-label="Về Client App">
            <Button variant="outline" size="sm">
              Về Client App
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-[240px_minmax(0,1fr)] gap-6 p-6">
        <aside className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Navigation</h2>
          <AdminSidebarNav items={adminMenus} />
        </aside>

        <section>{children}</section>
      </div>
    </div>
  )
}
