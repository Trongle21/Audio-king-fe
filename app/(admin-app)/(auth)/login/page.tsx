"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button, Input, Label } from "@/components/atoms"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules"
import { useLogin } from "@/hooks/client-app/src/hooks/auth"
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema"

export default function LoginPage() {
  const { login, isLoading, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    await login(data)
  }

  return (
    <main>
      <article className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              aria-label="Form đăng nhập"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  {...register("email")}
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
                  autoComplete="current-password"
                  {...register("password")}
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
              {error && (
                <div
                  className="text-sm text-destructive text-center"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
            {/* <nav className="mt-4 text-center text-sm" aria-label="Navigation">
              <p className="text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="hover:text-primary font-medium"
                  aria-label="Đăng ký tài khoản mới"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </nav> */}
          </CardContent>
        </Card>
      </article>
    </main>
  )
}
