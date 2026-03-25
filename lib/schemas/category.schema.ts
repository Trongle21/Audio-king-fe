import { z } from "zod"

export const categoryNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên category không được để trống")
    .max(120, "Tên category quá dài"),
})

export const restoreCategorySchema = z.object({
  id: z.string().trim().min(1, "ID category là bắt buộc"),
})

export type CategoryNameFormData = z.infer<typeof categoryNameSchema>
export type RestoreCategoryFormData = z.infer<typeof restoreCategorySchema>
