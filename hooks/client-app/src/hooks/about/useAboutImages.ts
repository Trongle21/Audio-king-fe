"use client"

import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import {
  getAboutImages,
  type AboutImage,
  type AboutImagesData,
  type AboutImagesPagination,
} from "@/api/about"

const ABOUT_ERROR_MESSAGE = "Khong the tai anh gioi thieu"

const defaultPagination: AboutImagesPagination = {
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
}

type UseAboutImagesResult = {
  items: AboutImage[]
  pagination: AboutImagesPagination
  page: number
  setPage: (p: number) => void
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

function normalizeError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  return ABOUT_ERROR_MESSAGE
}

function sanitizeData(data?: AboutImagesData): AboutImagesData {
  if (!data) return { items: [], pagination: defaultPagination }

  const items = (data.items ?? [])
    .filter((item) => Boolean(item?.url?.trim()))
    .map((item) => ({
      url: item.url.trim(),
      alt: item.alt?.trim() || "about-image",
    }))

  const pagination = {
    total: data.pagination?.total ?? items.length,
    page: data.pagination?.page ?? 1,
    limit: data.pagination?.limit ?? 12,
    totalPages: Math.max(1, data.pagination?.totalPages ?? 1),
  }

  return { items, pagination }
}

export function useAboutImages(
  initialPage = 1,
  initialLimit = 12,
): UseAboutImagesResult {
  const [page, setPage] = useState(Math.max(1, initialPage))

  const { data, isLoading, error, refetch: queryRefetch } = useQuery({
    queryKey: ["client-about-images", page, initialLimit],
    queryFn: () => getAboutImages({ page, limit: initialLimit }),
  })

  const sanitized = useMemo(() => sanitizeData(data), [data])

  return {
    items: sanitized.items,
    pagination: sanitized.pagination,
    page,
    setPage: (nextPage) => setPage(Math.max(1, nextPage)),
    isLoading,
    error: error ? normalizeError(error) : null,
    refetch: async () => {
      await queryRefetch()
    },
  }
}

