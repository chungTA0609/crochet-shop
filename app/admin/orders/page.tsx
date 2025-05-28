"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useOrder, type Order } from "@/contexts/order-context"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Search, MoreHorizontal, Eye, FileText, AlertTriangle } from "lucide-react"
import { CancelOrderDialog } from "@/components/admin/cancel-order-dialog"
import { UpdateOrderStatusDialog } from "@/components/admin/update-order-status-dialog"
import { getStatusBadgeClass, getStatusText, type OrderStatus } from "@/lib/order-utils"

function AdminOrdersContent() {
    const searchParams = useSearchParams()
    const { orders, generateInvoice } = useOrder()
    const { updateOrderStatus, cancelOrder } = useAdmin()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
    const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
    const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    // Set initial status filter from URL query parameter
    useEffect(() => {
        const status = searchParams.get("status")
        if (status) {
            setStatusFilter(status as OrderStatus)
        }
    }, [searchParams])

    // Filter orders based on search term and status
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Handle status update
    const handleUpdateStatusClick = (order: Order) => {
        setSelectedOrder(order)
        setUpdateStatusDialogOpen(true)
    }

    const handleUpdateStatus = (newStatus: string, statusNote: string) => {
        if (selectedOrder) {
            const success = updateOrderStatus(selectedOrder.id, newStatus as any, statusNote)
            if (success) {
                toast({
                    title: "Cập nhật trạng thái thành công",
                    description: `Đơn hàng #${selectedOrder.orderNumber} đã được cập nhật thành ${getStatusText(newStatus as OrderStatus)}.`,
                })
            } else {
                toast({
                    title: "Cập nhật trạng thái thất bại",
                    description: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
            setUpdateStatusDialogOpen(false)
            setSelectedOrder(null)
        }
    }

    // Handle order cancellation
    const handleCancelOrderClick = (order: Order) => {
        setSelectedOrder(order)
        setCancelOrderDialogOpen(true)
    }

    const handleCancelOrder = (cancelReason: string) => {
        if (selectedOrder) {
            const success = cancelOrder(selectedOrder.id, cancelReason)
            if (success) {
                toast({
                    title: "Hủy đơn hàng thành công",
                    description: `Đơn hàng #${selectedOrder.orderNumber} đã được hủy.`,
                })
            } else {
                toast({
                    title: "Hủy đơn hàng thất bại",
                    description: "Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
            setCancelOrderDialogOpen(false)
            setSelectedOrder(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đơn hàng</CardTitle>
                    <CardDescription>Quản lý tất cả đơn hàng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm đơn hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Tabs
                            defaultValue={statusFilter}
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
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

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã đơn hàng</TableHead>
                                    <TableHead>Ngày đặt</TableHead>
                                    <TableHead>Khách hàng</TableHead>
                                    <TableHead>Tổng tiền</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Không tìm thấy đơn hàng nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                            <TableCell>{order.date.toLocaleDateString("vi-VN")}</TableCell>
                                            <TableCell>{order.shippingAddress.fullName}</TableCell>
                                            <TableCell>{formatCurrency(order.total)}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                                        order.status,
                                                    )}`}
                                                >
                                                    {getStatusText(order.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Mở menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/orders/${order.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem chi tiết
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => generateInvoice(order)}>
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            Tải hóa đơn
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleUpdateStatusClick(order)}>
                                                            Cập nhật trạng thái
                                                        </DropdownMenuItem>
                                                        {order.status !== "cancelled" && order.status !== "completed" && (
                                                            <DropdownMenuItem onClick={() => handleCancelOrderClick(order)}>
                                                                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                                                Hủy đơn hàng
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Use the reusable dialog components */}
            {selectedOrder && (
                <>
                    <UpdateOrderStatusDialog
                        open={updateStatusDialogOpen}
                        onOpenChange={setUpdateStatusDialogOpen}
                        orderNumber={selectedOrder.orderNumber}
                        currentStatus={selectedOrder.status}
                        onConfirm={handleUpdateStatus}
                    />

                    <CancelOrderDialog
                        open={cancelOrderDialogOpen}
                        onOpenChange={setCancelOrderDialogOpen}
                        orderNumber={selectedOrder.orderNumber}
                        onConfirm={handleCancelOrder}
                    />
                </>
            )}
        </div>
    )
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="bg-white border rounded-lg p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <AdminOrdersContent />
        </Suspense>
    )
}
