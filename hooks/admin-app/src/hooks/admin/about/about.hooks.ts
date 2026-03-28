"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createAbout,
  deleteAbout,
  getAboutImages,
  updateAbout,
  type AboutImagesParams,
  type AboutPayload,
} from "@/api/about"

export const aboutQueryKeys = {
  all: ["about-images"] as const,
  list: (params: { page: number; limit: number }) => ["about-images", params] as const,
  detail: (id: string) => ["about", id] as const,
}

export function useAboutImages(params: AboutImagesParams) {
  const page = params.page ?? 1
  const limit = params.limit ?? 12

  return useQuery({
    queryKey: aboutQueryKeys.list({ page, limit }),
    queryFn: () => getAboutImages({ page, limit }),
    select: (response) => response.data,
  })
}

export function useCreateAbout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AboutPayload) => createAbout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
    },
  })
}

export function useUpdateAbout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AboutPayload> }) =>
      updateAbout(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteAbout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAbout(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.detail(id) })
    },
  })
}