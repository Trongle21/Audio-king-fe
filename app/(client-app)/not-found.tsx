import Link from "next/link"

import type { Metadata } from "next"

import { Button } from "@/components/atoms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules"
import { generateMetadata as genMetadata } from "@/lib/metadata"


export const metadata: Metadata = genMetadata({
  title: "Không tìm thấy trang",
  description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển",
  noindex: true,
})

export default function NotFound() {
  return (
    <main className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <article className="w-full max-w-md text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-6xl font-bold" aria-label="404">
              404
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold">Không tìm thấy trang</h2>
            <p className="text-muted-foreground">
              Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
            <nav className="flex gap-4 justify-center" aria-label="Navigation">
              <Link href="/" aria-label="Về trang chủ">
                <Button>Về trang chủ</Button>
              </Link>
              <Link href="/product" aria-label="Xem sản phẩm">
                <Button variant="outline">Xem sản phẩm</Button>
              </Link>
            </nav>
          </CardContent>
        </Card>
      </article>
    </main>
  )
}
