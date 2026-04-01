"use client"

import * as React from "react"

import {
  ChevronDown,
  Menu,
  PhoneCall,
  ShoppingCart,
  User,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { formatCurrency } from "@/lib"

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
] as const


const hotlines = [
  { label: "Tư vấn mua hàng: 0818808808", href: "tel:0818808808" },
  { label: "Kỹ thuật / bảo hành: 0987654321", href: "tel:0987654321" },
] as const


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [cartOpen, setCartOpen] = React.useState(false)
  const { items, totalItems, totalPrice } = useCart()
  const { handleSearch } = useSearch()
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

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
                <DropdownMenu open={cartOpen} onOpenChange={setCartOpen}>
                  <DropdownMenuTrigger asChild>
                    <div
                      id="cart-icon"
                      onMouseEnter={() => setCartOpen(true)}
                      onClick={(event) => {
                        event.preventDefault()
                        setCartOpen(false)
                        router.push("/cart")
                      }}
                      className={`cursor-pointer rounded-md transition-colors ${cartOpen ? "bg-white/15" : "hover:bg-white/15"
                        }`}
                    >
                      <IconButton
                        icon={<ShoppingCart className="size-5 text-white cursor-pointer" />}
                        label="Giỏ hàng"
                        showLabel={false}
                        badge={totalItems}
                        className="cursor-pointer text-white hover:bg-white/10"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-80 max-w-[90vw] sm:w-96 p-0"
                    onMouseEnter={() => setCartOpen(true)}
                    onMouseLeave={() => setCartOpen(false)}
                  >
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                      <p className="text-sm font-semibold">
                        Giỏ hàng ({totalItems})
                      </p>
                      {totalItems > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Tổng:{" "}
                          <span className="font-semibold text-destructive">
                            {formatCurrency(totalPrice)}
                          </span>
                        </p>
                      )}
                    </div>

                    {items.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-center text-muted-foreground">
                        Chưa có sản phẩm nào trong giỏ.
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto px-2 py-2 space-y-2">
                        {items.map((item) => (
                          <Link
                            key={item.productId}
                            href={`/product/${item.productId}`}
                            className="group flex gap-2 rounded-md bg-muted/60 p-2 hover:bg-muted cursor-pointer transition-colors"
                          >
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded">
                              {item.thumbnail ? (
                                <Image
                                  src={item.thumbnail}
                                  alt={item.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-slate-200" />
                              )}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <p className="line-clamp-2 text-xs font-medium group-hover:underline">
                                {item.name}
                              </p>
                              <div className="mt-1 flex items-center justify-between text-xs">
                                <span className="font-semibold text-destructive">
                                  {formatCurrency(item.price ?? 0)}
                                </span>
                                <span className="text-muted-foreground">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="border-t px-3 py-3">
                      <Link href="/cart" className="block">
                        <Button className="w-full bg-destructive text-white hover:bg-destructive/90">
                          Đặt hàng ngay
                        </Button>
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-white transition-colors hover:bg-white/15 data-[state=open]:bg-white/15 focus-visible:ring-0 focus-visible:border-transparent"
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden sm:inline-flex cursor-pointer text-white transition-colors hover:bg-white/15 data-[state=open]:bg-white/15 focus-visible:ring-0 focus-visible:border-transparent"
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
              <div className="flex items-center gap-2">
                <Link href="/gioi-thieu">
                  Giới thiệu
                </Link>
              </div>
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
