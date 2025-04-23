"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useOrder, type OrderStatus } from "@/contexts/order-context"

// Context type
type OrderAdminContextType = {
    updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => boolean
    cancelOrder: (orderId: string, reason: string) => boolean
    processRefund: (orderId: string, amount: number, reason: string) => boolean
}

// Create context
const OrderAdminContext = createContext<OrderAdminContextType | undefined>(undefined)

// Provider component
export function OrderAdminProvider({ children }: { children: ReactNode }) {
    const { updateOrderStatus: updateOrderStatusInOrderContext } = useOrder()

    // Order Management
    const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string): boolean => {
        return updateOrderStatusInOrderContext(orderId, status, note)
    }

    const cancelOrder = (orderId: string, reason: string): boolean => {
        return updateOrderStatusInOrderContext(orderId, "cancelled", reason)
    }

    const processRefund = (orderId: string, amount: number, reason: string): boolean => {
        // In a real app, you would process the refund through a payment gateway
        // For now, we'll just update the order status and add a note
        return updateOrderStatusInOrderContext(
            orderId,
            "cancelled",
            `Đã hoàn tiền ${amount.toLocaleString("vi-VN")}₫. Lý do: ${reason}`,
        )
    }

    return (
        <OrderAdminContext.Provider
            value={{
                updateOrderStatus,
                cancelOrder,
                processRefund,
            }}
        >
            {children}
        </OrderAdminContext.Provider>
    )
}

// Custom hook to use the order admin context
export function useOrderAdmin() {
    const context = useContext(OrderAdminContext)
    if (context === undefined) {
        throw new Error("useOrderAdmin must be used within an OrderAdminProvider")
    }
    return context
}
