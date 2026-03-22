"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type AdminMenuItem = {
  href: string
  label: string
}

export function AdminSidebarNav({ items }: { items: AdminMenuItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1" aria-label="Admin sidebar">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "block cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                : "block cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            }
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
