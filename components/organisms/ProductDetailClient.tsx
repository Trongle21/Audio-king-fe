"use client"

import * as React from "react"

import { Star } from "lucide-react"
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

  // Always show fake original price (10% higher) with strikethrough
  const currentPrice = product.sale !== undefined && product.sale > 0 ? product.sale : product.price
  const fakeOriginalPrice = Math.round(currentPrice * 1.1)

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
            {formatVnd(currentPrice)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatVnd(fakeOriginalPrice)}
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            -{Math.round(((fakeOriginalPrice - currentPrice) / fakeOriginalPrice) * 100)}%
          </span>
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
                price: currentPrice,
                sale: fakeOriginalPrice,
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

      {product.promotions && product.promotions.length > 0 && (
        <section className="space-y-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Khuyến mãi, ưu đãi</h2>
          <ul className="list-disc space-y-1 pl-5">
            {product.promotions.map((item, idx) => (
              <li key={`${item}-${idx}`} className="text-emerald-700">{item}</li>
            ))}
          </ul>
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

      {/* Comments Section */}
      {product.comments && Object.keys(product.comments).length > 0 && (
        <CommentsSection comments={product.comments} />
      )}
    </div>
  )
}

interface CommentItem {
  user: string
  content: string
}

function CommentsSection({ comments }: { comments: Record<string, string> }) {

  const commentEntries: CommentItem[] = React.useMemo(() => {
    return Object.entries(comments)
      .map(([user, content]) => ({ user, content }))
      .sort((a, b) => {
        const dateStrA = a.content.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || "01/01/2000"
        const dateStrB = b.content.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || "01/01/2000"
        const dateA = new Date(dateStrA).getTime()
        const dateB = new Date(dateStrB).getTime()
        return dateB - dateA
      })
  }, [comments])


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-rose-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-violet-500",
      "bg-indigo-500",
      "bg-blue-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-emerald-500",
      "bg-green-500",
      "bg-amber-500",
      "bg-orange-500",
    ]
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  const formatDate = (content: string) => {
    const match = content.match(/\d{2}\/\d{2}\/\d{4}/)
    if (match) {
      return match[0]
    }
    return ""
  }

  const getContentOnly = (content: string) => {
    return content.replace(/\d{2}\/\d{2}\/\d{4}\s*/, "").trim()
  }

  return (
    <section className="relative space-y-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
      {/* Fake Rating Summary */}
      {commentEntries.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3 border border-amber-200">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-amber-600">5.0</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-amber-600">{commentEntries.length} đánh giá</span>
          </div>
          <div className="flex-1 border-l border-amber-200 pl-3">
            <p className="text-xs text-amber-700">Khách hàng đánh giá sản phẩm này</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {commentEntries.map((comment, index) => {
          const initials = getInitials(comment.user)
          const avatarColor = getAvatarColor(comment.user)
          const date = formatDate(comment.content)
          const contentOnly = getContentOnly(comment.content)

          return (
            <div
              key={index}
              className="flex gap-3 rounded-lg border bg-background/50 p-3 transition-all hover:bg-background"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor}`}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {date && (
                    <span className="text-xs text-muted-foreground">{date}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{contentOnly}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
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

          {/* Fake  Chinh sach cua hang */}
          <div className="space-y-2">
            {[
              { icon: "🛡️", title: "100% hàng chính hãng", desc: "Đền gấp 3 lần nếu phát hiện hàng giả" },
              { icon: "💰", title: "Giá luôn rẻ nhất", desc: "Gọi để có giá tốt nhất Việt Nam" },
              { icon: "🏪", title: "Hệ thống cửa hàng lớn nhất Việt Nam", desc: "" },
            ].map((policy, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border bg-slate-50 p-3">
                <span className="text-xl shrink-0">{policy.icon}</span>
                <div>
                  <p className="font-medium text-emerald-700">{policy.title}</p>
                  {policy.desc && <p className="text-xs text-muted-foreground">{policy.desc}</p>}
                </div>
              </div>
            ))}
          </div>

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

