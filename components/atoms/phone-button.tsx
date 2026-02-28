"use client"

import * as React from "react"

import { Phone } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./button"

interface PhoneButtonProps extends React.ComponentProps<"button"> {
  phone: string
  label?: string
}

function PhoneButton({
  phone,
  label = "Tư vấn mua hàng",
  className,
  ...props
}: PhoneButtonProps) {
  const handleClick = () => {
    window.location.href = `tel:${phone}`
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={cn(
        "flex flex-col items-start gap-1 h-auto py-2 px-3",
        className
      )}
      aria-label={`${label}: ${phone}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Phone className="size-4 text-destructive" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold">{phone}</span>
    </Button>
  )
}

export { PhoneButton }
