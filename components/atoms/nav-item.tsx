"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItemProps extends React.ComponentProps<"a"> {
  href: string
  icon?: React.ReactNode
  children: React.ReactNode
  active?: boolean
}

function NavItem({
  href,
  icon,
  children,
  active,
  className,
  ...props
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 rounded-md",
        active && "bg-white/20",
        className
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  )
}

export { NavItem }
