import {
  getAboutUploadSignature,
  type AboutImage,
  type AboutPayload,
} from "@/api/about"
import { uploadFileToCloudinary } from "@/services/cloudinaryUpload.service"

export interface UploadProgressItem {
  fileName: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

export interface UploadAboutImagesParams {
  files: File[]
  onFileProgress?: (item: UploadProgressItem) => void
}

function buildAboutImageAlt(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "").trim()
  return withoutExtension || "about-image"
}

export async function uploadAboutImagesToCloudinary({
  files,
  onFileProgress,
}: UploadAboutImagesParams): Promise<AboutImage[]> {
  if (!files.length) return []

  const signature = await getAboutUploadSignature()
  const uploadedImages: AboutImage[] = []

  for (const file of files) {
    onFileProgress?.({ fileName: file.name, progress: 0, status: "uploading" })

    try {
      const secureUrl = await uploadFileToCloudinary({
        file,
        config: signature,
        onProgress: (progress) => {
          onFileProgress?.({ fileName: file.name, progress, status: "uploading" })
        },
      })

      uploadedImages.push({
        url: secureUrl,
        alt: buildAboutImageAlt(file.name),
      })

      onFileProgress?.({ fileName: file.name, progress: 100, status: "success" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload thất bại"
      onFileProgress?.({
        fileName: file.name,
        progress: 0,
        status: "error",
        error: message,
      })
      throw error
    }
  }

  return uploadedImages
}

export function buildAboutPayload(images: AboutImage[]): AboutPayload {
  return { images }
}
