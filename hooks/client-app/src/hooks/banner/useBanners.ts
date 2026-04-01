"use client"

import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"

import { getBanners, type Banner, type BannerImage } from "@/api/banner"

const BANNER_FALLBACK_ERROR = "Khong the tai banner"

export type UseBannersResult = {
  banners: Banner[]
  slides: BannerImage[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

function normalizeError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  return BANNER_FALLBACK_ERROR
}

export function useBanners(): UseBannersResult {
  const { data, isLoading, error, refetch: reactQueryRefetch } = useQuery({
    queryKey: ["client-banners"],
    queryFn: getBanners,
  })

  const banners = useMemo(() => data ?? [], [data])

  const slides = useMemo(
    () =>
      banners.flatMap((banner) =>
        (banner.images ?? []).filter(
          (image): image is BannerImage =>
            Boolean(image) && typeof image.url === "string" && image.url.trim().length > 0,
        ),
      ),
    [banners],
  )

  const normalizedError = error ? normalizeError(error) : null

  return {
    banners,
    slides,
    isLoading,
    error: normalizedError,
    refetch: async () => {
      await reactQueryRefetch()
    },
  }
}

