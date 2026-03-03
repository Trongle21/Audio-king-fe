import { ProductImageGallery } from "@/components/organisms/ProductImageGallery"
import { generateMetadata as genMetadata } from "@/lib/metadata"

import type { Metadata } from "next"
import Link from "next/link"

type ProductDetailProps = {
  params: { id: string }
}

function BuyingInfo({ id }: { id: string }) {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase text-muted-foreground">
          Mã sản phẩm: <span className="font-semibold">{id}</span>
        </p>
        <h1 className="text-xl font-bold leading-snug md:text-2xl lg:text-3xl">
          Loa Sub Điện BIK BJ-W25AV II (Bass 30cm)
        </h1>
        <p className="text-xs text-muted-foreground">
          Thương hiệu: <span className="font-semibold">BIK</span> | Bảo hành:{" "}
          <span className="font-semibold">12 tháng</span>
        </p>
      </header>

      <section className="space-y-2 rounded-lg border bg-card p-4">
        <p className="text-xs font-medium uppercase text-emerald-600">
          Giá bán
        </p>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-bold text-destructive">
            8.190.000đ
          </span>
          <span className="text-sm text-muted-foreground line-through">
            11.470.000đ
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            -29%
          </span>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4 text-xs md:text-sm">
        <h2 className="text-sm font-semibold uppercase text-foreground">
          Khuyến mãi, ưu đãi
        </h2>
        <ol className="space-y-1.5">
          <li>Tặng dây AV 1.8M hoặc Dây Canon 3M.</li>
          <li>Miễn phí set up, lắp đặt nội thành.</li>
          <li>Giao hàng toàn quốc, thanh toán COD.</li>
        </ol>
      </section>

      <button className="inline-flex w-full items-center justify-center rounded-md bg-destructive px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-destructive/90">
        Đặt mua ngay
      </button>

      <section className="space-y-2 rounded-lg border bg-card p-4 text-xs md:text-sm">
        <h2 className="text-sm font-semibold">Thông số kỹ thuật</h2>
        <dl className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-x-4 gap-y-1.5">
          <dt className="text-muted-foreground">Công suất RMS</dt>
          <dd className="font-medium">350W</dd>
          <dt className="text-muted-foreground">Bass loa</dt>
          <dd className="font-medium">30cm (12 inch)</dd>
          <dt className="text-muted-foreground">Nguồn gốc</dt>
          <dd className="font-medium">Nhật Bản</dd>
        </dl>
      </section>
    </div>
  )
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const id = params.id ?? 'id1'

  // Tạm thời dùng mock, sau này có thể fetch từ BE
  const name = `Sản phẩm audio ${id.toUpperCase()}`

  return genMetadata({
    title: `${name} | FE-Audio`,
    description: `Chi tiết ${name} – xem thông số kỹ thuật, khuyến mãi và chính sách bán hàng tại FE-Audio.`,
    canonical: `/product/${id}`,
  })
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

      <section
        className="gap-6 space-y-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:space-y-0"
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Cột chính: mobile/tablet hiển thị slide + mua bán + mô tả theo 1 cột */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg border bg-card p-3 md:p-4">
            <ProductImageGallery
              alt="Loa Sub Điện BIK BJ-W25AV II (Bass 30cm)"
              images={[
                "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/164747/pexels-photo-164747.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/164747/pexels-photo-164747.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
              ]}
            />
          </div>

          {/* Mobile / tablet: thông tin mua bán hiển thị ngay dưới slide */}
          <div className="lg:hidden">
            <BuyingInfo id={id} />
          </div>

          {/* Thông tin nổi bật / mô tả ngắn */}
          <section className="space-y-3 rounded-lg border bg-card p-4 text-sm leading-relaxed">
            <h2 className="text-base font-semibold">Đặc điểm nổi bật</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Công suất phù hợp cho karaoke gia đình, hội trường nhỏ.</li>
              <li>Thiết kế tối giản, dễ phối ghép với nhiều không gian.</li>
              <li>Hỗ trợ nhiều chuẩn kết nối, dễ dàng nâng cấp hệ thống.</li>
            </ul>
          </section>
        </div>

        {/* Desktop: thông tin mua hàng cố định ở cột phải */}
        <aside className="hidden lg:block">
          <BuyingInfo id={id} />
        </aside>
      </section>
    </main>
  )
}

