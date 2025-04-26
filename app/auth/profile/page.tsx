"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
    const { user, isLoading } = useAuth()
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [isUpdating, setIsUpdating] = useState(false)

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)

        // Simulate API call
        setTimeout(() => {
            setIsUpdating(false)
        }, 1000)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Tài khoản của tôi</h1>

                <div className="max-w-4xl mx-auto">
                    <Tabs defaultValue="profile">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                            <TabsTrigger value="security">Bảo mật</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cá nhân</CardTitle>
                                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Họ tên</Label>
                                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isUpdating} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isUpdating}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input id="phone" placeholder="Nhập số điện thoại của bạn" disabled={isUpdating} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Địa chỉ</Label>
                                            <Input id="address" placeholder="Nhập địa chỉ của bạn" disabled={isUpdating} />
                                        </div>

                                        <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isUpdating}>
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang cập nhật...
                                                </>
                                            ) : (
                                                "Cập nhật thông tin"
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bảo mật</CardTitle>
                                    <CardDescription>Thay đổi mật khẩu của bạn</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                            <Input id="currentPassword" type="password" placeholder="••••••••" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                            <Input id="newPassword" type="password" placeholder="••••••••" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                            <Input id="confirmPassword" type="password" placeholder="••••••••" />
                                        </div>

                                        <Button className="bg-pink-600 hover:bg-pink-700">Đổi mật khẩu</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </>
    )
}
