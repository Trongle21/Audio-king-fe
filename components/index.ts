// Export tất cả components theo Atomic Design
export * from "./atoms"
export * from "./molecules"

// Export organisms nhưng loại trừ Header và Footer (vì chúng là default exports)
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "./organisms"

// Export Header và Footer riêng
export { Footer, Header } from "./organisms"

// Re-export từ ui để tương thích với shadcn
export * from "./ui/avatar"
export * from "./ui/badge"
export * from "./ui/button"
export * from "./ui/card"
export * from "./ui/dialog"
export * from "./ui/dropdown-menu"
export * from "./ui/input"
export * from "./ui/label"
export * from "./ui/select"
export * from "./ui/separator"
export * from "./ui/skeleton"
export * from "./ui/textarea"
