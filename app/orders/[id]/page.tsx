"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useOrder, type Order, type OrderStatus } from "@/contexts/order-context"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, FileText, Package, ShoppingBag } from "lucide-react"

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getOrderById, generateInvoice } = useOrder()
    const [order, setOrder] = useState<Order | null>(null)

    const orderId = params.id as string

    // Get order details
    useEffect(() => {
        if (orderId) {
            const orderDetails = getOrderById(orderId)
            if (orderDetails) {
                setOrder(orderDetails)
            } else {
                // Redirect to orders page if order not found
                router.push("/orders")
            }
        }
    }, [orderId, getOrderById, router])

    if (!order) {
        return null
    }

    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
        { label: "Đơn hàng của tôi", href: "/orders" },
        { label: `Đơn hàng #${order.orderNumber}` },
    ]

    // Get status badge color
    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "paid":
                return "bg-blue-100 text-blue-800"
            case "processing":
                return "bg-purple-100 text-purple-800"
            case "shipped":
                return "bg-indigo-100 text-indigo-800"
            case "delivered":
                return "bg-green-100 text-green-800"
            case "completed":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Get status text in Vietnamese
    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case "pending":
                return "Chờ xác nhận"
            case "paid":
                return "Đã thanh toán"
            case "processing":
                return "Đang xử lý"
            case "shipped":
                return "Đang giao hàng"
            case "delivered":
                return "Đã giao hàng"
            case "completed":
                return "Hoàn thành"
            case "cancelled":
                return "Đã hủy"
            default:
                return status
        }
    }

    // Get payment method text in Vietnamese
    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "credit-card":
                return "Thẻ tín dụng / Thẻ ghi nợ"
            case "paypal":
                return "PayPal"
            case "cod":
                return "Thanh toán khi nhận hàng (COD)"
            default:
                return method
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto p-4 md:p-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Chi Tiết Đơn Hàng #{order.orderNumber}</h1>
                            <p className="text-muted-foreground">Ngày đặt: {order.date.toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href="/orders">
                                    <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
                                </Link>
                            </Button>
                            <Button variant="outline" onClick={() => generateInvoice(order)}>
                                <FileText className="h-4 w-4 mr-1" /> Tải hóa đơn
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-medium">Trạng thái đơn hàng</h2>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                        <div className="space-y-6">
                                            {order.statusHistory.map((statusItem, index) => (
                                                <div key={index} className="relative pl-8">
                                                    <div
                                                        className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? "bg-pink-500 text-white" : "bg-gray-200"
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{getStatusText(statusItem.status)}</p>
                                                        <p className="text-sm text-muted-foreground">{statusItem.date.toLocaleString("vi-VN")}</p>
                                                        {statusItem.note && <p className="text-sm mt-1 italic">{statusItem.note}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-medium">Sản phẩm đã đặt</h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div
                                                key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                                                className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                                            >
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <Image
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <Link href={`/product/${item.id}`} className="font-medium hover:text-pink-500">
                                                            {item.name}
                                                        </Link>
                                                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {item.selectedColor && <span className="capitalize">{item.selectedColor} · </span>}
                                                        {item.selectedSize && <span className="uppercase">{item.selectedSize} · </span>}
                                                        <span>
                                                            {formatCurrency(item.price)} × {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-medium">Tóm tắt đơn hàng</h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tạm tính</span>
                                            <span>{formatCurrency(order.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Phí vận chuyển ({order.shippingMethod.name})</span>
                                            <span>{formatCurrency(order.shippingCost)}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Giảm giá{order.promoCode ? ` (${order.promoCode})` : ""}
                                                </span>
                                                <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-medium">
                                            <span>Tổng cộng</span>
                                            <span className="text-lg text-pink-500">{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-medium">Thông tin giao hàng</h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Người nhận:</p>
                                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Số điện thoại:</p>
                                            <p>{order.shippingAddress.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Địa chỉ:</p>
                                            <p>
                                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province}
                                            </p>
                                            {order.shippingAddress.postalCode && (
                                                <p className="text-sm">Mã bưu điện: {order.shippingAddress.postalCode}</p>
                                            )}
                                        </div>
                                        {order.notes && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Ghi chú:</p>
                                                <p className="italic">{order.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="font-medium">Thông tin thanh toán</h2>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phương thức thanh toán:</p>
                                            <p className="font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Trạng thái thanh toán:</p>
                                            <p
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "pending" && order.paymentMethod === "cod"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {order.status === "pending" && order.paymentMethod === "cod"
                                                    ? "Chưa thanh toán"
                                                    : "Đã thanh toán"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Button asChild className="bg-pink-500 hover:bg-pink-600">
                                    <Link href="/shop">
                                        <ShoppingBag className="h-4 w-4 mr-2" /> Tiếp tục mua sắm
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/orders">
                                        <Package className="h-4 w-4 mr-2" /> Xem tất cả đơn hàng
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
