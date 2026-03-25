"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules"
import { useRegister } from "@/hooks/client-app/src/hooks/auth"
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/schemas/auth.schema"

export default function RegisterPage() {
  const { register: registerAction, isLoading, error } = useRegister()

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    await registerAction(data)
  }

  return (
    <main>
      <article className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              aria-label="Form đăng ký"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  autoComplete="name"
                  {...rhfRegister("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby={errors.username ? "username-error" : undefined}
                />
                {errors.username && (
                  <p
                    id="name-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  {...rhfRegister("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...rhfRegister("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...rhfRegister("confirmPassword")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword ? "confirmPassword-error" : undefined
                  }
                />
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {error && (
                <div
                  className="text-sm text-destructive text-center"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
            <nav className="mt-4 text-center text-sm" aria-label="Navigation">
              <p className="text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="hover:text-primary cursor-pointer font-medium"
                  aria-label="Đăng nhập"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </nav>
          </CardContent>
        </Card>
      </article>
    </main>
  )
}
