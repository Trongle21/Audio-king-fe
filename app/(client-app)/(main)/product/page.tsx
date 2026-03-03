import { Suspense } from "react"

import Link from "next/link"

import {
  ProductCard,
  type HomeProduct,
} from "@/components/organisms/ProductCard"
import {
  ProductFiltersDrawer,
  ProductFiltersSidebar,
} from "@/components/organisms/ProductFilters"
import { ProductSearchBar } from "@/components/organisms/ProductSearchBar"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

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

const MOCK_PRODUCTS: HomeProduct[] = [
  {
    id: "p1",
    name: "Loa Karaoke Nhật BIK BJ S888II (Bass 25cm, 600W)",
    imageUrl:
      "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "8.290.000đ",
    oldPrice: "10.890.000đ",
    discountLabel: "-25%",
    badge: "Bán chạy",
    meta: "Loa karaoke gia đình, phòng 20–30m²",
  },
  {
    id: "p2",
    name: "Dàn Karaoke Đồng Bộ FE-Audio New 2026 (Vang Số + Cục Đẩy + Loa)",
    imageUrl:
      "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "40.890.000đ",
    oldPrice: "59.000.000đ",
    discountLabel: "-31%",
    badge: "Combo hot",
    meta: "Phù hợp phòng khách, quán karaoke mini",
  },
  {
    id: "p3",
    name: "Dàn Âm Thanh Hội Trường FE-Audio HT25 (Array Active, 25m)",
    imageUrl:
      "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "79.990.000đ",
    oldPrice: "114.430.000đ",
    discountLabel: "-30%",
    badge: "Siêu sốc",
    meta: "Hội trường 200–300m²",
  },
  {
    id: "p4",
    name: "Micro Không Dây Cao Cấp BKSound A3 Pro (Kèm Echo, Tăng Giảm Âm Lượng)",
    imageUrl:
      "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "2.590.000đ",
    oldPrice: "3.500.000đ",
    discountLabel: "-26%",
    badge: "New 2026",
    meta: "Micro không dây cho karaoke gia đình",
  },
  {
    id: "p5",
    name: "Vang Số JBL KX190 (Có Bluetooth, Cổng Quang, USB Recording)",
    imageUrl:
      "https://images.pexels.com/photos/164747/pexels-photo-164747.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "9.900.000đ",
    oldPrice: "12.500.000đ",
    discountLabel: "-21%",
    badge: "Mua nhiều nhất",
    meta: "Vang số karaoke, hỗ trợ nhiều ngõ vào",
  },
  {
    id: "p6",
    name: "Loa RCF C MAX 4112 (Full Bass 30, SX: Italy)",
    imageUrl:
      "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "61.900.000đ",
    oldPrice: "74.700.000đ",
    discountLabel: "-17%",
    badge: "Sản phẩm hot",
    meta: "Phù hợp sân khấu, phòng trà, quán bar",
  },
]

export default function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh sách sản phẩm audio",
    description:
      "Danh sách các sản phẩm loa karaoke, dàn âm thanh, micro, vang số tại FE-Audio.",
    itemListElement: MOCK_PRODUCTS.map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      description: product.meta,
      offers: {
        "@type": "Offer",
        priceCurrency: "VND",
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container py-6 md:py-8 lg:py-10">
        {/* Breadcrumb SEO-friendly */}
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

        <section className="mt-6 gap-6 lg:mt-8 flex">
          <div className="space-y-4 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Suspense
                fallback={
                  <div className="flex h-10 w-full max-w-md animate-pulse items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
                    Đang tải...
                  </div>
                }
              >
                <ProductSearchBar />
              </Suspense>
              <div className="flex justify-end lg:hidden">
                <Suspense
                  fallback={
                    <div className="h-10 w-[110px] rounded-md border bg-muted/40" />
                  }
                >
                  <ProductFiltersDrawer />
                </Suspense>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Desktop: filter sidebar bên phải */}
          <aside
            aria-label="Bộ lọc sản phẩm"
            className="hidden lg:block lg:sticky lg:top-24 h-fit w-full max-w-md flex-[0_0_320px]"
          >
            <Suspense
              fallback={
                <div className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                  <div className="h-10 animate-pulse rounded bg-muted/40" />
                  <div className="h-20 animate-pulse rounded bg-muted/40" />
                  <div className="h-10 animate-pulse rounded bg-muted/40" />
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
