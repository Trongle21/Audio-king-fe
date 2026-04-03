"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import type { LoginFormData } from "@/lib/schemas/auth.schema"

import { login, type LoginResponse } from "@/api/auth"
import { useAppDispatch } from "@/lib/store/hooks"
import { setAuth } from "@/lib/store/slices/authSlice"


export function useLoginMutate() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    return useMutation<LoginResponse, Error, LoginFormData>({
        mutationFn: login,
        onSuccess: (data) => {
            dispatch(
                setAuth({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: (data.user as Record<string, unknown> | undefined) ?? undefined,
                }),
            )
            router.push("/admin")
        },
    })
}
