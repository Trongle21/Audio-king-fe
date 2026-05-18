import type { Metadata } from "next"

const siteConfig = {
  name: "HVN AUDIO",
  description: "Nền tảng audio chất lượng cao với trải nghiệm tuyệt vời",
  url: "https://hvnaudio.vn",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/hvnaudio",
    github: "https://github.com/hvnaudio",
  },
}

export type GenerateMetadataParams = {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noindex?: boolean
  canonical?: string
  openGraph?: Partial<{
    title: string
    description: string
    url: string
    siteName: string
    locale: string
    type: string
    images: Array<{
      url: string
      width: number
      height: number
      alt: string
    }>
  }>
  twitter?: Partial<{
    card: string
    title: string
    description: string
    images: string[]
    site: string
  }>
  robots?: {
    index?: boolean
    follow?: boolean
    googleBot?: {
      index?: boolean
      follow?: boolean
      "max-video-preview"?: number
      "max-image-preview"?: "large" | "none" | "standard"
      "max-snippet"?: number
    }
  }
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  noindex = false,
  canonical,
  openGraph,
  twitter,
  robots,
}: GenerateMetadataParams): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} - ${siteConfig.description}`

  const metaDescription = description || siteConfig.description
  const ogImage = image || `${siteConfig.url}${siteConfig.ogImage}`

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords?.join(", "),
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || siteConfig.url,
    },
    openGraph: openGraph
      ? {
        type: "website",
        locale: "vi_VN",
        ...openGraph,
        images: openGraph.images || [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: openGraph.title || fullTitle,
          },
        ],
      }
      : {
        type: "website",
        locale: "vi_VN",
        url: canonical || siteConfig.url,
        title: fullTitle,
        description: metaDescription,
        siteName: siteConfig.name,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: fullTitle,
          },
        ],
      },
    twitter: twitter
      ? {
        card: "summary_large_image",
        ...twitter,
        images: twitter.images || [ogImage],
      }
      : {
        card: "summary_large_image",
        title: fullTitle,
        description: metaDescription,
        images: [ogImage],
        creator: "@hvnaudio",
      },
    robots: robots || {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  }
}

export { siteConfig }

