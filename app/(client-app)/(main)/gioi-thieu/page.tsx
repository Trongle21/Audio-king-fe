import { Building2, MapPin, ShieldCheck, Speaker } from "lucide-react"
import Link from "next/link"

import type { Metadata } from "next"

import { AboutGallery } from "@/components/organisms/AboutGallery"
import { generateMetadata as genMetadata } from "@/lib/metadata"
import { siteConfig } from "@/lib/metadata"

export const metadata: Metadata = genMetadata({
  title: "Giới thiệu HVN AUDIO – Chuyên gia giải pháp karaoke & âm thanh",
  description:
    "HVN AUDIO cung cấp giải pháp âm thanh chất lượng cao cho gia đình, phòng karaoke kinh doanh, nhà hàng và hội trường. Đội ngũ kỹ thuật kinh nghiệm, thi công hàng trăm công trình trên toàn quốc.",
  keywords: [
    "HVN AUDIO",
    "giới thiệu HVN AUDIO",
    "dịch vụ karaoke",
    "lắp đặt âm thanh",
    "thiết bị karaoke",
    "loa karaoke chất lượng",
    "âm thanh hội trường",
    "tư vấn âm thanh",
  ],
  canonical: "/gioi-thieu",
  openGraph: {
    title: "Giới thiệu HVN AUDIO – Chuyên gia giải pháp karaoke & âm thanh",
    description:
      "HVN AUDIO cung cấp giải pháp âm thanh chất lượng cao cho gia đình, phòng karaoke kinh doanh, nhà hàng và hội trường.",
    url: "/gioi-thieu",
    siteName: "HVN AUDIO",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "HVN AUDIO – Giải pháp karaoke & âm thanh chuyên nghiệp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu HVN AUDIO – Chuyên gia giải pháp karaoke & âm thanh",
    description:
      "HVN AUDIO cung cấp giải pháp âm thanh chất lượng cao cho gia đình, phòng karaoke kinh doanh, nhà hàng và hội trường.",
    images: [`${siteConfig.url}/og-image.jpg`],
    site: "@HVNAUDIO",
  },
})

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
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
            <li className="font-medium text-foreground">Giới thiệu</li>
          </ol>
        </nav>

        <section className="rounded-xl border bg-card p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            HVN AUDIO – Chuyên gia giải pháp karaoke & âm thanh
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            HVN AUDIO cung cấp giải pháp âm thanh chất lượng cao cho gia đình, phòng
            karaoke kinh doanh, nhà hàng và hội trường. Với đội ngũ kỹ thuật kinh
            nghiệm, chúng tôi đã thi công hàng trăm công trình thực tế trên toàn
            quốc.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-lg border p-4">
              <div className="mb-2 inline-flex rounded-md bg-destructive/10 p-2 text-destructive">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold">Kinh nghiệm thi công</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Triển khai đa dạng mô hình karaoke từ gia đình đến kinh doanh.
              </p>
            </article>

            <article className="rounded-lg border p-4">
              <div className="mb-2 inline-flex rounded-md bg-destructive/10 p-2 text-destructive">
                <Speaker className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold">Thiết bị chính hãng</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Lựa chọn sản phẩm phù hợp ngân sách và nhu cầu thực tế.
              </p>
            </article>

            <article className="rounded-lg border p-4">
              <div className="mb-2 inline-flex rounded-md bg-destructive/10 p-2 text-destructive">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold">Bảo hành minh bạch</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Chính sách bảo hành rõ ràng, hỗ trợ kỹ thuật nhanh chóng.
              </p>
            </article>

            <article className="rounded-lg border p-4">
              <div className="mb-2 inline-flex rounded-md bg-destructive/10 p-2 text-destructive">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold">Phủ sóng toàn quốc</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Đội ngũ lắp đặt linh hoạt tại Hà Nội, TP.HCM và các tỉnh thành.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold md:text-2xl">Công trình đã lắp đặt</h2>
          <p className="text-sm text-muted-foreground">
            Một số hình ảnh thực tế các dự án karaoke HVN AUDIO đã thi công.
          </p>
          <AboutGallery initialPage={1} initialLimit={12} />
        </section>
      </main>
    </>
  )
}

function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HVN AUDIO",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description:
      "HVN AUDIO cung cấp giải pháp âm thanh chất lượng cao cho gia đình, phòng karaoke kinh doanh, nhà hàng và hội trường.",
    sameAs: [
      "https://www.facebook.com/hvnaudio",
      "https://www.youtube.com/channel/hvnaudio",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Vietnamese",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
