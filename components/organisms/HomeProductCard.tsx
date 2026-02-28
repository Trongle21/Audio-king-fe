import Link from "next/link"

import { Button } from "@/components/atoms"
import { Card, CardContent } from "@/components/molecules"

export type HomeProduct = {
  id: string
  name: string
  imageUrl: string
  price: string
  oldPrice?: string
  discountLabel?: string
  badge?: string
  meta?: string
}

export function HomeProductCard({ product }: { product: HomeProduct }) {
  return (
    <article
      className="group flex min-w-[220px] max-w-xs flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="relative aspect-4/3 w-full bg-muted overflow-hidden">
        {/* Dùng img thường để tránh cấu hình domain, có thể thay bằng Image sau */}
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          itemProp="image"
        />
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </div>

      <Card className="border-0 shadow-none">
        <CardContent className="space-y-2 p-3">
          <h3
            className="line-clamp-2 text-sm font-semibold hover:underline cursor-alias"
            itemProp="name"
            title={product.name}
          >
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          {product.meta && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {product.meta}
            </p>
          )}

          <div
            className="space-y-1"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <p
              className="text-base font-bold text-destructive"
              itemProp="price"
            >
              {product.price}
            </p>
            {product.oldPrice && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="line-through">{product.oldPrice}</span>
                {product.discountLabel && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {product.discountLabel}
                  </span>
                )}
              </p>
            )}
            <meta itemProp="priceCurrency" content="VND" />
          </div>

          <Button
            size="sm"
            className="mt-2 w-full bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            aria-label={`Xem chi tiết ${product.name}`}
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>
    </article>
  )
}
