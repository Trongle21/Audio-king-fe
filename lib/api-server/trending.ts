const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ??
    "https://audio-king-be.vercel.app/api"

interface TrendingItem {
    _id: string
    productId: string
    priority: number
    product: {
        _id: string
        name: string
        price: number
        stock: number
        description: string
        rating: number
        images: Array<{ url: string; alt: string }>
        thumbnail: { url: string; alt: string }
        isDelete?: boolean
    }
}

export async function getTrendingServer(): Promise<TrendingItem[]> {
    const url = `${API_BASE_URL}/trending`

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch trending: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data as TrendingItem[]
}
