"use client"

import { useMutation } from "@tanstack/react-query"

import {
  uploadAboutImagesToCloudinary,
  type UploadAboutImagesParams,
} from "@/services/about.service"

export function useAboutCloudinaryUpload() {
  return useMutation({
    mutationFn: ({ files, onFileProgress }: UploadAboutImagesParams) =>
      uploadAboutImagesToCloudinary({ files, onFileProgress }),
  })
}
