import { MetadataRoute } from "next"

import type { Product } from "@/lib/api-client/product/product.types"

import { getProducts } from "@/api/product"
import { siteConfig } from "@/lib/metadata"

const STATIC_ROUTES = [
  { url: "", priority: 1, changefreq: "daily" as const },
  { url: "/product", priority: 0.9, changefreq: "daily" as const },
  { url: "/gioi-thieu", priority: 0.7, changefreq: "monthly" as const },
  { url: "/cart", priority: 0.6, changefreq: "weekly" as const },
  { url: "/checkout", priority: 0.5, changefreq: "weekly" as const },
  { url: "/checkout/success", priority: 0.4, changefreq: "monthly" as const },
]

function buildRoute(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }
}

async function fetchAllProducts(): Promise<Product[]> {
  const maxPages = 10
  const limit = 100

  try {
    const pageResults = await Promise.all(
      Array.from({ length: maxPages }, (_, i) => getProducts({ page: i + 1, limit, status: 1 })),
    )

    const allProducts: Product[] = []
    for (const res of pageResults) {
      const items = res.data?.items ?? []
      if (items.length === 0) break
      allProducts.push(...items)
      const totalPages = res.data?.pagination?.totalPages ?? 1
      if (allProducts.length >= totalPages * limit) break
    }

    return allProducts
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) =>
    buildRoute(route.url, now, route.priority, route.changefreq),
  )

  // Dynamic product routes
  const products = await fetchAllProducts()
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/product/${product._id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
