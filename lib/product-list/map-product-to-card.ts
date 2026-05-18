import type { Product } from "@/api/product/product.types"
import type { HomeProduct } from "@/components/organisms/ProductCard"

function pickThumbnailUrl(product: Product): string {
  const t = product.thumbnail
  if (!t) return "/file.svg"
  if (typeof t === "string") return t
  return t.url || "/file.svg"
}

function pickThumbnail(product: Product): HomeProduct["thumbnail"] {
  const t = product.thumbnail
  if (!t) return undefined
  if (typeof t === "string") {
    return { url: t, alt: product.name }
  }
  return {
    url: t.url || "/file.svg",
    alt: t.alt || product.name,
  }
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
  // Always show fake original price (10% higher) with strikethrough
  const currentPrice = product.sale !== undefined && product.sale > 0 ? product.sale : product.price
  const fakeOriginalPrice = Math.round(currentPrice * 1.1)

  const stock = product.stock
  const badge =
    stock <= 0 ? "Hết hàng" : product.rating && product.rating >= 0 ? "Nổi bật" : undefined

  return {
    id: product._id,
    name: product.name,
    imageUrl: pickThumbnailUrl(product),
    images: collectImages(product),
    thumbnail: pickThumbnail(product),
    price: formatVnd(currentPrice),
    oldPrice: formatVnd(fakeOriginalPrice),
    discountLabel: `-${Math.round(((fakeOriginalPrice - currentPrice) / fakeOriginalPrice) * 100)}%`,
    badge,
    meta: product.description?.slice(0, 80),
  }
}
