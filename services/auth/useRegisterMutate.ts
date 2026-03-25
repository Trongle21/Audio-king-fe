"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { register, type LoginResponse } from "@/api/auth"
import { useAppDispatch } from "@/lib/store/hooks"
import { setAuth } from "@/lib/store/slices/authSlice"

import type { RegisterFormData } from "@/lib/schemas/auth.schema"

export function useRegisterMutate() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  return useMutation<LoginResponse, Error, RegisterFormData>({
    mutationFn: register,
    onSuccess: (data) => {
      dispatch(
        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user ?? undefined,
        }),
      )
      router.push("/admin")
    },
  })
}

