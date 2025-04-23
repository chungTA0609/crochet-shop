"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdmin, type AdminMetrics } from "@/contexts/admin-context"
import { useOrder } from "@/contexts/order-context"
import { formatCurrency } from "@/lib/utils"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { Package, CreditCard, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function AdminDashboard() {
    const { getMetrics } = useAdmin()
    const { orders } = useOrder()
    const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
    const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week")

    useEffect(() => {
        setMetrics(getMetrics())
    }, [getMetrics, orders])

    if (!metrics) {
        return <div>Loading...</div>
    }

    // Calculate percentage changes (mock data for demonstration)
    const orderChange = 12.5 // 12.5% increase from last period
    const revenueChange = 8.3 // 8.3% increase from last period
    const userChange = 5.2 // 5.2% increase from last period
    const aovChange = -2.1 // 2.1% decrease from last period

    // Colors for pie chart
    const COLORS = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"]

    // Order status distribution for pie chart
    const orderStatusData = [
        { name: "Chờ xác nhận", value: orders.filter((order) => order.status === "pending").length },
        { name: "Đã thanh toán", value: orders.filter((order) => order.status === "paid").length },
        { name: "Đang xử lý", value: orders.filter((order) => order.status === "processing").length },
        { name: "Đang giao hàng", value: orders.filter((order) => order.status === "shipped").length },
        {
            name: "Hoàn thành",
            value:
                orders.filter((order) => order.status === "delivered").length +
                orders.filter((order) => order.status === "completed").length,
        },
        { name: "Đã hủy", value: orders.filter((order) => order.status === "cancelled").length },
    ].filter((item) => item.value > 0)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button asChild>
                    <Link href="/admin/orders">Xem tất cả đơn hàng</Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                                <h3 className="text-2xl font-bold">{metrics.totalOrders}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                <Package className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            {orderChange > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    <span>+{orderChange}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    <span>{orderChange}%</span>
                                </div>
                            )}
                            <span className="ml-2 text-muted-foreground">so với tuần trước</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Doanh thu</p>
                                <h3 className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <CreditCard className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            {revenueChange > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    <span>+{revenueChange}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    <span>{revenueChange}%</span>
                                </div>
                            )}
                            <span className="ml-2 text-muted-foreground">so với tuần trước</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Giá trị trung bình</p>
                                <h3 className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            {aovChange > 0 ? (
                                <div className="flex items-center text-green-600">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    <span>+{aovChange}%</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    <span>{aovChange}%</span>
                                </div>
                            )}
                            <span className="ml-2 text-muted-foreground">so với tuần trước</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Đơn hàng chờ xử lý</p>
                                <h3 className="text-2xl font-bold">{metrics.pendingOrders}</h3>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/admin/orders?status=pending">Xem chi tiết</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Doanh thu theo thời gian</CardTitle>
                        <CardDescription>Biểu đồ doanh thu 7 ngày gần nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={metrics.salesByDay}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
                                        }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => {
                                            return value >= 1000000
                                                ? `${(value / 1000000).toFixed(1)}M`
                                                : value >= 1000
                                                    ? `${(value / 1000).toFixed(0)}K`
                                                    : value
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                                        labelFormatter={(label) => {
                                            const date = new Date(label)
                                            return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                                        }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#ec4899" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Số lượng đơn hàng</CardTitle>
                        <CardDescription>Biểu đồ số lượng đơn hàng 7 ngày gần nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={metrics.salesByDay}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) => [value, "Đơn hàng"]}
                                        labelFormatter={(label) => {
                                            const date = new Date(label)
                                            return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                                        }}
                                    />
                                    <Bar dataKey="orders" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố trạng thái đơn hàng</CardTitle>
                        <CardDescription>Tỷ lệ các trạng thái đơn hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <Tooltip formatter={(value) => [`${value} đơn hàng`, ""]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Selling Products */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sản phẩm bán chạy</CardTitle>
                        <CardDescription>Top 5 sản phẩm bán chạy nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metrics.topSellingProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-4">
                                        <span className="font-bold">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{product.name}</h4>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Đã bán: {product.sales} sản phẩm</span>
                                            <span>Doanh thu: {formatCurrency(product.revenue)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                                            <div
                                                className="h-full bg-pink-500 rounded-full"
                                                style={{
                                                    width: `${(product.sales / Math.max(...metrics.topSellingProducts.map((p) => p.sales))) * 100
                                                        }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Đơn hàng gần đây</CardTitle>
                    <CardDescription>Danh sách 5 đơn hàng gần đây nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Mã đơn hàng</th>
                                    <th className="text-left py-3 px-4">Ngày đặt</th>
                                    <th className="text-left py-3 px-4">Khách hàng</th>
                                    <th className="text-left py-3 px-4">Tổng tiền</th>
                                    <th className="text-left py-3 px-4">Trạng thái</th>
                                    <th className="text-right py-3 px-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b">
                                        <td className="py-3 px-4">
                                            <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-pink-600">
                                                #{order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4">{order.date.toLocaleDateString("vi-VN")}</td>
                                        <td className="py-3 px-4">{order.shippingAddress.fullName}</td>
                                        <td className="py-3 px-4">{formatCurrency(order.total)}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "pending"
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
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/admin/orders/${order.id}`}>Chi tiết</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
