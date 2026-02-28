import Link from "next/link"

import { Badge, Button } from "@/components/atoms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"

export const metadata: Metadata = genMetadata({
  title: "Sản phẩm",
  description:
    "Khám phá danh sách các sản phẩm audio chất lượng cao tại FE-Audio. Từ Audio Premium đến Audio Basic, chúng tôi có đầy đủ sản phẩm phù hợp với nhu cầu của bạn.",
  keywords: [
    "sản phẩm audio",
    "audio premium",
    "audio standard",
    "audio basic",
    "mua audio",
    "FE-Audio products",
  ],
  canonical: "/product",
})

interface Product {
  id: number
  name: string
  price: string
  status: string
  description?: string
}

export default function ProductPage() {
  const products: Product[] = [
    {
      id: 1,
      name: "Audio Premium",
      price: "999,000đ",
      status: "Còn hàng",
      description: "Sản phẩm audio cao cấp với chất lượng tuyệt vời",
    },
    {
      id: 2,
      name: "Audio Standard",
      price: "599,000đ",
      status: "Còn hàng",
      description: "Sản phẩm audio tiêu chuẩn phù hợp với đa số người dùng",
    },
    {
      id: 3,
      name: "Audio Basic",
      price: "299,000đ",
      status: "Hết hàng",
      description: "Sản phẩm audio cơ bản với giá cả hợp lý",
    },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh sách sản phẩm audio",
    description: "Danh sách các sản phẩm audio chất lượng cao",
    itemListElement: products.map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      description: product.description,
      offers: {
        "@type": "Offer",
        price: product.price.replace(/[^\d]/g, ""),
        priceCurrency: "VND",
        availability:
          product.status === "Còn hàng"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container py-12">
        <article className="space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Sản phẩm</h1>
              <p className="text-muted-foreground mt-2">
                Danh sách các sản phẩm audio chất lượng cao
              </p>
            </div>
            <nav>
              <Link href="/" aria-label="Quay lại trang chủ">
                <Button variant="outline">← Trang chủ</Button>
              </Link>
            </nav>
          </header>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{product.name}</CardTitle>
                      <Badge
                        variant={
                          product.status === "Còn hàng"
                            ? "default"
                            : "secondary"
                        }
                        aria-label={`Trạng thái: ${product.status}`}
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-4" aria-label="Giá">
                      {product.price}
                    </p>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>
                    )}
                    <Button
                      className="w-full"
                      disabled={product.status === "Hết hàng"}
                      aria-label={`Mua ${product.name}`}
                    >
                      {product.status === "Còn hàng" ? "Mua ngay" : "Hết hàng"}
                    </Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </section>
        </article>
      </main>
    </>
  )
}
