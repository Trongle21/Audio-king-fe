"use client"

import * as React from "react"

import { CheckCircle2, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

import type { Order } from "@/api/orders"
import { Button } from "@/components/atoms"
import { formatCurrency } from "@/lib"

const LAST_ORDER_STORAGE_KEY = "ak_last_order"

type StoredOrderResponse = {
  message: string
  data: Order
}

function safeParseOrder(raw: string | null): StoredOrderResponse | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredOrderResponse
    if (!parsed || typeof parsed !== "object") return null
    if (!parsed.data || typeof parsed.data !== "object") return null
    return parsed
  } catch {
    return null
  }
}

export function CheckoutSuccessContent() {
  const [payload, setPayload] = React.useState<StoredOrderResponse | null>(null)

  React.useEffect(() => {
    const raw = window.sessionStorage.getItem(LAST_ORDER_STORAGE_KEY)
    const parsed = safeParseOrder(raw)
    setPayload(parsed)
  }, [])

  const order = payload?.data

  return (
    <main className="container py-8 md:py-12 lg:py-16">
      <section className="mx-auto w-full max-w-3xl space-y-4 rounded-2xl border bg-card p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="text-center">
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
            {payload?.message ??
              "Đơn hàng của bạn đã được tiếp nhận. Bộ phận chăm sóc khách hàng sẽ liên hệ xác nhận sớm nhất."}
          </p>
        </div>

        {order ? (
          <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <p>
                Mã đơn hàng: <span className="font-semibold">{order._id}</span>
              </p>
              <p className="text-muted-foreground">
                Trạng thái: <span className="font-medium">{order.status}</span>
              </p>
            </div>

            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div
                  key={`${it.product}-${idx}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(it.finalPrice)} × {it.quantity}
                    </p>
                  </div>
                  <div className="shrink-0 font-semibold text-destructive">
                    {formatCurrency(it.lineTotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="my-2 h-px bg-border" />

            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Tổng cộng</span>
                <span className="text-lg text-destructive">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
            Không tìm thấy dữ liệu đơn hàng. Nếu bạn vừa đặt hàng, vui lòng quay lại giỏ
            hàng và thử lại.
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

