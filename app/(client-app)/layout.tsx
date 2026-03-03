"use client"

import { usePathname } from "next/navigation"

import Footer from "@/components/organisms/Footer"
import Header from "@/components/organisms/Header"
import { ZaloFloatingButton } from "@/components/organisms/ZaloFloatingButton"

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Ẩn Header/Footer cho các route xác thực (thuộc nhóm (auth))
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <ZaloFloatingButton />
      <Footer />
    </>
  )
}
