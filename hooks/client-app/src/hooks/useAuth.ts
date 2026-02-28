"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Kiểm tra authentication state
    setIsLoading(false)
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
