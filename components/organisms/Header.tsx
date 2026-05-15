"use client"

import * as React from "react"

import {
  ShoppingCart
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { formatCurrency } from "@/lib"

import { Button } from "@/components/atoms/button"
import { IconButton } from "@/components/atoms/icon-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/organisms/dropdown-menu"
import { ProductHeaderSearch } from "@/components/organisms/ProductHeaderSearch"
import { useCart } from "@/hooks/client-app/src/hooks/cart"
import { useCategories } from "@/hooks/client-app/src/hooks/category"
import { useAuth } from "@/hooks/client-app/src/hooks/useAuth"
import { cn } from "@/lib/utils"


// const hotlines = [
//   { label: "Tư vấn mua hàng: 0986344085", href: "tel:0986344085" },
// ] as const


export default function Header() {
  // const [mobileMenuOpen, setMobileMenuOpen] = React.useState(true)
  const [cartOpen, setCartOpen] = React.useState(false)
  const [moreCategoriesOpen, setMoreCategoriesOpen] = React.useState(false)
  const { items, totalItems, totalPrice } = useCart()
  const { isAuthenticated: _isAuthenticated, logout: _logout } = useAuth()
  const router = useRouter()

  const { data: categoryData } = useCategories({ page: 1, limit: 100 })
  const allCategories = categoryData?.items ?? []
  const visibleCategories = allCategories.slice(0, 200)
  // const _moreCategories = allCategories.slice(200)

  // const visibleCategoriesMobile = allCategories.slice(0, 200)
  // const moreCategoriesMobile = allCategories.slice(200)

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-destructive text-white">
        {/* Row 1 */}
        <div className="border-b border-white/15 px-2">
          <div className="m-auto">
            <div className="flex items-center gap-2 py-1.5 md:py-3">
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
                </div>
                <span className="hidden lg:inline text-[10px] opacity-85">
                  TRUNG TÂM PHÂN PHỐI CHÍNH HÃNG
                </span>
              </Link>

              {/* Desktop/Tablet: Category + Search inline */}
              <div className="hidden md:flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0 max-w-3xl">
                  <ProductHeaderSearch
                    placeholder="Bạn tìm thiết bị âm thanh gì?"
                    className="w-full"
                    inputClassName="bg-white text-black placeholder:text-muted-foreground border-0 rounded-md focus-visible:ring-0"
                    searchButtonClassName="bg-white text-destructive hover:bg-white/90 border border-white/20 rounded-md"
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
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="line-through">{formatCurrency(totalPrice + Math.round(totalPrice * 0.1))}</span>
                          <span className="font-semibold text-destructive">
                            {formatCurrency(totalPrice)}
                          </span>
                        </div>
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
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-destructive">
                                    {formatCurrency(item.price ?? 0)}
                                  </span>
                                  <span className="text-muted-foreground line-through text-[10px]">
                                    {formatCurrency(Math.round((item.price ?? 0) * 1.1))}
                                  </span>
                                </div>
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
                          Xem giỏ hàng
                        </Button>
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>


                <div className="flex items-center gap-2 shrink-0 px-2 py-1 bg-white rounded-md">
                  <Link href="/gioi-thieu" className="text-black font-bold text-[14px]">
                    Giới thiệu
                  </Link>
                </div>

                {/* 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="inline-flex cursor-pointer text-white transition-colors hover:bg-white/15 data-[state=open]:bg-white/15 focus-visible:ring-0 focus-visible:border-transparent"
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
                        <div className="cursor-pointer">
                          {h.label}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu> */}

                {/* Mobile menu toggle */}
                {/* <Button
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
                </Button> */}
              </div>
            </div>

            {/* Mobile: Search row full width */}
            <div className={cn("md:hidden pb-3 w-full")}>
              <ProductHeaderSearch
                placeholder="Bạn tìm thiết bị âm thanh gì?"
                className="w-full"
                inputClassName="w-full bg-white text-black placeholder:text-muted-foreground border-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Categories (md+) */}
        <nav
          className="block"
          role="navigation"
          aria-label="Chuyên mục"
        >
          <div className="px-1 md:container">
            <div className="flex items-center gap-3">
              {/* Categories with horizontal scroll + fade gradient */}
              <div className="relative flex-1 min-w-0">
                <div
                  className="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-1.5 pr-10
                  [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]"
                >
                  {visibleCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/product?categoryId=${encodeURIComponent(c._id)}`}
                      className="flex-shrink-0 px-0.5 py-1 md:px-3 md:py-2 text-[12px] md:text-sm font-semibold hover:bg-white/10 rounded-md transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}

                </div>
                {/* Fade gradient on right edge */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-destructive to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile category panel */}
        {/* <div
          className="md:hidden overflow-hidden border-t border-white/15 bg-destructive/95 transition-all duration-300 ease-in-out"
          style={{
            maxHeight: mobileMenuOpen ? "50vh" : "0",
          }}
        >
          <nav role="navigation" aria-label="Danh mục">
            <div className="max-h-[50vh] overflow-y-auto">
              <div className="relative flex items-center gap-1 overflow-x-auto whitespace-nowrap py-1.5 pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden]">
                {visibleCategoriesMobile.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/product?categoryId=${encodeURIComponent(c._id)}`}
                    className="flex-shrink-0 rounded-md px-2 py-1 md:py-2 text-[12px] md:text-sm font-medium text-center hover:bg-white/10 transition-colors truncate"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}

                {moreCategoriesMobile.length > 0 && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setMoreCategoriesOpen(true)
                    }}
                    className="flex-shrink-0 rounded-md px-2 py-1 md:py-2 text-sm font-medium text-center hover:bg-white/10 transition-colors truncate flex items-center justify-center gap-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Xem thêm
                  </button>
                )}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-destructive to-transparent pointer-events-none" />
              </div>
            </div>
          </nav>
        </div> */}


        {/* Dropdown: More Categories (Desktop) */}
        {moreCategoriesOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMoreCategoriesOpen(false)}
            />
            {/* Dropdown */}
            <div className="absolute left-0 right-0 z-50 bg-white shadow-xl border-t border-black/10">
              <div className="container py-4">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                  {allCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/product?categoryId=${encodeURIComponent(c._id)}`}
                      onClick={() => setMoreCategoriesOpen(false)}
                      className="rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm font-medium text-center text-black hover:bg-muted transition-colors truncate"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}
