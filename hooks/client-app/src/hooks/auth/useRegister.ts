"use client"

import type { RegisterFormData } from "@/lib/schemas/auth.schema"

import { useRegisterMutate } from "@/services/auth"


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

