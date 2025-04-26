"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function ResetPasswordPage({
    params,
}: {
    params: { token: string }
}) {
    const { resetPassword, isLoading } = useAuth()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState<{
        password?: string
        confirmPassword?: string
    }>({})

    const validateForm = () => {
        const newErrors: {
            password?: string
            confirmPassword?: string
        } = {}

        if (!password) {
            newErrors.password = "Mật khẩu không được để trống"
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            try {
                await resetPassword(params.token, password)
                setIsSuccess(true)
            } catch (error) {
                // Error is handled by axios interceptor
            }
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Đặt lại mật khẩu</CardTitle>
                <CardDescription className="text-center">Tạo mật khẩu mới cho tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
                {isSuccess ? (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 text-green-800 p-4 rounded-md">
                            <p>Mật khẩu của bạn đã được đặt lại thành công!</p>
                            <p className="mt-2">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
                        </div>
                        <Link href="/auth/login">
                            <Button className="mt-4 bg-pink-600 hover:bg-pink-700">Đi đến trang đăng nhập</Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đặt lại mật khẩu"
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link href="/auth/login" className="text-sm text-pink-600 hover:text-pink-800 font-medium">
                    Quay lại đăng nhập
                </Link>
            </CardFooter>
        </Card>
    )
}
