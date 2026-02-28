"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  // Khởi tạo isLoading = false ngay từ đầu thay vì setState trong effect
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // TODO: Kiểm tra authentication state
    // Nếu cần set loading state, nên làm trong callback của async operation
  }, [])

  const login = async (email: string, password: string) => {
    // TODO: Implement login logic
    console.log("Login:", { email, password })
  }

  const logout = () => {
    setUser(null)
    // TODO: Clear auth tokens
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
