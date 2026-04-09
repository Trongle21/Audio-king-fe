"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { MediaImage, SingletonDoc } from "@/types/media"

import { getAboutSingleton } from "@/api/about"

type UseAboutSingletonState = {
  doc: SingletonDoc | null
  isLoading: boolean
  error: string | null
}

function getErrorMessage(error: unknown) {
  const maybeAxiosLike = error as { response?: { data?: { message?: string } } }
  if (maybeAxiosLike?.response?.data?.message) return maybeAxiosLike.response.data.message
  if (error instanceof Error && error.message) return error.message
  return "Co loi xay ra, vui long thu lai"
}

export function useAboutSingleton() {
  const [state, setState] = useState<UseAboutSingletonState>({
    doc: null,
    isLoading: true,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const doc = await getAboutSingleton()
      setState({ doc, isLoading: false, error: null })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: getErrorMessage(error),
      }))
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const images: MediaImage[] = useMemo(() => state.doc?.images ?? [], [state.doc])

  return {
    doc: state.doc,
    images,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
  }
}
