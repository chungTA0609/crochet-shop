"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAdmin, type User } from "@/contexts/admin-context"
import { useOrder } from "@/contexts/order-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Edit, Package, UserIcon, MapPin, Calendar, Mail, Phone } from "lucide-react"

export default function ViewUserPage() {
    const params = useParams()
    const router = useRouter()
    const { getUser } = useAdmin()
    const { orders } = useOrder()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [userOrders, setUserOrders] = useState<any[]>([])

    const userId = params.id as string

    // Fetch user data
    useEffect(() => {
        if (userId) {
            const userData = getUser(userId)
            if (userData) {
                setUser(userData)

                // Find user orders if they exist
                if (userData.orders && userData.orders.length > 0) {
                    const userOrdersData = orders.filter((order) => userData.orders?.includes(order.id))
                    setUserOrders(userOrdersData)
                }
            } else {
                toast({
                    title: "Người dùng không tồn tại",
                    description: "Không tìm thấy thông tin người dùng với ID đã cung cấp.",
                    variant: "destructive",
                })
                router.push("/admin/users")
            }
            setIsLoading(false)
        }
    }, [userId, getUser, router, orders])

    if (isLoading) {
        return <div className="flex items-center justify-center h-96">Đang tải...</div>
    }

    if (!user) {
        return <div className="flex items-center justify-center h-96">Không tìm thấy người dùng</div>
    }

    // Get status badge color
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800"
            case "inactive":
                return "bg-gray-100 text-gray-800"
            case "blocked":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Get role badge color
    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800"
            case "customer":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
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
                    <h1 className="text-2xl font-bold">Thông tin người dùng</h1>
                </div>
                <Button asChild>
                    <Link href={`/admin/users/${userId}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* User Profile */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Hồ sơ người dùng</CardTitle>
                        <CardDescription>Thông tin cá nhân của người dùng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <UserIcon className="h-12 w-12" />
                            </div>
                            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                            <div className="flex gap-2 mt-2">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                                >
                                    {user.role === "admin" ? "Admin" : "Khách hàng"}
                                </span>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}
                                >
                                    {user.status === "active" ? "Hoạt động" : user.status === "inactive" ? "Không hoạt động" : "Bị chặn"}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">{user.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Ngày tạo: {user.createdAt.toLocaleDateString("vi-VN")}</span>
                            </div>
                            {user.lastLogin && (
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">Đăng nhập gần nhất: {user.lastLogin.toLocaleDateString("vi-VN")}</span>
                                </div>
                            )}
                        </div>

                        {user.address && (
                            <>
                                <Separator />
                                <div>
                                    <div className="flex items-center mb-2">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="font-medium">Địa chỉ</span>
                                    </div>
                                    <div className="text-sm pl-6 space-y-1">
                                        {user.address.street && <p>{user.address.street}</p>}
                                        {(user.address.city || user.address.province) && (
                                            <p>
                                                {user.address.city && `${user.address.city}, `}
                                                {user.address.province}
                                            </p>
                                        )}
                                        {user.address.postalCode && <p>Mã bưu điện: {user.address.postalCode}</p>}
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* User Orders */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Đơn hàng gần đây</CardTitle>
                        <CardDescription>Danh sách đơn hàng của người dùng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userOrders.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Người dùng chưa có đơn hàng nào</div>
                        ) : (
                            <div className="space-y-4">
                                {userOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center">
                                                    <Package className="h-4 w-4 mr-2 text-pink-500" />
                                                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-pink-500">
                                                        Đơn hàng #{order.orderNumber}
                                                    </Link>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Ngày đặt: {order.date.toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-pink-500">{formatCurrency(order.total)}</p>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${order.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : order.status === "paid"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : order.status === "processing"
                                                                    ? "bg-purple-100 text-purple-800"
                                                                    : order.status === "shipped"
                                                                        ? "bg-indigo-100 text-indigo-800"
                                                                        : order.status === "delivered"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : order.status === "completed"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {order.status === "pending"
                                                        ? "Chờ xác nhận"
                                                        : order.status === "paid"
                                                            ? "Đã thanh toán"
                                                            : order.status === "processing"
                                                                ? "Đang xử lý"
                                                                : order.status === "shipped"
                                                                    ? "Đang giao hàng"
                                                                    : order.status === "delivered"
                                                                        ? "Đã giao hàng"
                                                                        : order.status === "completed"
                                                                            ? "Hoàn thành"
                                                                            : "Đã hủy"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-sm font-medium">Sản phẩm:</p>
                                            <div className="mt-1 space-y-1">
                                                {order.items.map((item: any) => (
                                                    <div key={`${order.id}-${item.id}`} className="text-sm flex justify-between">
                                                        <span>
                                                            {item.name} x {item.quantity}
                                                            {item.selectedColor && ` - ${item.selectedColor}`}
                                                            {item.selectedSize && ` - ${item.selectedSize.toUpperCase()}`}
                                                        </span>
                                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
