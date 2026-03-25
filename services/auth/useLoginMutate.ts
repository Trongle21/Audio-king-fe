"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { login, type LoginResponse } from "@/api/auth"
import { useAppDispatch } from "@/lib/store/hooks"
import { setAuth } from "@/lib/store/slices/authSlice"

import type { LoginFormData } from "@/lib/schemas/auth.schema"

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
                    user: data.user ?? undefined,
                }),
            )
            router.push("/admin")
        },
    })
}
