import Link from "next/link"

import { Button } from "@/components/atoms"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Admin Dashboard",
  description: "Trang quản trị hệ thống FE-Audio",
  noindex: true,
})

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
        role="banner"
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-xl font-bold"
              aria-label="Admin Panel - Về dashboard"
            >
              Admin Panel
            </Link>
            <nav
              className="hidden md:flex gap-6"
              role="navigation"
              aria-label="Admin navigation"
            >
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary"
                aria-label="Dashboard"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="text-sm font-medium hover:text-primary"
                aria-label="Quản lý người dùng"
              >
                Users
              </Link>
              <Link
                href="/admin/products"
                className="text-sm font-medium hover:text-primary"
                aria-label="Quản lý sản phẩm"
              >
                Products
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <nav>
              <Link href="/" aria-label="Về Client App">
                <Button variant="outline" size="sm">
                  Về Client App
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1">{children}</main>
    </>
  )
}
