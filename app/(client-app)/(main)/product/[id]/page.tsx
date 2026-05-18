import { Suspense } from "react"

import Link from "next/link"

import type { GenerateMetadataParams } from "@/lib/metadata"
import type { Metadata } from "next"

import { getProductById } from "@/api/product"
import { ProductDetailClient } from "@/components/organisms/ProductDetailClient"
import { generateMetadata as genMetadata, siteConfig } from "@/lib/metadata"

type ProductDetailProps = {
  params: { id: string }
}

function getImageUrl(thumbnail: unknown): string {
  if (!thumbnail) return `${siteConfig.url}/og-image.jpg`
  if (typeof thumbnail === "string") return thumbnail
  if (typeof thumbnail === "object" && "url" in (thumbnail as Record<string, unknown>)) {
    return String((thumbnail as { url: string }).url)
  }
  return `${siteConfig.url}/og-image.jpg`
}

function getPriceValidUntil(): string {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
  return new Date(Date.now() + THIRTY_DAYS_MS).toISOString().split("T")[0]
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const id = params.id ?? ""

  try {
    const res = await getProductById(id)
    const product = res.data
    const name = product?.name?.trim() || `Sản phẩm ${id}`
    const description = product?.description?.trim()
      ? product.description.substring(0, 160)
      : `Chi tiết ${name} – xem thông số kỹ thuật, giá bán và chính sách tại HVN AUDIO.`
    const imageUrl = getImageUrl(product?.thumbnail)

    const keywords = [
      name,
      "HVN AUDIO",
      "mua loa",
      "loa karaoke",
      "thiết bị âm thanh",
      "audio chính hãng",
    ]
    if (Array.isArray(product?.categories)) {
      product.categories.forEach((c) => {
        if (typeof c === "string") keywords.push(c)
        else if (typeof c === "object" && c !== null) keywords.push(c.name)
      })
    }

    const metadataParams: GenerateMetadataParams = {
      title: `${name} | HVN AUDIO`,
      description,
      keywords,
      canonical: `/product/${id}`,
      openGraph: {
        title: `${name} | HVN AUDIO`,
        description: description.substring(0, 155),
        url: `/product/${id}`,
        siteName: "HVN AUDIO",
        locale: "vi_VN",
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | HVN AUDIO`,
        description: description.substring(0, 155),
        images: [imageUrl],
        site: "@HVNAUDIO",
      },
    }

    return genMetadata(metadataParams)
  } catch {
    const name = `Sản phẩm ${id}`

    return genMetadata({
      title: `${name} | HVN AUDIO`,
      description: `Chi tiết ${name} – xem thông số kỹ thuật, giá bán và chính sách tại HVN AUDIO.`,
      canonical: `/product/${id}`,
    })
  }
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = params

  return (
    <>
      <ProductJsonLd productId={id} />
      <main className="container py-6 md:py-8 lg:py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-xs text-muted-foreground md:mb-6"
        >
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-destructive">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/product" className="hover:text-destructive">
                Sản phẩm
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">Chi tiết sản phẩm</li>
          </ol>
        </nav>

        <section className="space-y-6">
          <Suspense
            fallback={
              <section className="gap-6 space-y-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:space-y-0">
                <div className="space-y-4">
                  <div className="aspect-square w-full animate-pulse rounded-lg border bg-muted/40" />
                  <div className="h-24 animate-pulse rounded-lg border bg-muted/40" />
                </div>
                <aside className="h-80 animate-pulse rounded-lg border bg-muted/40" />
              </section>
            }
          >
            <ProductDetailClient id={id} />
          </Suspense>
        </section>
      </main>
    </>
  )
}

async function ProductJsonLd({ productId }: { productId: string }) {
  let productData: {
    name?: string
    description?: string
    price?: number
    sale?: number
    sku?: string
    thumbnail?: unknown
    images?: Array<{ url: string; alt?: string }>
    rating?: number
    reviews?: Array<{ rating: number; review: string; user?: string }>
  } | null = null

  try {
    const res = await getProductById(productId)
    productData = res.data
  } catch {
    productData = null
  }

  const name = productData?.name || `Sản phẩm ${productId}`
  const description =
    productData?.description ||
    `Mua ${name} chính hãng tại HVN AUDIO. Giá tốt, bảo hành uy tín.`
  const salePrice = productData?.sale ?? productData?.price ?? 0
  const imageUrl = getImageUrl(productData?.thumbnail)
  const aggregateRating = productData?.rating
    ? { "@type": "AggregateRating", ratingValue: productData.rating, reviewCount: 1 }
    : undefined

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.substring(0, 500),
    image: [imageUrl],
    sku: productData?.sku || productId,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${productId}`,
      priceCurrency: "VND",
      price: salePrice.toFixed(0),
      priceValidUntil: getPriceValidUntil(),
      availability: salePrice > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "HVN AUDIO",
      },
    },
    ...(aggregateRating && { aggregateRating }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
