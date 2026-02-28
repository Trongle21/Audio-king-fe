import Link from "next/link"

import { Button } from "@/components/atoms"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Xác thực",
  description:
    "Đăng nhập hoặc đăng ký tài khoản FE-Audio để truy cập các tính năng đặc biệt",
  noindex: true,
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="border-b bg-background px-2" role="banner">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold"
            aria-label="FE-Audio - Về trang chủ"
          >
            FE-Audio
          </Link>
          <nav>
            <Link href="/" aria-label="Về trang chủ">
              <Button variant="ghost" size="sm">
                ← Về trang chủ
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center bg-muted/30 top-1/2 translate-y-1/2">
        {children}
      </main>
    </>
  )
}
