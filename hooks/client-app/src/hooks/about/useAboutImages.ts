"use client"

import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"

import {
  getAboutImages,
  type AboutDocument,
  type AboutImage,
  type AboutImagesData,
  type AboutImagesPagination,
  type ApiSuccessResponse,
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

type SanitizedData = {
  items: AboutImage[]
  pagination: AboutImagesPagination
}

function normalizeError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  return ABOUT_ERROR_MESSAGE
}

function toAboutImagesData(
  input?: ApiSuccessResponse<AboutImagesData> | AboutImagesData,
): AboutImagesData {
  if (!input) return { items: [], pagination: defaultPagination }
  if ((input as ApiSuccessResponse<AboutImagesData>).data) {
    return (input as ApiSuccessResponse<AboutImagesData>).data as AboutImagesData
  }
  return input as AboutImagesData
}

function sanitizeData(
  response?: ApiSuccessResponse<AboutImagesData> | AboutImagesData,
): SanitizedData {
  if (!response) return { items: [], pagination: defaultPagination }

  const data = toAboutImagesData(response)
  const documents: AboutDocument[] = data.items ?? []

  const items: AboutImage[] = documents
    .flatMap((doc) => doc.images ?? [])
    .filter((img) => Boolean(img?.url?.trim()))
    .map((img) => ({
      url: img.url.trim(),
      alt: img.alt?.trim() || "about-image",
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

  const { data, isLoading, error, refetch: queryRefetch } = useQuery<AboutImagesData>({
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

