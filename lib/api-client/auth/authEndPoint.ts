export const AUTH_ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH_TOKEN: "/auth/refreshToken",
    LOGOUT: "/auth/logout",
} as const

export type AuthEndpoint = (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS]
