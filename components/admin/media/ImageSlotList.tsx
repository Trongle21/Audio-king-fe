"use client"

import Image from "next/image"

import type { MediaImage } from "@/types/media"

interface ImageSlotListProps {
  images: MediaImage[]
  selectedIndices: number[]
  onToggleIndex: (index: number) => void
}

export function ImageSlotList({ images, selectedIndices, onToggleIndex }: ImageSlotListProps) {
  if (images.length === 0) {
    return (
      <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-500">
        Chưa có ảnh nào!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {images.map((image, index) => {
        const isSelected = selectedIndices.includes(index)

        return (
          <label
            key={`${image.url}-${index}`}
            className={`cursor-pointer space-y-2 rounded-lg border p-3 ${isSelected ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
              }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Vị trí: {index}</span>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleIndex(index)}
                className="h-4 w-4"
              />
            </div>

            <Image
              src={image.url}
              alt={image.alt || `image-${index + 1}`}
              width={280}
              height={140}
              unoptimized
              className="h-36 w-full rounded-md border object-cover"
            />
          </label>
        )
      })}
    </div>
  )
}
