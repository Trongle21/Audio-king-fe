"use client"

import {
  addBannerImages,
  createBannerSingleton,
  deleteBannerImages,
  replaceBannerImages,
  updateBannerById,
} from "@/api/banner"
import { SingletonMediaAdmin } from "@/components/admin/media/SingletonMediaAdmin"
import { useBannerSingleton } from "@/hooks/admin-app/src/hooks/admin/banner"

export default function BannerAdminPage() {
  const { doc, images, isLoading, error, refetch } = useBannerSingleton()

  return (
    <SingletonMediaAdmin
      moduleTitle="Quản lý Banner"
      doc={doc}
      images={images}
      isLoading={isLoading}
      error={error}
      onRefetch={refetch}
      onCreateOrAdd={async (files, currentDoc) => {
        if (!currentDoc) {
          await createBannerSingleton(files)
          return
        }

        await addBannerImages(files)
      }}
      onReplace={async (indices, files, currentDoc) => {
        if (!currentDoc) return

        if (indices.length === currentDoc.images.length) {
          await updateBannerById(currentDoc._id, files)
          return
        }

        await replaceBannerImages(indices, files)
      }}
      onDelete={async (payload, currentDoc) => {
        if (!currentDoc) return
        await deleteBannerImages(payload)
      }}
    />
  )
}
