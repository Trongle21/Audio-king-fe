import { z } from "zod"

export const productFilterSchema = z.object({
  q: z.string().optional(),
  status: z
    .union([z.literal(""), z.literal("0"), z.literal("1"), z.literal("2")])
    .optional(),
  categoryId: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(["createdAt", "name", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type ProductFilterSchemaInput = z.input<typeof productFilterSchema>
export type ProductFilterFormData = z.output<typeof productFilterSchema>

