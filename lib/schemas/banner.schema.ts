import { z } from "zod"

const isFileList = (value: unknown): value is FileList =>
  typeof FileList !== "undefined" && value instanceof FileList

const isFileArray = (value: unknown): value is File[] =>
  Array.isArray(value) && value.every((item) => item instanceof File)

const filesField = z
  .custom<File[] | FileList>((value) => isFileArray(value) || isFileList(value), {
    message: "Vui lòng chọn ảnh hợp lệ",
  })
  .transform((value) => (Array.isArray(value) ? value : Array.from(value)))
  .refine(
    (files) => files.every((file) => file.type.startsWith("image/")),
    "Chỉ chấp nhận file ảnh",
  )

export const bannerSchema = z.object({
  files: filesField.refine((files) => files.length > 0, "Banner phải có ít nhất 1 ảnh upload"),
})

export const bannerEditSchema = z.object({
  files: filesField,
  keptExistingImageUrls: z.array(z.string().min(1)).default([]),
})

export type BannerFormData = z.infer<typeof bannerSchema>
export type BannerEditFormData = z.infer<typeof bannerEditSchema>