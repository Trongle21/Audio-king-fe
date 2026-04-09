import { z } from "zod"

export const replaceImagesSchema = z.object({
  indices: z.array(z.number().int().min(0)).min(1, "Chọn ít nhất 1 vị trí"),
})
