import { z } from "zod"

const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/

export const checkoutSchema = z
  .object({
    customerType: z.enum(["anh", "chi"], {
      message: "Vui lòng chọn danh xưng",
    }),
    fullName: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(80, "Họ và tên không được vượt quá 80 ký tự"),
    phone: z
      .string()
      .trim()
      .min(1, "Số điện thoại là bắt buộc")
      .regex(phoneRegex, "Số điện thoại không hợp lệ"),
    addressLine: z
      .string()
      .trim()
      .min(5, "Vui lòng nhập địa chỉ")
      .max(150, "Địa chỉ chi tiết không được vượt quá 150 ký tự"),
    note: z
      .string()
      .trim()
      .max(300, "Ghi chú không được vượt quá 300 ký tự")
      .optional(),
    paymentMethod: z.enum(["cod"], {
      message: "Vui lòng chọn phương thức thanh toán",
    }),
    agreeTerms: z.boolean().refine((v) => v, {
      message: "Bạn cần đồng ý điều khoản để tiếp tục",
    }),
  })


export type CheckoutFormData = z.infer<typeof checkoutSchema>
