import { z } from "zod"

// About detail (GET /about...) items
export const aboutImageSchema = z.object({
  url: z.string().trim().url("URL ảnh không hợp lệ"),
  alt: z.string().trim().optional(),
})

const isFileList = (value: unknown): value is FileList =>
  typeof FileList !== "undefined" && value instanceof FileList

const isFileArray = (value: unknown): value is File[] =>
  Array.isArray(value) && value.every((item) => item instanceof File)

// About create/update (upload như banner): upload nhiều ảnh, FE upload ảnh và gửi file lên BE.
export const aboutSchema = z.object({
  files: z
    .custom<File[] | FileList>((value) => isFileArray(value) || isFileList(value), {
      message: "Vui lòng chọn ít nhất 1 ảnh about",
    })
    .transform((value) => (Array.isArray(value) ? value : Array.from(value)))
    .refine((files) => files.length > 0, "About phải có ít nhất 1 ảnh upload")
    .refine((files) => files.every((file) => file.type.startsWith("image/")), "Chỉ chấp nhận file ảnh"),
})

export type AboutFormData = z.infer<typeof aboutSchema>