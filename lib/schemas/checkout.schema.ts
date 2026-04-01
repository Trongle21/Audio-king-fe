import { z } from "zod"

const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được vượt quá 100 ký tự"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Số điện thoại không hợp lệ"),
  address: z
    .string()
    .trim()
    .min(5, "Địa chỉ quá ngắn")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),
  note: z
    .string()
    .trim()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
