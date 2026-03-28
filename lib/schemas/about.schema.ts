import { z } from "zod"

export const aboutImageSchema = z.object({
  url: z.string().trim().url("URL ảnh không hợp lệ"),
  alt: z.string().trim().optional(),
})

export const aboutSchema = z.object({
  images: z.array(aboutImageSchema).min(1, "About phải có ít nhất 1 ảnh"),
})

export type AboutFormData = z.infer<typeof aboutSchema>