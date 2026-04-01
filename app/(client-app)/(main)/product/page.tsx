import { Suspense } from "react"

import Link from "next/link"

import type { Metadata } from "next"

import {
  ProductFiltersSidebar,
} from "@/components/organisms/ProductFilters"
import { ProductListingClient } from "@/components/organisms/ProductListingClient"
import { generateMetadata as genMetadata } from "@/lib/metadata"


export const metadata: Metadata = genMetadata({
  title: "Sản phẩm",
  description:
    "Khám phá danh sách các sản phẩm audio chất lượng cao tại FE-Audio với đầy đủ loa karaoke, dàn âm thanh hội trường, vang số, micro và nhiều thiết bị khác.",
  keywords: [
    "sản phẩm audio",
    "loa karaoke",
    "dàn âm thanh",
    "thiết bị âm thanh",
    "mua loa",
    "FE-Audio products",
  ],
  canonical: "/product",
})

export default function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh sách sản phẩm audio",
    description:
      "Danh sách các sản phẩm loa karaoke, dàn âm thanh, micro, vang số tại FE-Audio.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            Sản phẩm audio tại FE-Audio
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
