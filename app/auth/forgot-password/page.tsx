"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const { forgotPassword, isLoading } = useAuth()
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [errors, setErrors] = useState<{ email?: string }>({})

    const validateForm = () => {
        const newErrors: { email?: string } = {}

        if (!email) {
            newErrors.email = "Email không được để trống"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email không hợp lệ"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            await forgotPassword(email)
            setIsSubmitted(true)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
                <CardDescription className="text-center">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</CardDescription>
            </CardHeader>
            <CardContent>
                {isSubmitted ? (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 text-green-800 p-4 rounded-md">
                            <p>Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến {email}.</p>
                            <p className="mt-2">Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn.</p>
                        </div>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setIsSubmitted(false)
                                setEmail("")
                            }}
                        >
                            Gửi lại email
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Gửi liên kết đặt lại mật khẩu"
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link href="/auth/login" className="text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Quay lại đăng nhập
                </Link>
            </CardFooter>
        </Card>
    )
}
