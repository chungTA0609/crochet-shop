"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { useOrder } from "@/contexts/order-context"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, CreditCard, FileText, Package, Truck } from "lucide-react"
import { CancelOrderDialog } from "@/components/admin/cancel-order-dialog"
import { UpdateOrderStatusDialog } from "@/components/admin/update-order-status-dialog"
import { getStatusBadgeClass, getStatusText, formatOrderDate } from "@/lib/order-utils"

// Define the Order interface
interface OrderItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}

interface ShippingAddress {
    fullName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
}

interface PaymentInfo {
    method: string
    transactionId?: string
    status: string
}

interface ShippingInfo {
    method: string
    cost: number
    trackingNumber?: string
    carrier?: string
}

interface StatusHistory {
    status: string
    date: Date
    note?: string
}

interface Order {
    id: string
    orderNumber: string
    date: Date
    status: string
    items: OrderItem[]
    subtotal: number
    tax: number
    shippingCost: number
    discount: number
    total: number
    shippingAddress: ShippingAddress
    paymentInfo: PaymentInfo
    shippingInfo: ShippingInfo
    notes?: string
    statusHistory: StatusHistory[]
}

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { generateInvoice } = useOrder()
    const { updateOrderStatus, cancelOrder } = useAdmin()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
    const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false)
    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />
            case "paid":
                return <CreditCard className="h-5 w-5 text-blue-500" />
            case "processing":
                return <Package className="h-5 w-5 text-purple-500" />
            case "shipped":
                return <Truck className="h-5 w-5 text-indigo-500" />
            case "delivered":
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case "cancelled":
                return <AlertTriangle className="h-5 w-5 text-red-500" />
            default:
                return <Clock className="h-5 w-5 text-gray-500" />
        }
    }
    // Fetch order data
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true)
                // Replace with your actual API endpoint
                const response = await axios.get(`/api/orders/${params.id}`)
                setOrder(response.data)
                setError(null)
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.")
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchOrder()
        }
    }, [params.id])

    // Handle status update
    const handleUpdateStatus = (newStatus: string, statusNote: string) => {
        if (order) {
            // Call API to update status
            try {
                // Replace with your actual API call
                updateOrderStatus(order.id, newStatus as any, statusNote)

                // Update local state
                setOrder((prev) => {
                    if (!prev) return null
                    return {
                        ...prev,
                        status: newStatus,
                        statusHistory: [
                            {
                                status: newStatus,
                                date: new Date(),
                                note: statusNote || undefined,
                            },
                            ...prev.statusHistory,
                        ],
                    }
                })

                toast({
                    title: "Cập nhật trạng thái thành công",
                    description: `Đơn hàng #${order.orderNumber} đã được cập nhật thành ${getStatusText(newStatus)}.`,
                })
            } catch (err) {
                console.error("Error updating order status:", err)
                toast({
                    title: "Cập nhật trạng thái thất bại",
                    description: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
        }
    }

    // Handle order cancellation
    const handleCancelOrder = (cancelReason: string) => {
        if (order) {
            // Call API to cancel order
            try {
                // Replace with your actual API call
                cancelOrder(order.id, cancelReason)

                // Update local state
                setOrder((prev) => {
                    if (!prev) return null
                    return {
                        ...prev,
                        status: "cancelled",
                        statusHistory: [
                            {
                                status: "cancelled",
                                date: new Date(),
                                note: cancelReason,
                            },
                            ...prev.statusHistory,
                        ],
                    }
                })

                toast({
                    title: "Hủy đơn hàng thành công",
                    description: `Đơn hàng #${order.orderNumber} đã được hủy.`,
                })
            } catch (err) {
                console.error("Error cancelling order:", err)
                toast({
                    title: "Hủy đơn hàng thất bại",
                    description: "Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy đơn hàng</h2>
                <p className="text-gray-600 mb-6">Đơn hàng không tồn tại hoặc đã bị xóa.</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.orderNumber}</h1>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => generateInvoice(order)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Tải hóa đơn
                    </Button>
                    {order.status !== "cancelled" && order.status !== "completed" && (
                        <>
                            <Button variant="default" onClick={() => setUpdateStatusDialogOpen(true)}>
                                Cập nhật trạng thái
                            </Button>
                            <Button variant="destructive" onClick={() => setCancelOrderDialogOpen(true)}>
                                Hủy đơn hàng
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Summary */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Thông tin đơn hàng</CardTitle>
                        <CardDescription>Chi tiết đơn hàng và trạng thái</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                <p className="font-medium">#{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                                <p className="font-medium">{formatOrderDate(order.date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Trạng thái</p>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(order.status)}
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                            order.status,
                                        )}`}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-medium mb-3">Sản phẩm</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                            <Image
                                                src={item.image || "/images/product-1.jpg"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(item.price)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-medium mb-3">Tóm tắt thanh toán</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Tạm tính</p>
                                    <p>{formatCurrency(order.subtotal)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Thuế</p>
                                    <p>{formatCurrency(order.tax)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Phí vận chuyển</p>
                                    <p>{formatCurrency(order.shippingCost)}</p>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Giảm giá</p>
                                        <p className="text-red-600">-{formatCurrency(order.discount)}</p>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between font-medium">
                                    <p>Tổng cộng</p>
                                    <p>{formatCurrency(order.total)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Họ tên</p>
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{order.shippingAddress.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Địa chỉ email</p>
                                <p className="font-medium">customer@example.com</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Địa chỉ giao hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                            <p>{order.shippingAddress.phone}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                                <p className="font-medium">{order.paymentInfo.method}</p>
                            </div>
                            {order.paymentInfo.transactionId && (
                                <div>
                                    <p className="text-sm text-gray-500">Mã giao dịch</p>
                                    <p className="font-medium">{order.paymentInfo.transactionId}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                                <Badge variant={order.paymentInfo.status === "completed" ? "default" : "outline"}>
                                    {order.paymentInfo.status === "completed" ? "Đã thanh toán" : "Chưa thanh toán"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin vận chuyển</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Phương thức vận chuyển</p>
                                <p className="font-medium">{order.shippingInfo.method}</p>
                            </div>
                            {order.shippingInfo.carrier && (
                                <div>
                                    <p className="text-sm text-gray-500">Đơn vị vận chuyển</p>
                                    <p className="font-medium">{order.shippingInfo.carrier}</p>
                                </div>
                            )}
                            {order.shippingInfo.trackingNumber && (
                                <div>
                                    <p className="text-sm text-gray-500">Mã vận đơn</p>
                                    <p className="font-medium">{order.shippingInfo.trackingNumber}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Order History */}
            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử đơn hàng</CardTitle>
                    <CardDescription>Các cập nhật trạng thái của đơn hàng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.statusHistory.map((history, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="mt-1">{getStatusIcon(history.status)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                                history.status,
                                            )}`}
                                        >
                                            {getStatusText(history.status)}
                                        </span>
                                        <span className="text-sm text-gray-500">{formatOrderDate(history.date)}</span>
                                    </div>
                                    {history.note && <p className="text-sm mt-1">{history.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle>Ghi chú</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{order.notes}</p>
                    </CardContent>
                </Card>
            )}

            {/* Use the reusable dialog components */}
            <UpdateOrderStatusDialog
                open={updateStatusDialogOpen}
                onOpenChange={setUpdateStatusDialogOpen}
                orderNumber={order.orderNumber}
                currentStatus={order.status}
                onConfirm={handleUpdateStatus}
            />

            <CancelOrderDialog
                open={cancelOrderDialogOpen}
                onOpenChange={setCancelOrderDialogOpen}
                orderNumber={order.orderNumber}
                onConfirm={handleCancelOrder}
            />
        </div>
    )
}
