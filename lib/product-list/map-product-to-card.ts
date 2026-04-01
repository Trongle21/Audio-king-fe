import type { Product } from "@/api/product/product.types"

import type { HomeProduct } from "@/components/organisms/ProductCard"

function pickThumbnailUrl(product: Product): string {
  const t = product.thumbnail
  if (!t) return "/file.svg"
  if (typeof t === "string") return t
  return t.url || "/file.svg"
}

function collectImages(product: Product): string[] {
  const urls: string[] = []
  const thumb = pickThumbnailUrl(product)
  urls.push(thumb)
  if (product.images?.length) {
    for (const img of product.images) {
      if (img.url && !urls.includes(img.url)) urls.push(img.url)
    }
  }
  return urls
}

function formatVnd(n: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`
}

/** Map `Product` (backend) → `HomeProduct` (ProductCard). */
export function mapProductToHomeProduct(product: Product): HomeProduct {
  const sale = product.sale
  const priceNum = product.price
  const hasDiscount =
    sale !== undefined && sale < priceNum && sale >= 0

  const displayPrice = hasDiscount ? sale : priceNum
  const oldPrice = hasDiscount ? formatVnd(priceNum) : undefined
  const discountLabel =
    hasDiscount && priceNum > 0
      ? `-${Math.round(((priceNum - (sale ?? 0)) / priceNum) * 100)}%`
      : undefined

  const stock = product.stock
  const badge =
    stock <= 0 ? "Hết hàng" : product.rating && product.rating >= 4 ? "Nổi bật" : undefined

  return {
    id: product._id,
    name: product.name,
    imageUrl: pickThumbnailUrl(product),
    images: collectImages(product),
    price: formatVnd(displayPrice),
    oldPrice,
    discountLabel,
    badge,
    meta: product.description?.slice(0, 80),
  }
}
