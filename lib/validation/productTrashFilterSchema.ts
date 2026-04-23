import { z } from "zod"

export const productTrashFilterSchema = z.object({
  q: z.string().optional(),
  status: z.union([z.literal(""), z.literal("0"), z.literal("1"), z.literal("2")]).optional(),
  categoryId: z.string().optional(),
  sortBy: z.enum(["createdAt", "name", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})

export type ProductTrashFilterFormValues = z.infer<typeof productTrashFilterSchema>
