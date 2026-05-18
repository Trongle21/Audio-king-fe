import "./globals.css"

import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import type { Metadata } from "next"

import { generateMetadata as genMetadata } from "@/lib/metadata"
import ReactQueryProvider from "@/lib/ReactQueryProvider"
import ReduxProvider from "@/lib/store/ReduxProvider"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = genMetadata({
  title: "HVN AUDIO",
  description: "Trung tâm phân phối thiết bị âm thanh chính hãng - Loa karaoke, dàn âm thanh, micro, cục đẩy chất lượng cao",
  keywords: ["HVN AUDIO", "loa karaoke", "dàn âm thanh", "thiết bị âm thanh", "micro không dây", "cục đẩy", "vang số"],
})

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HVN AUDIO",
  "alternateName": "HVN Audio - Trung tâm phân phối âm thanh chính hãng",
  "url": "https://hvnaudio.vn",
  "logo": "https://hvnaudio.vn/logo.png",
  "description": "Trung tâm phân phối thiết bị âm thanh nhập khẩu chính hãng với chế độ bảo hành uy tín.",
  "slogan": "Âm Thanh Nhập Khẩu Chính Hãng",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-986-344-085",
    "contactType": "customer service",
    "availableLanguage": "Vietnamese",
    "areaServed": "VN"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "232 đường tỉnh 396",
    "addressLocality": "Ninh Giang",
    "addressRegion": "Hải Phòng",
    "postalCode": "100000",
    "addressCountry": "VN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "20.729112",
    "longitude": "106.365208"
  },
  "sameAs": [
    "https://www.facebook.com/hvnaudio",
    "https://www.youtube.com/channel/hvnaudio",
    "https://twitter.com/hvnaudio"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Favicon for modern browsers */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48x48.png" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme & Mobile */}
        <meta name="theme-color" content="#8B0000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HVN AUDIO" />
        
        {/* Open Graph */}
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HVN AUDIO" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ReduxProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
