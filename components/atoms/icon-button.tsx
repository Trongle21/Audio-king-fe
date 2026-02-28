"use client"

import * as React from "react"
import Link from "next/link"
import { Button, type ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode
  label: string
  href?: string
  showLabel?: boolean
  badge?: number
}

function IconButton({
  icon,
  label,
  href,
  showLabel = true,
  badge,
  className,
  ...props
}: IconButtonProps) {
  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      {showLabel && <span className="text-sm">{label}</span>}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  )

  const button = (
    <Button
      variant="ghost"
      className={cn("relative flex items-center gap-2", className)}
      aria-label={label}
      asChild={!!href}
      {...props}
    >
      {href ? (
        <Link href={href} aria-label={label}>
          {content}
        </Link>
      ) : (
        content
      )}
    </Button>
  )

  return button
}

export { IconButton }
