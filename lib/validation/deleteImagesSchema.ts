import { z } from "zod"

export const deleteImagesSchema = z
  .object({
    indices: z.array(z.number().int().min(0)).optional(),
    publicIds: z.array(z.string().min(1)).optional(),
  })
  .refine((v) => (v.indices?.length ?? 0) + (v.publicIds?.length ?? 0) > 0, {
    message: "Can it nhat 1 indices hoac publicIds",
  })
