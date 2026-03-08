import Link from "next/link"

import { CheckCircle2, Home, ShoppingBag } from "lucide-react"

import { Button } from "@/components/atoms"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Đặt hàng thành công",
  description:
    "Đơn hàng của bạn đã được ghi nhận thành công tại FE-Audio. Theo dõi và tiếp tục mua sắm ngay.",
  canonical: "/checkout/success",
})

export default function CheckoutSuccessPage() {
  return (
    <main className="container py-8 md:py-12 lg:py-16">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border bg-card p-5 text-center shadow-sm sm:p-8 lg:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:h-20 sm:w-20">
          <CheckCircle2 className="h-9 w-9 sm:h-11 sm:w-11" />
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 sm:text-sm">
          FE-Audio cảm ơn bạn
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Đặt hàng thành công
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Đơn hàng của bạn đã được tiếp nhận. Bộ phận chăm sóc khách hàng sẽ liên
          hệ xác nhận trong thời gian sớm nhất.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/product" className="block">
            <Button className="w-full bg-destructive text-white hover:bg-destructive/90 cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Tiếp tục mua sắm
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
