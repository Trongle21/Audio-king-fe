import Link from "next/link"

import { CartPageContent } from "@/components/organisms/CartPageContent"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Giỏ hàng",
  description:
    "Xem lại sản phẩm trong giỏ hàng FE-Audio, cập nhật số lượng và tiến hành thanh toán nhanh chóng.",
  canonical: "/cart",
})

export default function CartPage() {
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
          <li className="font-medium text-foreground">Giỏ hàng</li>
        </ol>
      </nav>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Giỏ hàng của bạn
        </h1>
        <p className="text-sm text-muted-foreground">
          Kiểm tra lại sản phẩm trước khi đặt hàng.
        </p>
      </header>

      <CartPageContent />
    </main>
  )
}
