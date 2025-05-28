"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Form validation schema
const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginContent() {
    const { login, isLoading } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()
    const redirectPath = searchParams?.get("redirect") || "/"

    // Initialize form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    // Form submission handler
    const onSubmit = async (values: LoginFormValues) => {
        await login(values.email, values.password, redirectPath, values.rememberMe)
    }

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
                <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục mua sắm</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="email@example.com"
                                        type="email"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rememberMe"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                    <label
                                        htmlFor="rememberMe"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                            )}
                        />

                        <Link href="/auth/forgot-password" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang đăng nhập...
                            </>
                        ) : (
                            "Đăng nhập"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                        href={`/auth/register?redirect=${encodeURIComponent(redirectPath)}`}
                        className="font-medium text-pink-600 hover:text-pink-500"
                    >
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    )
}

function LoginLoadingFallback() {
    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
                <p className="text-gray-600 mt-2">Đang tải...</p>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoadingFallback />}>
            <LoginContent />
        </Suspense>
    )
}
