"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addAboutImages,
  createAbout,
  deleteAbout,
  deleteAboutImage,
  getAboutById,
  getAboutImages,
  updateAbout,
  updateAboutImage,
  type AboutImageMutationPayload,
  type AboutImagesParams,
  type AboutMutationPayload,
} from "@/api/about";

export const aboutQueryKeys = {
  all: ["about-list"] as const,
  list: (params: { page: number; limit: number }) => ["about-list", params] as const,
  detail: (id: string) => ["about-detail", id] as const,
}

export function useAboutImages(params: AboutImagesParams) {
  const page = params.page ?? 1
  const limit = params.limit ?? 12

  return useQuery({
    queryKey: aboutQueryKeys.list({ page, limit }),
    queryFn: () => getAboutImages({ page, limit }),
  })
}

export function useAboutDetail(id?: string) {
  return useQuery({
    queryKey: aboutQueryKeys.detail(id ?? ""),
    queryFn: async () => {
      const response = await getAboutById(id ?? "")
      return response.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateAbout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AboutMutationPayload) => createAbout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
    },
  })
}

export function useUpdateAbout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: AboutMutationPayload
    }) => updateAbout(id, payload),
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

export function useAddAboutImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AboutMutationPayload }) =>
      addAboutImages(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.detail(variables.id) })
    },
  })
}

export function useUpdateAboutImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      imageIndex,
      payload,
    }: {
      id: string
      imageIndex: number
      payload: AboutImageMutationPayload
    }) => updateAboutImage(id, imageIndex, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteAboutImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, imageIndex }: { id: string; imageIndex: number }) =>
      deleteAboutImage(id, imageIndex),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.detail(variables.id) })
    },
  })
}
