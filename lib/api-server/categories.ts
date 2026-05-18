const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ??
    "https://audio-king-be.vercel.app/api"

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

interface CategoryListResponse {
    message: string
    data: {
        items: Category[]
        pagination: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
        filter: {
            q: string | null
        }
    }
}

export async function getCategoriesServer(): Promise<Category[]> {
    const url = `${API_BASE_URL}/categories?page=1&limit=100`

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        console.error(`[getCategoriesServer] Failed to fetch categories: ${response.statusText}`)
        return []
    }

    const result: CategoryListResponse = await response.json()
    return result.data?.items ?? []
}
