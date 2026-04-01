"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/api/banner"

export const bannerQueryKeys = {
  all: ["banners"] as const,
  list: () => ["banners"] as const,
}

export function useBanners() {
  return useQuery({
    queryKey: bannerQueryKeys.list(),
    queryFn: getBanners,
  })
}

export function useCreateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => createBanner(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all })
    },
  })
}

export function useUpdateBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateBanner(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all })
    },
  })
}

export function useDeleteBanner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all })
    },
  })
}
