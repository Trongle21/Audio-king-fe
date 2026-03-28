import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Toaster } from "sonner"

import { generateMetadata as genMetadata } from "@/lib/metadata"
import ReactQueryProvider from "@/lib/ReactQueryProvider"
import ReduxProvider from "@/lib/store/ReduxProvider"

import type { Metadata } from "next"

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
  title: "FE-Audio",
  description: "Nền tảng audio chất lượng cao với trải nghiệm tuyệt vời",
  keywords: ["audio", "music", "sound", "audio platform", "FE-Audio"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
