import Link from "next/link"

import { Button } from "@/components/atoms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules"
import { HomeBanner } from "@/components/organisms/HomeBanner"

export default function HomePage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <HomeBanner />

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Trang chủ</h1>
          <p className="text-muted-foreground text-lg">
            Chào mừng đến với FE-Audio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm nổi bật</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Khám phá các sản phẩm audio chất lượng cao
              </p>
              <Link href="/product">
                <Button>Xem sản phẩm</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Đăng nhập để truy cập các tính năng đặc biệt
              </p>
              <Link href="/login">
                <Button variant="outline">Đăng nhập</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giới thiệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                FE-Audio là nền tảng audio hàng đầu với chất lượng cao và trải
                nghiệm tuyệt vời
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
