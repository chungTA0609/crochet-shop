import { Clock, CreditCard, Package, Truck, CheckCircle, AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "completed" | "cancelled"

// Get status badge color
export function getStatusBadgeClass(status: string): string {
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
export function getStatusText(status: string): string {
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

// Format date for orders
export function formatOrderDate(date: Date): string {
    return new Date(date).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}