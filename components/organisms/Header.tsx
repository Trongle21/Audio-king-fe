"use client"

import * as React from "react"

import {
  ChevronDown,
  MapPin,
  Menu,
  Percent,
  PhoneCall,
  ShoppingCart,
  User,
  X,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/atoms/button"
import { IconButton } from "@/components/atoms/icon-button"
import { SearchInput } from "@/components/atoms/search-input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu"
import { useCart } from "@/hooks/client-app/src/hooks/cart"
import { useSearch } from "@/hooks/client-app/src/hooks/search"
import { useAuth } from "@/hooks/client-app/src/hooks/useAuth"


const primaryCategories = [
  { key: "loa-keo", label: "Loa Kéo" },
  { key: "loa-karaoke", label: "Loa Karaoke" },
  { key: "dan-karaoke", label: "Dàn Karaoke" },
  { key: "micro", label: "Micro" },
  { key: "cuc-day", label: "Cục Đẩy" },
  { key: "vang", label: "Vang" },
  { key: "loa-bluetooth", label: "Loa Bluetooth" },
  { key: "cong-trinh-thuc-te", label: "Công Trình Thực Tế" },
  { key: "ho-so-nang-luc", label: "Hồ Sơ Năng Lực" },
  { key: "tin-tuc", label: "Tin Tức" },
] as const

const showrooms = [
  { label: "Hà Nội", href: "/showrooms/ha-noi" },
  { label: "TP. Hồ Chí Minh", href: "/showrooms/tp-hcm" },
  { label: "Đà Nẵng", href: "/showrooms/da-nang" },
] as const

const hotlines = [
  { label: "Tư vấn mua hàng: 0818808808", href: "tel:0818808808" },
  { label: "Kỹ thuật / bảo hành: 0987654321", href: "tel:0987654321" },
] as const

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { totalItems } = useCart()
  const { handleSearch } = useSearch()
  const { isAuthenticated, logout } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-destructive text-white">
        {/* Row 1 */}
        <div className="border-b border-white/15 px-2">
          <div className="m-auto">
            <div className="flex items-center gap-2 py-2.5 md:py-3">
              {/* Logo (keep branding) */}
              <Link
                href="/"
                className="flex flex-col shrink-0 leading-tight"
                aria-label="FE-Audio - Về trang chủ"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight">
                    FE-Audio
                  </span>
                  <span className="hidden sm:inline text-xs md:text-sm font-semibold opacity-95">
                    ONLINE STORE
                  </span>
                </div>
                <span className="hidden lg:inline text-[10px] opacity-85">
                  TRUNG TÂM PHÂN PHỐI CHÍNH HÃNG
                </span>
              </Link>

              {/* Desktop/Tablet: Category + Search inline */}
              <div className="hidden md:flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0 max-w-3xl">
                  <SearchInput
                    onSearch={handleSearch}
                    placeholder="Bạn tìm thiết bị âm thanh gì?"
                    className="w-full"
                    inputClassName="bg-white text-black placeholder:text-muted-foreground border-0 rounded-md rounded-r-none focus-visible:ring-0"
                    searchButtonClassName="bg-white text-destructive hover:bg-white/90 border border-white/20 rounded-md rounded-l-none"
                  />
                </div>
              </div>

              {/* Right actions */}
              <div className="ml-auto flex items-center gap-1.5 shrink-0">
                <IconButton
                  icon={<ShoppingCart className="size-5 text-white" />}
                  label="Giỏ hàng"
                  href="/cart"
                  showLabel={false}
                  badge={totalItems}
                  className="text-white hover:bg-white/10"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      aria-label="Tài khoản"
                    >
                      <User className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isAuthenticated ? (
                      <DropdownMenuItem asChild>
                        <Link href="/login">Đăng nhập</Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/account/change-password">
                            Đổi mật khẩu
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault()
                            logout()
                          }}
                        >
                          Đăng xuất
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  className="hidden lg:inline-flex text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/tra-gop" aria-label="Trả góp">
                    <Percent className="size-5" />
                    Trả góp
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden sm:inline-flex text-white hover:bg-white/10"
                      aria-label="Hotline"
                    >
                      <PhoneCall className="size-5" />
                      Hotline <ChevronDown className="size-4 opacity-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[18rem]">
                    <DropdownMenuLabel>Hotline</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {hotlines.map((h) => (
                      <DropdownMenuItem key={h.href} asChild>
                        <a href={h.href} className="cursor-pointer">
                          {h.label}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  className="md:hidden text-white hover:bg-white/10"
                  aria-label="Mở danh mục"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X className="size-6" />
                  ) : (
                    <Menu className="size-6" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile: Search row full width */}
            <div className="md:hidden pb-3 w-full">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Bạn tìm thiết bị âm thanh gì?"
                className="w-full"
                inputClassName="w-full bg-white text-black placeholder:text-muted-foreground border-0 rounded-md rounded-r-none focus-visible:ring-0"
                searchButtonClassName="bg-white text-destructive hover:bg-white/90 border border-white/20 rounded-md rounded-l-none"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Categories + Showroom (md+) */}
        <nav
          className="hidden md:block"
          role="navigation"
          aria-label="Chuyên mục"
        >
          <div className="container">
            <div className="flex items-center gap-3">
              <div
                className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto whitespace-nowrap py-1.5
                [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {primaryCategories.map((c) => (
                  <Link
                    key={c.key}
                    href={`/product?category=${encodeURIComponent(c.key)}`}
                    className="px-3 py-2 text-sm font-semibold hover:bg-white/10 rounded-md"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="shrink-0 text-white hover:bg-white/10"
                    aria-label="Showroom toàn quốc"
                  >
                    <MapPin className="size-4" />
                    <span className="hidden lg:inline">
                      18 showroom toàn quốc
                    </span>
                    <span className="lg:hidden">Showroom</span>
                    <ChevronDown className="size-4 opacity-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuLabel>Showroom</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {showrooms.map((s) => (
                    <DropdownMenuItem key={s.href} asChild>
                      <Link href={s.href}>{s.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/showrooms">Xem tất cả showroom</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        {/* Mobile category panel */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden border-t border-white/15 bg-destructive/95"
            role="navigation"
            aria-label="Danh mục"
          >
            <div className="py-2">
              <div className="grid grid-cols-2 gap-1">
                {primaryCategories.map((c) => (
                  <Link
                    key={c.key}
                    href={`/product?category=${encodeURIComponent(c.key)}`}
                    className="min-w-48 rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
