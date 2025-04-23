"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useOrder, type Order, type OrderStatus } from "@/contexts/order-context"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Search, MoreHorizontal, Eye, FileText, AlertTriangle } from "lucide-react"

export default function OrdersPage() {
    const searchParams = useSearchParams()
    const { orders, generateInvoice } = useOrder()
    const { updateOrderStatus, cancelOrder } = useAdmin()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
    const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
    const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [newStatus, setNewStatus] = useState<OrderStatus>("pending")
    const [statusNote, setStatusNote] = useState("")
    const [cancelReason, setCancelReason] = useState("")

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
        setNewStatus(order.status)
        setStatusNote("")
        setUpdateStatusDialogOpen(true)
    }

    const confirmUpdateStatus = () => {
        if (selectedOrder && newStatus) {
            const success = updateOrderStatus(selectedOrder.id, newStatus, statusNote)
            if (success) {
                toast({
                    title: "Cập nhật trạng thái thành công",
                    description: `Đơn hàng #${selectedOrder.orderNumber} đã được cập nhật thành ${getStatusText(newStatus)}.`,
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
        setCancelReason("")
        setCancelOrderDialogOpen(true)
    }

    const confirmCancelOrder = () => {
        if (selectedOrder && cancelReason) {
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
        } else if (!cancelReason) {
            toast({
                title: "Vui lòng nhập lý do hủy đơn",
                description: "Bạn cần nhập lý do hủy đơn hàng để tiếp tục.",
                variant: "destructive",
            })
        }
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

            {/* Update Status Dialog */}
            <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                        <DialogDescription>Cập nhật trạng thái cho đơn hàng #{selectedOrder?.orderNumber}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Trạng thái mới</label>
                            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="shipped">Đang giao hàng</SelectItem>
                                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                            <Textarea
                                placeholder="Nhập ghi chú cho trạng thái mới"
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={confirmUpdateStatus}>Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Order Dialog */}
            <Dialog open={cancelOrderDialogOpen} onOpenChange={setCancelOrderDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hủy đơn hàng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn hủy đơn hàng #{selectedOrder?.orderNumber}? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lý do hủy đơn</label>
                            <Textarea
                                placeholder="Nhập lý do hủy đơn hàng"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelOrderDialogOpen(false)}>
                            Quay lại
                        </Button>
                        <Button variant="destructive" onClick={confirmCancelOrder}>
                            Hủy đơn hàng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
