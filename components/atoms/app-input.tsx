
import { Input } from "./input"
import { Label } from "./label"

import { cn } from "@/lib/utils"

type AppInputProps = {
  id: string
  label: string
  placeholder?: string
  error?: string
  className?: string
} & Omit<React.ComponentProps<typeof Input>, "id" | "placeholder">

export function AppInput({
  id,
  label,
  placeholder,
  error,
  className,
  ...props
}: AppInputProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
