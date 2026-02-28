import type { Metadata } from "next"

const siteConfig = {
  name: "FE-Audio",
  description: "Nền tảng audio chất lượng cao với trải nghiệm tuyệt vời",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://feaudio.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/feaudio",
    github: "https://github.com/feaudio",
  },
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  noindex = false,
  canonical,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noindex?: boolean
  canonical?: string
}): Metadata {
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
    openGraph: {
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
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [ogImage],
      creator: "@feaudio",
    },
    robots: {
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
