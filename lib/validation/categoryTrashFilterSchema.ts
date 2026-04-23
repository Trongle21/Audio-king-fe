import { z } from "zod"

export const categoryTrashFilterSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
})

export type CategoryTrashFilterFormValues = z.infer<typeof categoryTrashFilterSchema>
