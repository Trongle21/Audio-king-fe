
import type { Metadata } from "next"

import { HomeBannerSlider } from "@/components/organisms/HomeBannerSlider"
import { PaginatedProductGrid } from "@/components/organisms/PaginatedProductGrid"
import { type HomeProduct } from "@/components/organisms/ProductCard"
import { TrendingProductsSlider } from "@/components/organisms/TrendingProductsSlider"
import { getCategoriesServer } from "@/lib/api-server/categories"
import { getTrendingServer } from "@/lib/api-server/trending"
import { generateMetadata as genMetadata } from "@/lib/metadata"

interface CategoryProduct {
    _id: string
    name: string
    slug: string
    price: number
    description?: string
    thumbnail?: {
        url: string
        alt: string
    }
}

interface Category {
    _id: string
    name: string
    slug: string
    isDelete: boolean
    products: CategoryProduct[]
}

export const metadata: Metadata = genMetadata({
    title: "Trang chủ",
    description:
        "Chào mừng đến với HVN AUDIO - Nền tảng audio chất lượng cao với đa dạng sản phẩm và trải nghiệm tuyệt vời",
    keywords: [
        "HVN AUDIO",
        "audio",
        "loa karaoke",
        "dàn âm thanh",
        "sound",
        "trang chủ",
        "sản phẩm audio",
    ],
    canonical: "/",
})

type CategorySection = {
    id: string
    title: string
    description: string
    badge: string | undefined
    products: HomeProduct[]
}

function mapProductToHomeProduct(
    id: string,
    name: string,
    price: number,
    description: string | undefined,
    thumbnail?: { url: string; alt?: string },
    _categoryName?: string,
): HomeProduct {
    return {
        id,
        name,
        imageUrl: thumbnail?.url || "/file.svg",
        thumbnail: thumbnail ? { url: thumbnail.url, alt: thumbnail.alt || name } : undefined,
        price: `${new Intl.NumberFormat("vi-VN").format(price)}đ`,
        oldPrice: `${new Intl.NumberFormat("vi-VN").format(Math.round(price * 1.1))}đ`,
        discountLabel: "-10%",
        meta: description?.slice(0, 80),
    }
}

const CATEGORY_MAPPING: Record<string, { title: string; description: string }> = {
    "Vang số": {
        title: "Vang số chuyên nghiệp",
        description: "Giải pháp xử lý âm thanh tối ưu cho karaoke, sân khấu, hội trường và sự kiện.",
    },
    "Loa full": {
        title: "Loa âm thanh chất lượng cao",
        description: "Mang đến âm thanh mạnh mẽ, rõ nét cho hội trường, sân khấu, quán café và sự kiện.",
    },
    "Cục đẩy": {
        title: "Cục đẩy công suất",
        description: "Khuếch đại âm thanh mạnh mẽ, vận hành ổn định cho dàn karaoke và sân khấu chuyên nghiệp.",
    },
    "Quản lý nguồn": {
        title: "Quản lý nguồn thông minh",
        description: "Bảo vệ và kiểm soát hệ thống âm thanh an toàn, ổn định và chuyên nghiệp.",
    },
    Micro: {
        title: "Micro không dây cao cấp",
        description: "Thu âm rõ ràng, chống hú hiệu quả cho karaoke, hội trường và biểu diễn sân khấu.",
    },
    "Siêu trầm": {
        title: "Loa siêu trầm uy lực",
        description: "Tái tạo âm bass sâu, mạnh mẽ cho hệ thống âm thanh sân khấu và giải trí.",
    },
    "Loa kéo": {
        title: "Loa kéo di động tiện lợi",
        description: "Giải pháp âm thanh linh hoạt cho du lịch, bán hàng, sự kiện và karaoke mọi lúc mọi nơi.",
    },
}

const PRIORITY_ORDER = [
    "Vang số",
    "Loa full",
    "Cục đẩy",
    "Micro",
    "Siêu trầm",
    "Quản lý nguồn",
    "Loa kéo",
]

function buildCategorySections(categories: Category[]): CategorySection[] {
    const sections: CategorySection[] = []

    // First add categories that match our mapping and have products
    for (const categoryName of PRIORITY_ORDER) {
        const category = categories.find((c) => c.name === categoryName)
        if (category && category.products.length > 0) {
            const mapping = CATEGORY_MAPPING[categoryName]
            if (mapping) {
                sections.push({
                    id: category._id,
                    title: mapping.title,
                    description: mapping.description,
                    badge: "Nổi bật",
                    products: category.products.map((p) =>
                        mapProductToHomeProduct(p._id, p.name, p.price, p.description, p.thumbnail, category.name),
                    ),
                })
            }
        }
    }

    // Then add any remaining categories with products that aren't in our mapping
    for (const category of categories) {
        if (!PRIORITY_ORDER.includes(category.name) && category.products.length > 0) {
            sections.push({
                id: category._id,
                title: category.name,
                description: `Danh mục ${category.name} chất lượng cao`,
                badge: undefined,
                products: category.products.map((p) =>
                    mapProductToHomeProduct(p._id, p.name, p.price, p.description, p.thumbnail, category.name),
                ),
            })
        }
    }

    return sections
}

export default async function ClientHomePage() {
    // Fetch categories with products
    const categories = await getCategoriesServer()
    const categorySections = buildCategorySections(categories)

    // Fetch trending products
    let trendingProducts: HomeProduct[] = []
    let trendingError: string | null = null
    try {
        const trendingItems = await getTrendingServer()
        trendingProducts = trendingItems
            .map((item) => item.product)
            .filter((product) => Boolean(product) && !product.isDelete)
            .map((product) => {
                const thumb = product.thumbnail
                return {
                    id: product._id,
                    name: product.name,
                    imageUrl: thumb?.url ?? "/file.svg",
                    thumbnail: thumb ? { url: thumb.url, alt: thumb.alt || product.name } : undefined,
                    price: `${new Intl.NumberFormat("vi-VN").format(product.price)}đ`,
                    oldPrice: `${new Intl.NumberFormat("vi-VN").format(Math.round(product.price * 1.1))}đ`,
                    discountLabel: "-10%",
                    badge: product.rating ? "Nổi bật" : undefined,
                    meta: product.description?.slice(0, 80),
                }
            })
    } catch (err) {
        trendingProducts = []
        trendingError = err instanceof Error ? err.message : "Failed to load trending products"
        console.error("[ClientHomePage] getTrending error:", err)
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "HVN AUDIO",
        description: "Nền tảng audio chất lượng cao",
        url: "https://hvnaudio.vn",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://hvnaudio.vn/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    }

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
                                Sản phẩm đang thịnh hành tại HVN AUDIO
                            </h1>
                            <p className="text-sm text-muted-foreground md:text-base">
                                Những sản phẩm audio được khách hàng lựa chọn
                                nhiều nhất trong thời gian gần đây.
                            </p>
                        </header>

                        {trendingError ? (
                            <p className="text-sm text-muted-foreground py-4">
                                {trendingError}
                            </p>
                        ) : (
                            <TrendingProductsSlider products={trendingProducts} />
                        )}
                    </div>
                </section>

                {/* Danh mục sản phẩm từ API */}
                {categorySections.map((section, index) => (
                    <section
                        key={section.id}
                        aria-labelledby={`category-heading-${section.id}`}
                        className={index % 2 === 0 ? "bg-muted/40 py-6" : "bg-background py-6"}
                    >
                        <div className="container space-y-4">
                            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2
                                        id={`category-heading-${section.id}`}
                                        className="text-xl font-bold tracking-tight md:text-2xl"
                                    >
                                        {section.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground md:text-base">
                                        {section.description}
                                    </p>
                                </div>
                            </header>

                            <PaginatedProductGrid
                                products={section.products}
                                itemsPerPage={4}
                            />
                        </div>
                    </section>
                ))}
            </div>
        </>
    )
}
