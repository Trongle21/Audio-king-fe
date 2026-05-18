import { Suspense } from "react"

import Link from "next/link"

import type { GenerateMetadataParams } from "@/lib/metadata"
import type { Metadata } from "next"

import {
  ProductFiltersSidebar,
} from "@/components/organisms/ProductFilters"
import { ProductListingClient } from "@/components/organisms/ProductListingClient"
import { generateMetadata as genMetadata } from "@/lib/metadata"

export const metadata: Metadata = genMetadata({
  title: "Sản phẩm Audio Chính Hãng - Loa Karaoke, Dàn Âm Thanh Giá Tốt | HVN AUDIO",
  description:
    "Khám phá danh sách các sản phẩm audio chất lượng cao tại HVN AUDIO với đầy đủ loa karaoke, dàn âm thanh hội trường, vang số, micro và nhiều thiết bị khác. Giá tốt, bảo hành chính hãng.",
  keywords: [
    "sản phẩm audio",
    "loa karaoke",
    "dàn âm thanh",
    "thiết bị âm thanh",
    "mua loa",
    "loa karaoke chính hãng",
    "dàn âm thanh hội trường",
    "vang số",
    "micro không dây",
    "HVN AUDIO products",
  ],
  canonical: "/product",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Sản phẩm Audio Chính Hãng - HVN AUDIO",
    description:
      "Khám phá danh sách các sản phẩm audio chất lượng cao: loa karaoke, dàn âm thanh hội trường, vang số, micro. Giá tốt, bảo hành chính hãng.",
    url: "/product",
    siteName: "HVN AUDIO",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HVN AUDIO - Sản phẩm audio chính hãng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sản phẩm Audio Chính Hãng - HVN AUDIO",
    description:
      "Khám phá danh sách các sản phẩm audio chất lượng cao: loa karaoke, dàn âm thanh hội trường, vang số, micro.",
    images: ["/og-image.jpg"],
    site: "@HVNAUDIO",
  },
} satisfies GenerateMetadataParams)

export default function ProductPage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HVN AUDIO",
    url: "https://hvnaudio.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "/product?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sản phẩm",
        item: "/product",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
            <li className="font-medium text-foreground">Sản phẩm</li>
          </ol>
        </nav>

        <header className="space-y-2 md:space-y-3">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
            Sản phẩm audio tại HVN AUDIO
          </h1>
        </header>

        <section className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row">
          <Suspense
            fallback={
              <div className="flex flex-1 flex-col gap-4">
                <div className="h-10 w-full max-w-md animate-pulse rounded-md border bg-muted/40" />
                <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] animate-pulse rounded-lg border bg-muted/40"
                    />
                  ))}
                </div>
              </div>
            }
          >
            <ProductListingClient />
          </Suspense>

          <aside
            aria-label="Bộ lọc sản phẩm"
            className="hidden h-fit max-w-md flex-[0_0_320px] lg:sticky lg:top-32 lg:block"
          >
            <Suspense
              fallback={
                <div className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                  <div className="h-10 animate-pulse rounded bg-muted/40" />
                  <div className="h-20 animate-pulse rounded bg-muted/40" />
                </div>
              }
            >
              <ProductFiltersSidebar />
            </Suspense>
          </aside>
        </section>
      </main>
    </>
  )
}
