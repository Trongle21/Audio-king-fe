"use client"

import { useEffect, useState } from "react"

import { usePathname, useRouter } from "next/navigation"

import { getAccessToken } from "@/api"

interface Props {
  children: React.ReactNode
}

export function AdminAuthGate({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      const redirect = "/login"
      const search =
        pathname && pathname !== "/admin"
          ? `?redirect=${encodeURIComponent(pathname)}`
          : ""
      router.replace(`${redirect}${search}`)
      return
    }

    setIsReady(true)
  }, [pathname, router])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        < div className="text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập…</div>
      </div >
    )
  }

  return <>{children}</>
}

