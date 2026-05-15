"use client"

import { Phone } from "lucide-react"
import Link from "next/link"

const ZALO_CONTACT_URL = "https://zalo.me/0986344085"
const ZALO_IMAGE_URL = "/Icon_of_Zalo.svg.png"
const PHONE_NUMBER = "0986344085"

export function ZaloFloatingButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-40" />
        <Link
          href={ZALO_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Liên hệ qua Zalo"
          className="relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-sky-500 shadow-lg hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ZALO_IMAGE_URL} alt="Zalo" width={32} height={32} />
          </span>
        </Link>
      </div>
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-40" />
        <a
          href={`tel:${PHONE_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Liên hệ qua Hotline"
          className="relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-destructive shadow-lg hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Phone className="size-6 text-white" />
        </a>
      </div>
    </div>
  )
}

