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
    images: AboutImage[]
    pagination: AboutImagesPagination
    page: number
    setPage: (p: number) => void
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
}

type SanitizedData = {
    images: AboutImage[]
    pagination: AboutImagesPagination
}

function normalizeError(error: unknown): string {
    if (error instanceof Error && error.message.trim())
        return error.message.trim()
    return ABOUT_ERROR_MESSAGE
}

function sanitizeData(
    response?:
        | ApiSuccessResponse<AboutImagesData>
        | AboutImagesData
        | AboutDocument[]
): SanitizedData {
    if (!response) return { images: [], pagination: defaultPagination }

    let documents: AboutDocument[] = []
    let pagination: AboutImagesPagination = defaultPagination

    if ("data" in response) {
        const inner = response.data
        if (Array.isArray(inner)) {
            documents = inner
        } else if ("items" in inner) {
            documents = inner.items ?? []
            pagination = inner.pagination ?? defaultPagination
        } else {
            documents = inner as AboutDocument[]
        }
    } else if (Array.isArray(response)) {
        documents = response
    } else if ("items" in response) {
        documents = response.items ?? []
        pagination = response.pagination ?? defaultPagination
    } else {
        documents = response as AboutDocument[]
    }

    const images: AboutImage[] = documents
        .flatMap((doc) => doc.images ?? [])
        .filter((img) => Boolean(img?.url?.trim()))
        .map((img) => ({
            url: img.url.trim(),
            alt: img.alt?.trim() || "about-image",
        }))

    if (pagination.total === 0) {
        pagination.total = images.length
    }

    return { images, pagination }
}

export function useAboutImages(
    initialPage = 1,
    initialLimit = 12
): UseAboutImagesResult {
    const [page, setPage] = useState(Math.max(1, initialPage))

    const {
        data,
        isLoading,
        error,
        refetch: queryRefetch,
    } = useQuery<AboutImagesData>({
        queryKey: ["client-about-images", page, initialLimit],
        queryFn: () => getAboutImages({ page, limit: initialLimit }),
    })

    console.log(data, "data")

    const sanitized = useMemo(() => sanitizeData(data), [data])

    console.log(sanitized, "sanitized")

    return {
        images: sanitized.images,
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
