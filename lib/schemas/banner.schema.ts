import { z } from "zod"

export const bannerImageSchema = z.object({
  url: z.string().url("URL ảnh không hợp lệ"),
  alt: z.string().optional(),
})

export const bannerSchema = z.object({
  images: z
    .array(bannerImageSchema)
    .min(1, "Banner phải có ít nhất 1 ảnh"),
})

export type BannerFormData = z.infer<typeof bannerSchema>
