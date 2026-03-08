import Link from "next/link"

import { CheckoutPageContent } from "@/components/organisms/CheckoutPageContent"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Thanh toán",
  description:
    "Hoàn tất đơn hàng tại FE-Audio với biểu mẫu thông tin giao hàng và thanh toán an toàn, nhanh chóng.",
  canonical: "/checkout",
})

export default function CheckoutPage() {
  return (
    <main className="container py-6 md:py-8 lg:py-10">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 text-xs text-muted-foreground md:mb-6"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-destructive">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/cart" className="hover:text-destructive">
              Giỏ hàng
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-foreground">Thanh toán</li>
        </ol>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Thanh toán đơn hàng
        </h1>
        <p className="text-sm text-muted-foreground">
          Vui lòng điền thông tin chính xác để FE-Audio giao hàng nhanh hơn.
        </p>
      </header>

      <CheckoutPageContent />
    </main>
  )
}
