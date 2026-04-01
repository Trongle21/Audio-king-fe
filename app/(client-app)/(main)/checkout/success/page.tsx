import { CheckoutSuccessContent } from "@/components/organisms/CheckoutSuccessContent"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Đặt hàng thành công",
  description:
    "Đơn hàng của bạn đã được ghi nhận thành công tại FE-Audio. Theo dõi và tiếp tục mua sắm ngay.",
  canonical: "/checkout/success",
})

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent />
}
