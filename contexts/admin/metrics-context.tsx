"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useOrder, type Order } from "@/contexts/order-context"
import { useProductAdmin } from "./product-context"

// Types
export type AdminMetrics = {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    pendingOrders: number
    lowStockProducts: number
    topSellingProducts: {
        id: number
        name: string
        sales: number
        revenue: number
    }[]
    recentOrders: Order[]
    salesByDay: {
        date: string
        orders: number
        revenue: number
    }[]
}

// Context type
type MetricsContextType = {
    getMetrics: () => AdminMetrics
}

// Create context
const MetricsContext = createContext<MetricsContextType | undefined>(undefined)

// Provider component
export function MetricsProvider({ children }: { children: ReactNode }) {
    const { orders } = useOrder()
    const { products } = useProductAdmin()

    // Metrics
    const getMetrics = (): AdminMetrics => {
        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

        // Calculate average order value
        const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

        // Count pending orders
        const pendingOrders = orders.filter((order) => order.status === "pending").length

        // Count low stock products (assuming stock < 10 is low)
        const lowStockProducts = products.filter((product) => (product as any).stock && (product as any).stock < 10).length

        // Get top selling products
        const productSales: Record<number, { id: number; name: string; sales: number; revenue: number }> = {}

        orders.forEach((order) => {
            order.items.forEach((item) => {
                if (!productSales[item.id]) {
                    productSales[item.id] = {
                        id: item.id,
                        name: item.name,
                        sales: 0,
                        revenue: 0,
                    }
                }

                productSales[item.id].sales += item.quantity
                productSales[item.id].revenue += item.subtotal
            })
        })

        const topSellingProducts = Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5)

        // Get recent orders
        const recentOrders = [...orders].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

        // Calculate sales by day for the last 7 days
        const salesByDay: { date: string; orders: number; revenue: number }[] = []
        const today = new Date()

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateString = date.toISOString().split("T")[0]

            const dayOrders = orders.filter((order) => {
                const orderDate = new Date(order.date)
                return orderDate.toISOString().split("T")[0] === dateString
            })

            const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0)

            salesByDay.push({
                date: dateString,
                orders: dayOrders.length,
                revenue: dayRevenue,
            })
        }

        return {
            totalOrders: orders.length,
            totalRevenue,
            averageOrderValue,
            pendingOrders,
            lowStockProducts,
            topSellingProducts,
            recentOrders,
            salesByDay,
        }
    }

    return (
        <MetricsContext.Provider
            value={{
                getMetrics,
            }}
        >
            {children}
        </MetricsContext.Provider>
    )
}

// Custom hook to use the metrics context
export function useMetricsAdmin() {
    const context = useContext(MetricsContext)
    if (context === undefined) {
        throw new Error("useMetricsAdmin must be used within a MetricsProvider")
    }
    return context
}
