"use client"

import * as React from "react"

import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Input } from "./input"

interface SearchInputProps extends React.ComponentProps<"input"> {
  onSearch?: (value: string) => void
  searchButtonClassName?: string
  inputClassName?: string
}

function SearchInput({
  className,
  onSearch,
  searchButtonClassName,
  inputClassName,
  ...props
}: SearchInputProps) {
  const [value, setValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    onSearch?.(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <Input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Bạn cần tìm"
        className={cn("flex-1", inputClassName)}
        aria-label="Tìm kiếm sản phẩm"
        {...props}
      />
      <Button
        type="button"
        onClick={handleSearch}
        className={cn("shrink-0", searchButtonClassName)}
        aria-label="Tìm kiếm"
      >
        <Search className="size-4" />
      </Button>
    </div>
  )
}

export { SearchInput }
