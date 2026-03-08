"use client"

import { formatCurrency } from "@/lib"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AppInput, Button } from "@/components/atoms"
import { useCart } from "@/hooks/client-app/src/hooks/cart"
import { useCheckoutForm } from "@/hooks/client-app/src/hooks/checkout"


export function CheckoutPageContent() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useCheckoutForm()

  const onSubmit = handleSubmit(async (_data) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    clearCart()
    router.push("/checkout/success")
  })

  return (
    <section className="mt-6 grid lg:flex gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr),360px]">
      <form
        onSubmit={onSubmit}
        className="space-y-4 flex-1"
        aria-label="Form thanh toán"
      >
        <div className="rounded-lg border bg-card p-4 sm:p-5">
          <h2 className="text-base font-semibold">Thông tin khách hàng</h2>

          <div className="mt-4 flex gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="anh" {...register("customerType")} />
              Anh
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="chi" {...register("customerType")} />
              Chị
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AppInput
              id="fullName"
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              {...register("fullName")}
              error={errors.fullName?.message}
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
            id="addressLine"
            label="Địa chỉ"
            placeholder="Địa chỉ"
            {...register("addressLine")}
            error={errors.addressLine?.message}
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
          <h2 className="text-base font-semibold">Phương thức thanh toán</h2>

          <div className="mt-3 space-y-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" value="cod" {...register("paymentMethod")} />
              Thanh toán khi nhận hàng
            </label>
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("agreeTerms")} />
            Tôi đồng ý với điều khoản sử dụng
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-destructive">{errors.agreeTerms.message}</p>
          )}

          <Button
            type="submit"
            className="mt-4 w-full bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            disabled={items.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </div>
      </form>

      <aside className="h-fit flex-[0.4] space-y-3 rounded-lg border bg-card p-4 lg:sticky lg:top-24">
        <h2 className="text-base font-semibold">Đơn hàng của bạn ({totalItems})</h2>

        <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 rounded-md bg-muted/50 p-2">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
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
                  href={`/product/${item.id}`}
                  className="line-clamp-2 text-xs font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-destructive">{formatCurrency(item.price)}</span>
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
