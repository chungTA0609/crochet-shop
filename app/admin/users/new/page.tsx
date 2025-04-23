"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save } from "lucide-react"

export default function NewUserPage() {
    const router = useRouter()
    const { createUser } = useAdmin()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "customer" as "admin" | "customer",
        status: "active" as "active" | "inactive" | "blocked",
        address: {
            street: "",
            city: "",
            province: "",
            postalCode: "",
        },
    })

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form data
        if (!formData.name || !formData.email || !formData.phone) {
            toast({
                title: "Thông tin không đầy đủ",
                description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
                variant: "destructive",
            })
            return
        }

        // Create user
        try {
            const newUser = createUser(formData)

            toast({
                title: "Tạo người dùng thành công",
                description: "Người dùng mới đã được tạo thành công.",
            })

            router.push("/admin/users")
        } catch (error) {
            toast({
                title: "Tạo người dùng thất bại",
                description: "Đã xảy ra lỗi khi tạo người dùng mới. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" asChild className="mr-2">
                        <Link href="/admin/users">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Thêm người dùng mới</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                            <CardDescription>Nhập thông tin cơ bản của người dùng mới</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Họ và tên <span className="text-red-500">*</span>
                                </Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="role">Vai trò</Label>
                                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="customer">Khách hàng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleSelectChange("status", value as "active" | "inactive" | "blocked")}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                                        <SelectItem value="blocked">Bị chặn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin địa chỉ</CardTitle>
                            <CardDescription>Nhập thông tin địa chỉ của người dùng mới</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address.street">Địa chỉ</Label>
                                <Input
                                    id="address.street"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.city">Quận/Huyện</Label>
                                <Input
                                    id="address.city"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.province">Tỉnh/Thành phố</Label>
                                <Input
                                    id="address.province"
                                    name="address.province"
                                    value={formData.address.province}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.postalCode">Mã bưu điện</Label>
                                <Input
                                    id="address.postalCode"
                                    name="address.postalCode"
                                    value={formData.address.postalCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin/users">Hủy</Link>
                    </Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Tạo người dùng
                    </Button>
                </div>
            </form>
        </div>
    )
}
