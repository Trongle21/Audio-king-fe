"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createBanner,
  deleteBanner,
  getBannerById,
  getBanners,
  updateBanner,
  type BannerPayload,
} from "@/api/banner"

export const bannerQueryKeys = {
  all: ["banners"] as const,
  list: () => ["banners"] as const,
  detail: (id: string) => ["banner", id] as const,
}

export function useBanners() {
  return useQuery({
    queryKey: bannerQueryKeys.list(),
    queryFn: getBanners,
    select: (response) => response.data,
  })
}

export function useBannerDetail(id?: string) {
  return useQuery({
    queryKey: bannerQueryKeys.detail(id ?? ""),
    queryFn: () => getBannerById(id ?? ""),
    enabled: Boolean(id),
    select: (response) => response.data,
  })
}

export function useCreateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BannerPayload) => createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all })
    },
  })
}

export function useUpdateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BannerPayload> }) =>
      updateBanner(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.detail(variables.id) })
    },
  })
}

export function useDeleteBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.detail(id) })
    },
  })
}
