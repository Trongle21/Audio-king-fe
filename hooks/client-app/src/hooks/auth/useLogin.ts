"use client"

import { useLoginMutate } from "@/services/auth"

import type { LoginFormData } from "@/lib/schemas/auth.schema"

export function useLogin() {
  const loginMutate = useLoginMutate()

  const login = async (data: LoginFormData) => {
    await loginMutate.mutateAsync(data)
  }

  return {
    login,
    isLoading: loginMutate.isPending,
    error: loginMutate.error?.message ?? null,
  }
}
