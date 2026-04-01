"use client"

import * as React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { formatCurrency } from "@/lib"

import { AppInput, Button } from "@/components/atoms"
import { useCart } from "@/hooks/client-app/src/hooks/cart"
import { useCheckoutForm } from "@/hooks/client-app/src/hooks/checkout"
import { useCreateOrder } from "@/hooks/client-app/src/hooks/order"

const LAST_ORDER_STORAGE_KEY = "ak_last_order"

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  return "Có lỗi xảy ra, vui lòng thử lại."
}


export function CheckoutPageContent() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const createOrderMutation = useCreateOrder()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCheckoutForm()

  React.useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart")
    }
  }, [items.length, router])

  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null)

    if (items.length === 0) {
      setSubmitError("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.")
      return
    }

    const payload = {
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      note: data.note?.trim() ? data.note.trim() : undefined,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    }

    try {
      const res = await createOrderMutation.mutateAsync(payload)
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(res))
      }
      clearCart()
      router.push("/checkout/success")
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    }
  })

  return (
    <section className="mt-6 grid lg:flex gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr),360px]">
      <form
        onSubmit={onSubmit}
        className="space-y-4 flex-1"
        aria-label="Form thanh toán"
      >
        {submitError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {submitError}
          </div>
        )}
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-base font-semibold">Thông tin khách hàng</h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AppInput
              id="customerName"
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              {...register("customerName")}
              error={errors.customerName?.message}
            />
            <AppInput
              id="phone"
              label="Số điện thoại"
              placeholder="0912345678"
              {...register("phone")}
              error={errors.phone?.message}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-base font-semibold">Địa chỉ giao hàng</h2>

          <AppInput
            className="mt-2"
            id="address"
            label="Địa chỉ"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            {...register("address")}
            error={errors.address?.message}
          />

          <AppInput
            className="mt-2"
            id="note"
            label="Ghi chú"
            placeholder="Ghi chú thêm (nếu có)"
            {...register("note")}
            error={errors.note?.message}
          />
        </div>


        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-base font-semibold">Xác nhận đặt hàng</h2>

          <Button
            type="submit"
            className="mt-4 w-full bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            disabled={items.length === 0 || isSubmitting || createOrderMutation.isPending}
          >
            {isSubmitting || createOrderMutation.isPending ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </div>
      </form>

      <aside className="h-fit flex-[0.4] space-y-3 rounded-lg border bg-card p-4 lg:sticky lg:top-24">
        <h2 className="text-base font-semibold">Đơn hàng của bạn ({totalItems})</h2>

        <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-2 rounded-md bg-muted/50 p-2">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-200" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${item.productId}`}
                  className="line-clamp-2 text-xs font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-destructive">
                    {formatCurrency(item.price ?? 0)}
                  </span>
                  <span className="text-muted-foreground">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Tổng cộng</span>
            <span className="text-lg text-destructive">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </aside>
    </section>
  )
}
