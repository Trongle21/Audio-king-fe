import { Globe, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const mapSrc = `https://www.google.com/maps?q=20.729112,106.365208&z=17&output=embed`

  return (
    <footer
      className="border-t bg-[#8B0000] text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container py-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Logo */}
          <section className="flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-3" aria-label="HVN AUDIO - Về trang chủ">
              <Image
                src="/logo.png"
                alt="HVN AUDIO Logo"
                width={64}
                height={64}
                className="h-14 w-14 md:h-16 md:w-16 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold">HVN AUDIO</span>
                <span className="text-[10px] opacity-80">TRUNG TÂM PHÂN PHỐI CHÍNH HÃNG</span>
              </div>
            </Link>
            <p className="text-sm text-white/80">
              Chuyên cung cấp các thiết bị âm thanh cao cấp, nhập khẩu chính hãng với
              chế độ bảo hành uy tín.
            </p>
          </section>

          {/* Quick Links */}
          <section>
            <h4 className="text-base font-semibold mb-4">Liên kết nhanh</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-white transition-colors hover:text-yellow-300"
                    aria-label="Trang chủ"
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="text-white transition-colors hover:text-yellow-300"
                    aria-label="Sản phẩm"
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gioi-thieu"
                    className="text-white transition-colors hover:text-yellow-300"
                    aria-label="Giới thiệu"
                  >
                    Giới thiệu
                  </Link>
                </li>
              </ul>
            </nav>
          </section>

          {/* Contact Info */}
          <section>
            <h4 className="text-base font-semibold mb-4">Thông tin liên hệ</h4>
            <div className="space-y-3 text-sm">
              {/* Website */}
              <a
                href="https://hvnaudio.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-white hover:text-yellow-300 transition-colors group"
                aria-label="Truy cập website hvnaudio.vn"
              >
                <Globe className="size-4 mt-0.5 shrink-0 text-yellow-300 group-hover:scale-110 transition-transform" />
                <span>hvnaudio.vn</span>
              </a>

              {/* Hotline */}
              <a
                href="tel:0986344085"
                className="flex items-start gap-3 text-white hover:text-yellow-300 transition-colors group"
                aria-label="Gọi hotline 0986344085"
              >
                <Phone className="size-4 mt-0.5 shrink-0 text-yellow-300 group-hover:scale-110 transition-transform" />
                <span>Hotline: 0986344085</span>
              </a>




              {/* Email */}
              <a
                href="mailto:hvnaudio@gmail.com"
                className="flex items-start gap-3 text-white hover:text-yellow-300 transition-colors group"
                aria-label="Gửi email đến hvnaudio@gmail.com"
              >
                <Mail className="size-4 mt-0.5 shrink-0 text-yellow-300 group-hover:scale-110 transition-transform" />
                <span>hvnaudio@gmail.com</span>
              </a>


              {/* Address */}
              <div className="flex items-start gap-3 text-white hover:text-yellow-300 transition-colors group">
                <MapPin className="size-4 mt-0.5 shrink-0 text-yellow-300 group-hover:scale-110 transition-transform" />
                <span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=20.729112,106.365208"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    232 đường tỉnh 396 - Ninh Giang - Hải Phòng
                  </a>
                </span>
              </div>
            </div>
          </section>

          {/* Google Maps */}
          <section>
            <h4 className="text-base font-semibold mb-4">Bản đồ</h4>
            <div className="rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
              <iframe
                src={mapSrc}
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HVN Audio trên Google Maps"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=20.729112,106.365208"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
            >
              <MapPin className="size-4" />
              Xem bản đồ lớn hơn
            </a>
          </section>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/20 text-center">
          <p className="text-sm text-white/60">
            © {currentYear} HVN Audio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
