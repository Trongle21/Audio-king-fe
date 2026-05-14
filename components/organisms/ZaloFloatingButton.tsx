"use client"

import Image from "next/image"
import Link from "next/link"

import { PhoneButton } from "../atoms"

const ZALO_CONTACT_URL = "https://zalo.me/0986344085"

const ZALO_IMAGE_URL = "/Icon_of_Zalo.svg.png"

const PHONE_NUMBER = '0986344085'


export function ZaloFloatingButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-1">
      <Link
        href={ZALO_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ qua Zalo"
        className="w-[60px] h-[60px] ml-auto flex items-center gap-2 rounded-full bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sky-500 text-base font-bold">
          <Image src={ZALO_IMAGE_URL} alt="Zalo" width={32} height={32} />
        </span>
        {/* <span className="hidden sm:inline">Liên hệ</span> */}
      </Link>
      <a href={`tel:${PHONE_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Hotline">
        <PhoneButton phone={PHONE_NUMBER} />
      </a>
    </div>
  )
}

