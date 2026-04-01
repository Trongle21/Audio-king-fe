import { Suspense } from "react"

import Link from "next/link"

import type { Metadata } from "next"

import { getProductById } from "@/api/product"
import { ProductDetailClient } from "@/components/organisms/ProductDetailClient"
import { generateMetadata as genMetadata } from "@/lib/metadata"


type ProductDetailProps = {
  params: { id: string }
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const id = params.id ?? ""

  try {
    const res = await getProductById(id)
    const product = res.data
    const name = product?.name?.trim() || `Sản phẩm ${id}`

    return genMetadata({
      title: `${name} | FE-Audio`,
      description: product?.description?.trim()
        ? product.description
        : `Chi tiết ${name} – xem thông số kỹ thuật, giá bán và chính sách tại FE-Audio.`,
      canonical: `/product/${id}`,
    })
  } catch {
    const name = `Sản phẩm ${id}`

    return genMetadata({
      title: `${name} | FE-Audio`,
      description: `Chi tiết ${name} – xem thông số kỹ thuật, giá bán và chính sách tại FE-Audio.`,
      canonical: `/product/${id}`,
    })
  }
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = params

  return (
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
  )
}

