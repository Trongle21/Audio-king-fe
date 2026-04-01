"use client"

import * as React from "react"

import Link from "next/link"
import { useParams } from "next/navigation"

import type { Product, ProductCategoryRef } from "@/api/product"

import { Button } from "@/components/atoms"
import { ProductImageGallery } from "@/components/organisms/ProductImageGallery"
import { useCart } from "@/hooks/client-app/src/hooks/cart"
import { useProduct } from "@/hooks/client-app/src/hooks/product/useProduct"

const FALLBACK_ERROR_MESSAGE = "Có lỗi xảy ra, vui lòng thử lại."

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim()
  return FALLBACK_ERROR_MESSAGE
}

function formatVnd(n: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`
}

function collectGalleryUrls(product: Product): string[] {
  const urls: string[] = []
  const t = product.thumbnail
  const thumbUrl = typeof t === "string" ? t : t?.url
  if (thumbUrl) urls.push(thumbUrl)
  if (product.images?.length) {
    for (const img of product.images) {
      if (img.url && !urls.includes(img.url)) urls.push(img.url)
    }
  }
  return urls.length ? urls : ["/file.svg"]
}

function renderCategories(categories: string[] | ProductCategoryRef[]): string {
  if (!categories || categories.length === 0) return "Không có danh mục"
  if (typeof categories[0] === "string") return (categories as string[]).join(", ")
  return (categories as ProductCategoryRef[]).map((c) => c.name).join(", ")
}

function BuyingInfo({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const hasDiscount =
    product.sale !== undefined && product.sale < product.price && product.sale >= 0
  const displayPrice = hasDiscount ? (product.sale as number) : product.price
  const discountLabel =
    hasDiscount && product.price > 0
      ? `-${Math.round(((product.price - (product.sale ?? 0)) / product.price) * 100)}%`
      : undefined

  const thumbnailUrl =
    typeof product.thumbnail === "string"
      ? product.thumbnail
      : product.thumbnail?.url || product.images?.[0]?.url

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase text-muted-foreground">
          Mã sản phẩm:{" "}
          <span className="font-semibold">{product.sku || product._id}</span>
        </p>
        <h1 className="text-xl font-bold leading-snug md:text-2xl lg:text-3xl">
          {product.name}
        </h1>
        <p className="text-xs text-muted-foreground">
          Danh mục:{" "}
          <span className="font-semibold">{renderCategories(product.categories)}</span>
          {" "} | Tình trạng:{" "}
          <span className="font-semibold">
            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
          </span>
        </p>
      </header>

      <section className="space-y-2 rounded-lg border bg-card p-4">
        <p className="text-xs font-medium uppercase text-emerald-600">Giá bán</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-bold text-destructive">
            {formatVnd(displayPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatVnd(product.price)}
              </span>
              {discountLabel && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {discountLabel}
                </span>
              )}
            </>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="w-full bg-destructive text-white hover:bg-destructive/90 sm:flex-1"
          disabled={product.stock <= 0}
          onClick={() => {
            addToCart({
              product: {
                productId: product._id,
                name: product.name,
                thumbnail: thumbnailUrl,
                price: displayPrice,
                sale: typeof product.sale === "number" ? product.sale : null,
              },
              quantity: 1,
            })
          }}
        >
          Thêm vào giỏ
        </Button>
        <Link href="/cart" className="sm:flex-1">
          <Button type="button" variant="outline" className="w-full">
            Xem giỏ hàng
          </Button>
        </Link>
      </div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="space-y-2 rounded-lg border bg-card p-4 text-xs md:text-sm">
          <h2 className="text-sm font-semibold">Thông số kỹ thuật</h2>
          <dl className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-x-4 gap-y-1.5">
            {Object.entries(product.specifications).map(([k, v]) => (
              <React.Fragment key={k}>
                <dt className="text-muted-foreground font-medium">{k}</dt>
                <dd className="">{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      )}

      {product.highlights && product.highlights.length > 0 && (
        <section className="space-y-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Đặc điểm nổi bật</h2>
          <ul className="list-disc space-y-1 pl-5">
            {product.highlights.map((item, idx) => (
              <li key={`${item}-${idx}`}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export function ProductDetailClient({ id }: { id: string }) {
  const params = useParams<{ id?: string | string[] }>()
  const resolvedId = (id?.trim() ||
    (Array.isArray(params?.id) ? params?.id[0] : params?.id) ||
    "") as string

  const { data, isLoading, isError, error } = useProduct(resolvedId)

  if (!resolvedId) {
    return (
      <div className="space-y-3">
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Không tìm thấy mã sản phẩm trong URL.
        </p>
        <Link href="/product">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <section className="gap-6 space-y-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:space-y-0">
        <div className="space-y-4">
          <div className="aspect-square w-full animate-pulse rounded-lg border bg-muted/40" />
          <div className="h-24 animate-pulse rounded-lg border bg-muted/40" />
        </div>
        <aside className="h-80 animate-pulse rounded-lg border bg-muted/40" />
      </section>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <p className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {getErrorMessage(error)}
        </p>
        <Link href="/product">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    )
  }

  const galleryUrls = collectGalleryUrls(data)

  return (
    <section
      className="gap-6 space-y-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:space-y-0"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border bg-card p-3 md:p-4">
          <ProductImageGallery alt={data.name} images={galleryUrls} />
        </div>

        <div className="lg:hidden">
          <BuyingInfo product={data} />
        </div>

        <section className="space-y-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Mô tả sản phẩm</h2>
          <p className="text-muted-foreground">
            {data.description?.trim() ? data.description : "Chưa có mô tả cho sản phẩm này."}
          </p>
        </section>
      </div>

      <aside className="hidden lg:block">
        <BuyingInfo product={data} />
      </aside>
    </section>
  )
}

