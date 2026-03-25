import {
    apiRequest,
    clearAuthTokens,
    extractAuthTokens,
    getRefreshToken,
    setAuthTokens,
} from "@/api"

import { AUTH_ENDPOINTS } from "@/api/auth/authEndPoint"

import type { LoginFormData, RegisterFormData } from "@/lib/schemas/auth.schema"

type ApiPayload = Record<string, unknown>

export interface AuthUser {
    id?: string
    email?: string
    name?: string
    role?: string
}

export interface LoginResponse extends ApiPayload {
    accessToken: string
    refreshToken: string | null
    user?: AuthUser
}

function getTokensFromObject(value: unknown) {
    if (!value || typeof value !== "object") {
        return null
    }

    return extractAuthTokens(value)
}

function mapLoginResponse(payload: ApiPayload): LoginResponse {
    const data =
        payload.data && typeof payload.data === "object"
            ? (payload.data as ApiPayload)
            : payload

    const nestedData =
        data.data && typeof data.data === "object"
            ? (data.data as ApiPayload)
            : null

    const userCandidate =
        (data.user && typeof data.user === "object" ? data.user : null) ??
        (data.others && typeof data.others === "object" ? data.others : null) ??
        (nestedData?.user && typeof nestedData.user === "object"
            ? nestedData.user
            : null) ??
        (nestedData?.others && typeof nestedData.others === "object"
            ? nestedData.others
            : null) ??
        null

    const tokens =
        getTokensFromObject(payload) ??
        getTokensFromObject(data) ??
        getTokensFromObject(payload.tokens) ??
        getTokensFromObject(data.tokens)

    if (!tokens) {
        const responseKeys = Object.keys(payload).join(", ")
        throw new Error(`Login response does not contain tokens. Keys: ${responseKeys}`)
    }

    const user = userCandidate ? (userCandidate as AuthUser) : undefined

    return {
        ...payload,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? getRefreshToken(),
        user,
    }
}

export async function login(payload: LoginFormData): Promise<LoginResponse> {
    const response = await apiRequest<ApiPayload>(
        AUTH_ENDPOINTS.LOGIN,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        { auth: false },
    )

    const mappedResponse = mapLoginResponse(response)
    setAuthTokens({
        accessToken: mappedResponse.accessToken,
        refreshToken: mappedResponse.refreshToken,
    })

    return mappedResponse
}

export async function register(payload: RegisterFormData): Promise<LoginResponse> {
    const response = await apiRequest<ApiPayload>(
        AUTH_ENDPOINTS.REGISTER,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
        { auth: false },
    )

    const mappedResponse = mapLoginResponse(response)
    setAuthTokens({
        accessToken: mappedResponse.accessToken,
        refreshToken: mappedResponse.refreshToken,
    })

    return mappedResponse
}

export async function logout(): Promise<void> {
    try {
        await apiRequest<void>(
            AUTH_ENDPOINTS.LOGOUT,
            {
                method: "POST",
            },
            { auth: true, retryOnUnauthorized: false },
        )
    } finally {
        clearAuthTokens()
    }
}

export async function refreshToken(): Promise<LoginResponse> {
    const refreshTokenValue = getRefreshToken()
    if (!refreshTokenValue) {
        throw new Error("Missing refresh token")
    }

    const response = await apiRequest<ApiPayload>(
        AUTH_ENDPOINTS.REFRESH_TOKEN,
        {
            method: "POST",
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        },
        { auth: false },
    )

    const mappedResponse = mapLoginResponse(response)
    setAuthTokens({
        accessToken: mappedResponse.accessToken,
        refreshToken: mappedResponse.refreshToken ?? refreshTokenValue,
    })

    return mappedResponse
}
