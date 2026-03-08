"use client"

import Image from "next/image"
import Link from "next/link"

import { formatCurrency } from "@/lib"

import { Button, Input, Label } from "@/components/atoms"
import { useCart } from "@/hooks/client-app/src/hooks/cart"


export function CartPageContent() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart()

  return (
    <section className="mt-6 grid lg:flex gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr),360px]">
      <div className="space-y-4 flex-1">
        {items.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
            <Link href="/product" className="mt-4 inline-block">
              <Button variant="outline">Mua sắm ngay</Button>
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center"
            >
              <Link
                href={`/product/${item.id}`}
                className="relative h-20 w-full overflow-hidden rounded-md bg-muted sm:h-24 sm:w-24"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-200" />
                )}
              </Link>

              <div className="min-w-0 flex-1 space-y-2">
                <Link
                  href={`/product/${item.id}`}
                  className="line-clamp-2 text-sm font-semibold hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-bold text-destructive">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-end justify-between gap-3 sm:block sm:w-32">
                <Label htmlFor={`qty-${item.id}`} className="text-sm font-bold">
                  Số lượng
                </Label>
                <div className="flex items-center gap-1 mt-2">
                  <div className="space-y-1">
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value || 1))}
                      className="h-9 w-16"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-9 cursor-pointer"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <aside className="flex-[0.4] h-fit space-y-3 rounded-lg border bg-card p-4 lg:sticky lg:top-24">
        <h2 className="text-base font-semibold">Thông tin đơn hàng</h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tạm tính ({totalItems} SP)</span>
            <span className="font-medium">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span className="font-medium">Miễn phí</span>
          </div>
          <div className="my-2 h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Tổng thanh toán</span>
            <span className="text-lg font-bold text-destructive">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <Link href="/product" className="block">
            <Button variant="outline" className="w-full block cursor-pointer">
              Mua tiếp
            </Button>
          </Link>
          <Link href="/checkout" className="block">
            <Button className="w-full cursor-pointer bg-destructive text-white hover:bg-destructive/90" disabled={items.length === 0}>
              Thanh toán
            </Button>
          </Link>
        </div>
      </aside>
    </section>
  )
}
