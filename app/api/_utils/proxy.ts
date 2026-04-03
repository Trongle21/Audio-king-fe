const DEFAULT_BACKEND_API_URL = "https://audio-king-be.vercel.app/api"

export const BACKEND_API_URL =
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ?? DEFAULT_BACKEND_API_URL

const HOP_BY_HOP_HEADERS = new Set([
    "host",
    "connection",
    "content-length",
    "accept-encoding",
])

function buildForwardHeaders(request: Request): Headers {
    const headers = new Headers()

    request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase()
        if (HOP_BY_HOP_HEADERS.has(lowerKey)) return
        headers.set(key, value)
    })

    return headers
}

function buildResponseHeaders(source: Headers): Headers {
    const headers = new Headers()

    source.forEach((value, key) => {
        const lowerKey = key.toLowerCase()
        if (HOP_BY_HOP_HEADERS.has(lowerKey)) return
        headers.set(key, value)
    })

    return headers
}

export async function proxyToBackend(
    request: Request,
    backendPath: string,
): Promise<Response> {
    const targetUrl = `${BACKEND_API_URL}${backendPath}`
    const method = request.method.toUpperCase()

    const bodyAllowed = method !== "GET" && method !== "HEAD"
    const body = bodyAllowed ? await request.arrayBuffer() : undefined

    const backendResponse = await fetch(targetUrl, {
        method,
        headers: buildForwardHeaders(request),
        body,
    })

    return new Response(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: buildResponseHeaders(backendResponse.headers),
    })
}
