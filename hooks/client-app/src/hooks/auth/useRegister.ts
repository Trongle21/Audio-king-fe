"use client"

import { useRegisterMutate } from "@/services/auth"

import type { RegisterFormData } from "@/lib/schemas/auth.schema"

export function useRegister() {
  const registerMutate = useRegisterMutate()

  const register = async (data: RegisterFormData) => {
    await registerMutate.mutateAsync(data)
  }

  return {
    register,
    isLoading: registerMutate.isPending,
    error: registerMutate.error?.message ?? null,
  }
}

