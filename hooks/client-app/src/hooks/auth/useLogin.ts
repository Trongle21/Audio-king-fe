"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import type { LoginFormData } from "@/lib/schemas/auth.schema"

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement login API call với React Query
      console.log("Login attempt:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Xử lý response và redirect
      // router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
    error,
  }
}
