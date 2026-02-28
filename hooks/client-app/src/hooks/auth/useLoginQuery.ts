"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import type { LoginFormData } from "@/lib/schemas/auth.schema"

// API function (sẽ được thay thế bằng API call thực tế)
async function loginAPI(data: LoginFormData) {
  // TODO: Thay thế bằng API call thực tế
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Đăng nhập thất bại")
  }

  return response.json()
}

export function useLoginQuery() {
  const router = useRouter()

  return useMutation({
    mutationFn: loginAPI,
    onSuccess: () => {
      // Redirect sau khi đăng nhập thành công
      router.push("/")
    },
    onError: (error) => {
      console.error("Login error:", error)
    },
  })
}
