"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getAdminUsers,
  normalizeUsersQuery,
  restoreAdminUser,
  softDeleteAdminUser,
  updateAdminUser,
  type AdminUsersQueryParams,
  type UpdateAdminUserPayload,
} from "@/services/adminUser.service"

export const adminUsersQueryKeys = {
  all: ["admin-users"] as const,
  list: (params: AdminUsersQueryParams) => ["admin-users", normalizeUsersQuery(params)] as const,
}

export function useAdminUsers(params: AdminUsersQueryParams) {
  const normalized = normalizeUsersQuery(params)

  return useQuery({
    queryKey: adminUsersQueryKeys.list(normalized),
    queryFn: () => getAdminUsers(normalized),
    select: (response) => response.data,
  })
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminUserPayload }) =>
      updateAdminUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}

export function useSoftDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => softDeleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}

export function useRestoreAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => restoreAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}
