"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "./button"

type Language = "vi" | "en"

interface LanguageSelectorProps {
  currentLanguage?: Language
  onLanguageChange?: (lang: Language) => void
  className?: string
}

function LanguageSelector({
  currentLanguage = "vi",
  onLanguageChange,
  className,
}: LanguageSelectorProps) {
  const handleLanguageChange = (lang: Language) => {
    onLanguageChange?.(lang)
  }

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label="Language selector"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleLanguageChange("vi")}
        className={cn("size-8 p-0", currentLanguage === "vi" && "bg-accent")}
        aria-label="Tiếng Việt"
        aria-pressed={currentLanguage === "vi"}
      >
        <span className="text-lg">🇻🇳</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleLanguageChange("en")}
        className={cn("size-8 p-0", currentLanguage === "en" && "bg-accent")}
        aria-label="English"
        aria-pressed={currentLanguage === "en"}
      >
        <span className="text-lg">🇬🇧</span>
      </Button>
    </div>
  )
}

export { LanguageSelector }
