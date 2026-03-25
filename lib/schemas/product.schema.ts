import { z } from "zod"

export const productImageSchema = z.object({
  url: z.string().trim().url("URL ảnh không hợp lệ"),
  alt: z.string().trim().optional(),
})

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm là bắt buộc"),
  sku: z.string().trim().min(1, "SKU là bắt buộc"),
  price: z.coerce.number().min(0, "Giá không hợp lệ"),
  sale: z.coerce.number().min(0, "Sale không hợp lệ").optional(),
  stock: z.coerce.number().min(0, "Tồn kho không hợp lệ"),
  status: z.coerce.number().optional(),
  description: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  thumbnail: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), "Thumbnail phải là URL hợp lệ"),
  categories: z.array(z.string().trim().min(1)).min(1, "Chọn ít nhất 1 danh mục"),
  images: z.array(productImageSchema).optional(),
})

export const productUpdateSchema = productCreateSchema.partial()

export const productRestoreSchema = z.object({
  id: z.string().trim().min(1, "ID sản phẩm là bắt buộc"),
})

export type ProductCreateFormData = z.infer<typeof productCreateSchema>
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>
export type ProductRestoreFormData = z.infer<typeof productRestoreSchema>
