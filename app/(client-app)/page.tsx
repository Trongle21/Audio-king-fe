import Link from "next/link"

import type { Metadata } from "next"

import { getTrending } from "@/api/trending"
import { Button } from "@/components/atoms"
import { HomeBannerSlider } from "@/components/organisms/HomeBannerSlider"
import { PaginatedProductGrid } from "@/components/organisms/PaginatedProductGrid"
import { type HomeProduct } from "@/components/organisms/ProductCard"
import { TrendingProductsSlider } from "@/components/organisms/TrendingProductsSlider"
import { generateMetadata as genMetadata } from "@/lib/metadata"
import { mapProductToHomeProduct } from "@/lib/product-list/map-product-to-card"

export const metadata: Metadata = genMetadata({
    title: "Trang chủ",
    description:
        "Chào mừng đến với FE-Audio - Nền tảng audio chất lượng cao với đa dạng sản phẩm và trải nghiệm tuyệt vời",
    keywords: [
        "FE-Audio",
        "audio",
        "loa karaoke",
        "dàn âm thanh",
        "sound",
        "trang chủ",
        "sản phẩm audio",
    ],
    canonical: "/",
})

export default async function ClientHomePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "FE-Audio",
        description: "Nền tảng audio chất lượng cao",
        url: "https://feaudio.com",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://feaudio.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    }

    let trendingProducts: HomeProduct[] = []
    try {
        const trendingItems = await getTrending()
        trendingProducts = trendingItems
            .map((item) => item.product)
            .filter((product) => Boolean(product) && !product.isDelete)
            .map((product) => mapProductToHomeProduct(product))
    } catch {
        trendingProducts = []
    }

    const hallSoundProducts: HomeProduct[] = [
        {
            id: "h1",
            name: "Dàn Âm Thanh Hội Trường FE-Audio HT25 (Array Active, 25m)",
            imageUrl:
                "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "79.990.000đ",
            oldPrice: "114.430.000đ",
            discountLabel: "-30%",
            badge: "Siêu sốc",
            meta: "Phù hợp hội trường 200–300m²",
        },
        {
            id: "h2",
            name: "Dàn Âm Thanh Hội Trường BK New 2026-01 (BIK CS-620, BIK BJ-V12)",
            imageUrl:
                "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "71.900.000đ",
            oldPrice: "100.170.000đ",
            discountLabel: "-28%",
            badge: "New 2026",
            meta: "Dàn sân khấu đám cưới, hội nghị",
        },
        {
            id: "h3",
            name: "Dàn Âm Thanh Line Array FE-Audio LA26 (Array 2 Way Passive)",
            imageUrl:
                "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "119.990.000đ",
            oldPrice: "204.710.000đ",
            discountLabel: "-41%",
            badge: "Bán chạy",
            meta: "Line array mini cho sân khấu ngoài trời",
        },
        {
            id: "h4",
            name: "Dàn Loa Hội Trường FE-Audio HT30 (3.000W, Có Sub Active)",
            imageUrl:
                "https://images.pexels.com/photos/164747/pexels-photo-164747.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "124.900.000đ",
            oldPrice: "174.300.000đ",
            discountLabel: "-28%",
            badge: "New 2026",
            meta: "Phù hợp sân khấu, hội trường đa năng",
        },
        {
            id: "h5",
            name: "Dàn Loa Hội Trường FE-Audio HT40 (4.000W, Sub kép Active)",
            imageUrl:
                "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "156.900.000đ",
            oldPrice: "210.300.000đ",
            discountLabel: "-25%",
            badge: "Bán chạy",
            meta: "Dành cho sân khấu ngoài trời, nhạc sống",
        },
        {
            id: "h6",
            name: "Dàn Loa Hội Trường FE-Audio HT50 (5.000W, Full Array)",
            imageUrl:
                "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "189.900.000đ",
            oldPrice: "259.300.000đ",
            discountLabel: "-27%",
            badge: "New 2026",
            meta: "Giải pháp full array cho hội trường lớn 400–500m²",
        },
    ]

    const hotKaraokeProducts: HomeProduct[] = [
        {
            id: "k1",
            name: "Loa Karaoke Nhật BIK BJ S888II (Bass 25cm, 600W)",
            imageUrl:
                "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "8.290.000đ",
            oldPrice: "10.890.000đ",
            discountLabel: "-25%",
            badge: "Bán chạy",
        },
        {
            id: "k2",
            name: "Loa Karaoke Nhật BIK BKS C50 (Bass 25cm, 800W)",
            imageUrl:
                "https://images.pexels.com/photos/164716/pexels-photo-164716.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "17.900.000đ",
            oldPrice: "23.900.000đ",
            discountLabel: "-25%",
            badge: "New 2026",
        },
        {
            id: "k3",
            name: "Loa Karaoke JBL CV1652T (Bass 16.5cm, 8 Ohm)",
            imageUrl:
                "https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "23.100.000đ",
            oldPrice: "28.000.000đ",
            discountLabel: "-17%",
            badge: "Mua nhiều nhất",
        },
        {
            id: "k4",
            name: "Loa RCF C MAX 4112 (Full Bass 30, SX: Italy)",
            imageUrl:
                "https://images.pexels.com/photos/164747/pexels-photo-164747.jpeg?auto=compress&cs=tinysrgb&w=800",
            price: "61.900.000đ",
            oldPrice: "74.700.000đ",
            discountLabel: "-17%",
            badge: "Sản phẩm hot",
        },
    ]

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Banner + sections sản phẩm */}
            <div className="space-y-10 pb-10">
                {/* Banner chính */}
                <div className="bg-muted/50 pb-4 pt-2">
                    <div className="container">
                        <HomeBannerSlider />
                    </div>
                </div>

                {/* Sản phẩm đang thịnh hành */}
                <section
                    aria-labelledby="trending-heading"
                    className="bg-background"
                >
                    <div className="container space-y-4">
                        <header className="space-y-2">
                            <h1
                                id="trending-heading"
                                className="text-2xl font-bold tracking-tight md:text-3xl"
                            >
                                Sản phẩm đang thịnh hành tại FE-Audio
                            </h1>
                            <p className="text-sm text-muted-foreground md:text-base">
                                Những sản phẩm audio được khách hàng lựa chọn
                                nhiều nhất trong thời gian gần đây.
                            </p>
                        </header>

                        <TrendingProductsSlider products={trendingProducts} />
                    </div>
                </section>

                {/* Dàn âm thanh hội trường, sân khấu */}
                <section
                    aria-labelledby="hall-heading"
                    className="bg-muted/40 py-6"
                >
                    <div className="container space-y-4">
                        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2
                                    id="hall-heading"
                                    className="text-xl font-bold tracking-tight md:text-2xl"
                                >
                                    Dàn âm thanh hội trường, sân khấu
                                </h2>
                                <p className="text-sm text-muted-foreground md:text-base">
                                    Giải pháp trọn bộ cho hội trường, sân khấu,
                                    đám cưới, sự kiện.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Tất cả
                                </Button>
                                <Button size="sm" variant="outline">
                                    Dàn sân khấu
                                </Button>
                                <Button size="sm" variant="outline">
                                    Dàn đám cưới
                                </Button>
                                <Button size="sm" variant="outline">
                                    Dàn hội trường mini
                                </Button>
                            </div>
                        </header>

                        <PaginatedProductGrid
                            products={hallSoundProducts}
                            itemsPerPage={4}
                        />

                        <div className="pt-2">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-destructive text-destructive hover:bg-destructive/5"
                            >
                                <Link href="/dan-am-thanh-hoi-truong">
                                    Xem tất cả dàn âm thanh hội trường
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Loa karaoke hot nhất */}
                <section
                    aria-labelledby="karaoke-heading"
                    className="bg-background"
                >
                    <div className="container space-y-4">
                        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2
                                    id="karaoke-heading"
                                    className="text-xl font-bold tracking-tight md:text-2xl"
                                >
                                    Loa karaoke hot nhất
                                </h2>
                                <p className="text-sm text-muted-foreground md:text-base">
                                    Tuyển chọn các mẫu loa karaoke bán chạy,
                                    được đánh giá cao về chất lượng và độ bền.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Tất cả
                                </Button>
                                <Button size="sm" variant="outline">
                                    Loa JBL
                                </Button>
                                <Button size="sm" variant="outline">
                                    Loa BIK
                                </Button>
                                <Button size="sm" variant="outline">
                                    Loa RCF
                                </Button>
                            </div>
                        </header>

                        <PaginatedProductGrid
                            products={hotKaraokeProducts}
                            itemsPerPage={8}
                        />
                    </div>
                </section>
            </div>
        </>
    )
}
