import { AUTH_ENDPOINTS } from "@/api/auth/authEndPoint"

const DEFAULT_API_URL = "https://audio-king-be.vercel.app/api"
const ACCESS_TOKEN_STORAGE_KEY = "auth_access_token"
const REFRESH_TOKEN_STORAGE_KEY = "auth_refresh_token"

export interface AuthTokens {
    accessToken: string
    refreshToken: string | null
}

interface RequestOptions {
    auth?: boolean
    retryOnUnauthorized?: boolean
}

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_URL

function isClient() {
    return typeof window !== "undefined"
}

export function getAccessToken(): string | null {
    if (!isClient()) return null
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function getRefreshToken(): string | null {
    if (!isClient()) return null
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function setAuthTokens(tokens: AuthTokens) {
    if (!isClient()) return
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken)
    if (tokens.refreshToken) {
        window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
        return
    }

    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function clearAuthTokens() {
    if (!isClient()) return
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

function extractTokenValue(
    payload: Record<string, unknown>,
    keys: readonly string[],
): string | null {
    for (const key of keys) {
        const value = payload[key]
        if (typeof value === "string" && value.trim().length > 0) {
            return value
        }
    }

    return null
}

export function extractAuthTokens(payload: unknown): AuthTokens | null {
    if (!payload || typeof payload !== "object") {
        return null
    }

    const objectPayload = payload as Record<string, unknown>

    const data =
        objectPayload.data && typeof objectPayload.data === "object"
            ? (objectPayload.data as Record<string, unknown>)
            : objectPayload

    const nestedData =
        data.data && typeof data.data === "object"
            ? (data.data as Record<string, unknown>)
            : null

    const candidates: Array<Record<string, unknown>> = [
        objectPayload,
        data,
        ...(nestedData ? [nestedData] : []),
    ]

    for (const candidate of candidates) {
        const accessToken = extractTokenValue(candidate, [
            "accessToken",
            "token",
            "access_token",
        ])
        const refreshToken = extractTokenValue(candidate, [
            "refreshToken",
            "refresh_token",
        ])

        if (accessToken) {
            return { accessToken, refreshToken: refreshToken ?? null }
        }
    }

    return null
}

async function parseErrorMessage(response: Response): Promise<string> {
    try {
        const payload = (await response.json()) as Record<string, unknown>
        const message = payload.message
        if (typeof message === "string" && message.trim().length > 0) {
            return message
        }
    } catch {
        // Ignore invalid JSON response and fallback to statusText.
    }

    return response.statusText || "Request failed"
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
        throw new Error("Missing refresh token")
    }

    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
        const message = await parseErrorMessage(response)
        throw new Error(message)
    }

    const payload: unknown = await response.json()
    const tokens = extractAuthTokens(payload)
    if (!tokens) {
        throw new Error("Invalid refresh token response")
    }

    setAuthTokens(tokens)
    return tokens.accessToken
}

export async function apiRequest<T>(
    path: string,
    init: RequestInit = {},
    options: RequestOptions = {},
): Promise<T> {
    const { auth = true, retryOnUnauthorized = true } = options
    const headers = new Headers(init.headers ?? {})

    if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
        headers.set("Content-Type", "application/json")
    }

    if (auth) {
        const accessToken = getAccessToken()
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`)
        }
    }

    const requestInit: RequestInit = {
        ...init,
        headers,
        credentials: init.credentials ?? "include",
    }

    const response = await fetch(`${API_BASE_URL}${path}`, requestInit)

    if (response.status === 401 && auth && retryOnUnauthorized) {
        try {
            const newAccessToken = await refreshAccessToken()
            headers.set("Authorization", `Bearer ${newAccessToken}`)
            const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
                ...init,
                headers,
                credentials: init.credentials ?? "include",
            })

            if (!retryResponse.ok) {
                const retryMessage = await parseErrorMessage(retryResponse)
                throw new Error(retryMessage)
            }

            if (retryResponse.status === 204) {
                return undefined as T
            }

            return (await retryResponse.json()) as T
        } catch {
            clearAuthTokens()
            throw new Error("Session expired, please login again")
        }
    }

    if (!response.ok) {
        const message = await parseErrorMessage(response)
        throw new Error(message)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return (await response.json()) as T
}

interface ApiMutationInit<B> extends Omit<RequestInit, "method" | "body"> {
    body?: B
}

export async function apiGet<T>(
    path: string,
    init: Omit<RequestInit, "method" | "body"> = {},
    options: RequestOptions = {},
): Promise<T> {
    return apiRequest<T>(
        path,
        {
            ...init,
            method: "GET",
        },
        options,
    )
}

export async function apiPost<T, B = unknown>(
    path: string,
    init: ApiMutationInit<B> = {},
    options: RequestOptions = {},
): Promise<T> {
    const { body, ...requestInit } = init

    return apiRequest<T>(
        path,
        {
            ...requestInit,
            method: "POST",
            body:
                body === undefined || body instanceof FormData
                    ? (body as BodyInit | undefined)
                    : JSON.stringify(body),
        },
        options,
    )
}

export async function apiPut<T, B = unknown>(
    path: string,
    init: ApiMutationInit<B> = {},
    options: RequestOptions = {},
): Promise<T> {
    const { body, ...requestInit } = init

    return apiRequest<T>(
        path,
        {
            ...requestInit,
            method: "PUT",
            body:
                body === undefined || body instanceof FormData
                    ? (body as BodyInit | undefined)
                    : JSON.stringify(body),
        },
        options,
    )
}

export async function apiPatch<T, B = unknown>(
    path: string,
    init: ApiMutationInit<B> = {},
    options: RequestOptions = {},
): Promise<T> {
    const { body, ...requestInit } = init

    return apiRequest<T>(
        path,
        {
            ...requestInit,
            method: "PATCH",
            body:
                body === undefined || body instanceof FormData
                    ? (body as BodyInit | undefined)
                    : JSON.stringify(body),
        },
        options,
    )
}

export async function apiDelete<T>(
    path: string,
    init: Omit<RequestInit, "method"> = {},
    options: RequestOptions = {},
): Promise<T> {
    return apiRequest<T>(
        path,
        {
            ...init,
            method: "DELETE",
        },
        options,
    )
}
