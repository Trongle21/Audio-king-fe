"use client"

import {
  addAboutImages,
  createAboutSingleton,
  deleteAboutImages,
  replaceAboutImages,
  updateAboutById,
} from "@/api/about"
import { SingletonMediaAdmin } from "@/components/admin/media/SingletonMediaAdmin"
import { useAboutSingleton } from "@/hooks/admin-app/src/hooks/admin/about"

export default function AboutAdminPage() {
  const { doc, images, isLoading, error, refetch } = useAboutSingleton()

  return (
    <SingletonMediaAdmin
      moduleTitle="Quản lý About"
      doc={doc}
      images={images}
      isLoading={isLoading}
      error={error}
      onRefetch={refetch}
      onCreateOrAdd={async (files, currentDoc) => {
        if (!currentDoc) {
          await createAboutSingleton(files)
          return
        }

        await addAboutImages(files)
      }}
      onReplace={async (indices, files, currentDoc) => {
        if (!currentDoc) return

        if (indices.length === currentDoc.images.length) {
          await updateAboutById(currentDoc._id, files)
          return
        }

        await replaceAboutImages(indices, files)
      }}
      onDelete={async (payload, currentDoc) => {
        if (!currentDoc) return
        await deleteAboutImages(payload)
      }}
    />
  )
}
