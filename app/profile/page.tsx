"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Camera, UserIcon, Shield, Settings, LogOut, CheckCircle, Lock } from "lucide-react"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RoleBadge } from "@/components/user/role-badge"
import { PermissionsList } from "@/components/user/permissions-list"
import { type UserProfile, getRoleDescription } from "@/types/user"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
    const { user, isLoading, logout } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [activeTab, setActiveTab] = useState("profile")

    // Simulate fetching user profile data
    useEffect(() => {
        if (user) {
            // In a real app, you would fetch this from an API
            setProfile({
                ...user,
                phone: "0987654321",
                address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
                createdAt: "2023-01-15",
                lastLogin: "2023-04-28",
                isVerified: true,
                bio: "Tôi là một người yêu thích đồ handmade và thủ công mỹ nghệ.",
                website: "example.com",
                socialLinks: {
                    facebook: "facebook.com/username",
                    instagram: "instagram.com/username",
                },
                preferences: {
                    newsletter: true,
                    marketing: false,
                    notifications: true,
                },
                permissions: ["view_products", "edit_profile", "place_orders"],
            })
        }
        console.log(user);

    }, [user])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)

        // Simulate API call
        setTimeout(() => {
            setIsUpdating(false)
            toast({
                title: "Hồ sơ đã được cập nhật",
                description: "Thông tin cá nhân của bạn đã được cập nhật thành công.",
            })
        }, 1000)
    }

    const handleUpdatePreferences = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)

        // Simulate API call
        setTimeout(() => {
            setIsUpdating(false)
            toast({
                title: "Tùy chọn đã được cập nhật",
                description: "Tùy chọn của bạn đã được cập nhật thành công.",
            })
        }, 1000)
    }

    if (isLoading || !profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            </div>
        )
    }

    return (
        <ProtectedRoute>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                                <AvatarImage src={profile.avatar || "/images/avatar.png"} alt={profile.name} />
                                <AvatarFallback>{profile.firstName}</AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 bg-pink-600 text-white p-1.5 rounded-full shadow-sm hover:bg-pink-700 transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold">{profile.name}</h1>
                                <RoleBadge role={profile.roles} />
                            </div>
                            <p className="text-gray-600 mb-2">{profile.email}</p>
                            {profile.roles}
                            {profile.roles?.map((el) => {
                                return <p className="text-sm text-gray-500 mb-3">{getRoleDescription(el)}</p>
                            })}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="text-sm">
                                    <span className="text-gray-500">Tham gia: </span>
                                    <span>{profile.createdAt}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-500">Đăng nhập gần đây: </span>
                                    <span>{profile.lastLogin}</span>
                                </div>
                                {profile.isVerified && (
                                    <div className="text-sm text-green-600 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Đã xác thực
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                <span className="hidden md:inline">Hồ sơ</span>
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="hidden md:inline">Bảo mật</span>
                            </TabsTrigger>
                            <TabsTrigger value="preferences" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span className="hidden md:inline">Tùy chọn</span>
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span className="hidden md:inline">Quyền hạn</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cá nhân</CardTitle>
                                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Họ tên</Label>
                                                <Input
                                                    id="name"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    disabled={isUpdating}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    disabled={isUpdating}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Số điện thoại</Label>
                                                <Input
                                                    id="phone"
                                                    value={profile.phone || ""}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    disabled={isUpdating}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    id="website"
                                                    value={profile.website || ""}
                                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                    disabled={isUpdating}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Địa chỉ</Label>
                                            <Input
                                                id="address"
                                                value={profile.address || ""}
                                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                disabled={isUpdating}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Giới thiệu</Label>
                                            <Textarea
                                                id="bio"
                                                value={profile.bio || ""}
                                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                disabled={isUpdating}
                                                rows={4}
                                            />
                                        </div>

                                        <Separator className="my-4" />

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">Liên kết mạng xã hội</h3>

                                            <div className="space-y-2">
                                                <Label htmlFor="facebook">Facebook</Label>
                                                <Input
                                                    id="facebook"
                                                    value={profile.socialLinks?.facebook || ""}
                                                    onChange={(e) =>
                                                        setProfile({
                                                            ...profile,
                                                            socialLinks: { ...profile.socialLinks, facebook: e.target.value },
                                                        })
                                                    }
                                                    disabled={isUpdating}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="instagram">Instagram</Label>
                                                <Input
                                                    id="instagram"
                                                    value={profile.socialLinks?.instagram || ""}
                                                    onChange={(e) =>
                                                        setProfile({
                                                            ...profile,
                                                            socialLinks: { ...profile.socialLinks, instagram: e.target.value },
                                                        })
                                                    }
                                                    disabled={isUpdating}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => setActiveTab("preferences")}>
                                        Tùy chọn
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-pink-600 hover:bg-pink-700"
                                        disabled={isUpdating}
                                        onClick={handleUpdateProfile}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            "Cập nhật thông tin"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bảo mật</CardTitle>
                                    <CardDescription>Thay đổi mật khẩu và cài đặt bảo mật</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">Đổi mật khẩu</h3>

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
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">Phiên đăng nhập</h3>
                                            <p className="text-sm text-gray-500">
                                                Đăng xuất khỏi tất cả các thiết bị khác mà bạn đã đăng nhập.
                                            </p>
                                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                                Đăng xuất khỏi các thiết bị khác
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">Xóa tài khoản</h3>
                                            <p className="text-sm text-gray-500">
                                                Xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu liên quan.
                                            </p>
                                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                                Xóa tài khoản
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Preferences Tab */}
                        <TabsContent value="preferences">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tùy chọn</CardTitle>
                                    <CardDescription>Quản lý tùy chọn thông báo và quyền riêng tư</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdatePreferences} className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">Thông báo</h3>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="notifications">Thông báo qua email</Label>
                                                    <p className="text-sm text-gray-500">Nhận thông báo về đơn hàng và cập nhật tài khoản</p>
                                                </div>
                                                <Switch
                                                    id="notifications"
                                                    checked={profile.preferences?.notifications || false}
                                                    onCheckedChange={(checked) =>
                                                        setProfile({
                                                            ...profile,
                                                            preferences: { ...profile.preferences, notifications: checked },
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="newsletter">Bản tin</Label>
                                                    <p className="text-sm text-gray-500">Nhận thông tin về sản phẩm mới và khuyến mãi</p>
                                                </div>
                                                <Switch
                                                    id="newsletter"
                                                    checked={profile.preferences?.newsletter || false}
                                                    onCheckedChange={(checked) =>
                                                        setProfile({
                                                            ...profile,
                                                            preferences: { ...profile.preferences, newsletter: checked },
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="marketing">Tiếp thị</Label>
                                                    <p className="text-sm text-gray-500">Nhận thông tin quảng cáo từ đối tác của chúng tôi</p>
                                                </div>
                                                <Switch
                                                    id="marketing"
                                                    checked={profile.preferences?.marketing || false}
                                                    onCheckedChange={(checked) =>
                                                        setProfile({
                                                            ...profile,
                                                            preferences: { ...profile.preferences, marketing: checked },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium">Ngôn ngữ và khu vực</h3>

                                            <div className="space-y-2">
                                                <Label htmlFor="language">Ngôn ngữ</Label>
                                                <select
                                                    id="language"
                                                    className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                >
                                                    <option value="vi">Tiếng Việt</option>
                                                    <option value="en">English</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="timezone">Múi giờ</Label>
                                                <select
                                                    id="timezone"
                                                    className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                >
                                                    <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
                                                    <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                                                    <option value="Asia/Singapore">Singapore (GMT+8)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => setActiveTab("profile")}>
                                        Hồ sơ
                                    </Button>
                                    <Button
                                        className="bg-pink-600 hover:bg-pink-700"
                                        disabled={isUpdating}
                                        onClick={handleUpdatePreferences}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            "Lưu tùy chọn"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Permissions Tab */}
                        <TabsContent value="permissions">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quyền hạn</CardTitle>
                                    <CardDescription>Xem quyền hạn của tài khoản của bạn</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base font-medium">Vai trò hiện tại:</h3>
                                                <RoleBadge role={profile.roles} />
                                            </div>

                                            {profile.roles?.map((el) => {
                                                return <p className="text-sm text-gray-600">{getRoleDescription(el)}</p>
                                            })}
                                        </div>

                                        <Separator />
                                        {profile.roles?.map((el) => {
                                            return <PermissionsList role={el} />
                                        })}
                                        {profile.roles?.includes("ADMIN") && (
                                            <>
                                                <Separator />

                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-medium">Yêu cầu nâng cấp quyền hạn</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Nếu bạn cần thêm quyền hạn, vui lòng liên hệ với quản trị viên.
                                                    </p>
                                                    <Button variant="outline">Yêu cầu nâng cấp</Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="text-red-600 w-full" onClick={logout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Đăng xuất
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </ProtectedRoute>
    )
}
