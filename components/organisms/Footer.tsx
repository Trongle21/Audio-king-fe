import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t bg-background"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <section>
            <h3 className="text-lg font-semibold mb-4">FE-Audio</h3>
            <p className="text-sm text-muted-foreground">
              Nền tảng audio chất lượng cao
            </p>
          </section>
          <section>
            <h4 className="text-sm font-semibold mb-4">Liên kết</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Trang chủ"
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Sản phẩm"
                  >
                    Sản phẩm
                  </Link>
                </li>
              </ul>
            </nav>
          </section>
          <section>
            <h4 className="text-sm font-semibold mb-4">Liên hệ</h4>
            <address className="text-sm text-muted-foreground not-italic">
              <a
                href="mailto:contact@feaudio.com"
                className="hover:text-primary"
                aria-label="Gửi email đến contact@feaudio.com"
              >
                Email: contact@feaudio.com
              </a>
            </address>
          </section>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} FE-Audio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
