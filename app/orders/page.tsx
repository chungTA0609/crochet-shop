"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrder, type OrderStatus } from "@/contexts/order-context"
import { formatCurrency } from "@/lib/utils"
import { Eye, FileText, Search } from "lucide-react"

export default function OrdersPage() {
    const { orders, generateInvoice } = useOrder()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")

    const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Đơn hàng của tôi" }]

    // Filter orders based on search term and status
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Handle status filter change
    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value as OrderStatus | "all")
    }

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

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto p-4 md:p-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Đơn Hàng Của Tôi</h1>

                    {/* Search and Filter */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm đơn hàng..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Tabs
                                defaultValue="all"
                                value={statusFilter}
                                onValueChange={handleStatusFilterChange}
                                className="w-full md:w-auto"
                            >
                                <TabsList className="grid grid-cols-4 md:flex md:flex-row h-auto">
                                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                                    <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
                                    <TabsTrigger value="shipped">Đang giao</TabsTrigger>
                                    <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border">
                            <h2 className="text-xl font-medium mb-2">Không tìm thấy đơn hàng nào</h2>
                            <p className="text-muted-foreground mb-6">
                                {searchTerm ? "Không tìm thấy đơn hàng phù hợp với tìm kiếm của bạn." : "Bạn chưa có đơn hàng nào."}
                            </p>
                            <Button asChild className="bg-pink-500 hover:bg-pink-600">
                                <Link href="/shop">Mua sắm ngay</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
                                    <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">Đơn hàng #{order.orderNumber}</h3>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                                                >
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Ngày đặt: {order.date.toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 self-end md:self-auto">
                                            <Button variant="outline" size="sm" className="h-8" onClick={() => generateInvoice(order)}>
                                                <FileText className="h-4 w-4 mr-1" /> Hóa đơn
                                            </Button>
                                            <Button asChild size="sm" className="h-8 bg-pink-500 hover:bg-pink-600">
                                                <Link href={`/orders/${order.id}`}>
                                                    <Eye className="h-4 w-4 mr-1" /> Chi tiết
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-4">
                                            {/* Order Items */}
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div key={`${order.id}-${item.id}`} className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.quantity} x {formatCurrency(item.price)}
                                                                {item.selectedColor && ` - ${item.selectedColor}`}
                                                                {item.selectedSize && ` - ${item.selectedSize.toUpperCase()}`}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="flex justify-between border-t pt-3">
                                                <div>
                                                    <p className="text-sm">
                                                        <span className="text-muted-foreground">Tổng số lượng:</span>{" "}
                                                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                                                    </p>
                                                    <p className="text-sm">
                                                        <span className="text-muted-foreground">Phương thức thanh toán:</span>{" "}
                                                        {order.paymentMethod === "credit-card"
                                                            ? "Thẻ tín dụng / Thẻ ghi nợ"
                                                            : order.paymentMethod === "paypal"
                                                                ? "PayPal"
                                                                : "Thanh toán khi nhận hàng (COD)"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                                                    <p className="text-lg font-medium text-pink-500">{formatCurrency(order.total)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
