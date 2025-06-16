"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem } from "@/contexts/cart-context"
import type { Address, ShippingMethod, PaymentMethod } from "@/contexts/checkout-context"
import { formatCurrency } from "@/lib/utils"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

// Types
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "completed" | "cancelled"

export type OrderItem = CartItem & {
    subtotal: number
}

export type Order = {
    id: string
    orderNumber: string
    date: Date
    items: OrderItem[]
    shippingAddress: Address
    shippingMethod: ShippingMethod
    paymentMethod: PaymentMethod
    subtotal: number
    shippingCost: number
    discount: number
    total: number
    status: OrderStatus
    statusHistory: {
        status: OrderStatus
        date: Date
        note?: string
    }[]
    notes?: string
    promoCode?: string
}

// Context type
type OrderContextType = {
    orders: Order[]
    createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "statusHistory">) => Promise<Order>
    getOrderById: (id: string) => Order | undefined
    getOrderByNumber: (orderNumber: string) => Order | undefined
    updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => boolean
    generateInvoice: (order: Order) => void
}

// Create context
const OrderContext = createContext<OrderContextType | undefined>(undefined)

// Sample data - mock orders
const sampleOrders: Order[] = [
    {
        id: "ord1",
        orderNumber: "ORD123456",
        date: new Date("2025-04-15T10:30:00"),
        items: [
            {
                id: 1,
                name: "Móc khóa hình gấu nhỏ xinh",
                price: 250000,
                image: "/images/product-1.jpg",
                category: "Móc khóa",
                quantity: 2,
                selectedColor: "Hồng",
                selectedSize: "s",
                subtotal: 500000,
            },
            {
                id: 3,
                name: "Thú bông chuột nhỏ",
                price: 350000,
                image: "/images/product-3.jpg",
                category: "Thú bông",
                quantity: 1,
                subtotal: 350000,
            },
        ],
        shippingAddress: {
            id: "addr1",
            fullName: "Nguyễn Văn A",
            phone: "0901234567",
            email: "nguyenvana@example.com",
            address: "123 Đường Lê Lợi, Phường Bến Nghé",
            city: "Quận 1",
            province: "TP Hồ Chí Minh",
            postalCode: "700000",
            isDefault: false,
        },
        shippingMethod: {
            id: "standard",
            name: "Giao hàng tiêu chuẩn",
            description: "Giao hàng trong 3-5 ngày làm việc",
            price: 30000,
            estimatedDelivery: "3-5 ngày",
            isDefault: true,
        },
        paymentMethod: "cod",
        subtotal: 850000,
        shippingCost: 30000,
        discount: 0,
        total: 880000,
        status: "delivered",
        statusHistory: [
            { status: "pending", date: new Date("2025-04-15T10:30:00") },
            { status: "paid", date: new Date("2025-04-15T11:45:00") },
            { status: "processing", date: new Date("2025-04-16T09:15:00") },
            { status: "shipped", date: new Date("2025-04-17T14:20:00"), note: "Đã giao cho đơn vị vận chuyển" },
            { status: "delivered", date: new Date("2025-04-19T10:05:00"), note: "Đã giao hàng thành công" },
        ],
        notes: "Gọi điện trước khi giao hàng",
    },
    {
        id: "ord2",
        orderNumber: "ORD789012",
        date: new Date("2025-04-10T15:45:00"),
        items: [
            {
                id: 2,
                name: "Móc khóa hình thỏ",
                price: 250000,
                image: "/images/product-2.jpg",
                category: "Móc khóa",
                quantity: 1,
                selectedColor: "Xanh dương",
                subtotal: 250000,
            },
        ],
        shippingAddress: {
            id: "addr1",
            fullName: "Nguyễn Văn A",
            phone: "0901234567",
            email: "nguyenvana@example.com",
            address: "123 Đường Lê Lợi, Phường Bến Nghé",
            city: "Quận 1",
            province: "TP Hồ Chí Minh",
            postalCode: "700000",
            isDefault: false,
        },
        shippingMethod: {
            id: "express",
            name: "Giao hàng nhanh",
            description: "Giao hàng trong 1-2 ngày làm việc",
            price: 60000,
            estimatedDelivery: "1-2 ngày",
            isDefault: false,
        },
        paymentMethod: "credit-card",
        subtotal: 250000,
        shippingCost: 60000,
        discount: 25000,
        total: 285000,
        status: "completed",
        statusHistory: [
            { status: "pending", date: new Date("2025-04-10T15:45:00") },
            { status: "paid", date: new Date("2025-04-10T15:46:00") },
            { status: "processing", date: new Date("2025-04-11T08:30:00") },
            { status: "shipped", date: new Date("2025-04-11T14:15:00") },
            { status: "delivered", date: new Date("2025-04-12T11:20:00") },
            { status: "completed", date: new Date("2025-04-19T00:00:00") },
        ],
        promoCode: "WELCOME10",
    },
    {
        id: "ord3",
        orderNumber: "ORD345678",
        date: new Date("2025-04-18T09:15:00"),
        items: [
            {
                id: 5,
                name: "Thú bông vịt vàng",
                price: 350000,
                image: "/images/product-5.jpg",
                category: "Thú bông",
                quantity: 1,
                subtotal: 350000,
            },
            {
                id: 8,
                name: "Hoa hồng len đỏ",
                price: 150000,
                image: "/images/product-8.jpg",
                category: "Hoa",
                quantity: 2,
                subtotal: 300000,
            },
        ],
        shippingAddress: {
            id: "addr2",
            fullName: "Nguyễn Văn A",
            phone: "0901234567",
            email: "nguyenvana@example.com",
            address: "456 Đường Nguyễn Huệ",
            city: "Quận 3",
            province: "TP Hồ Chí Minh",
            postalCode: "700000",
            isDefault: false,
        },
        shippingMethod: {
            id: "standard",
            name: "Giao hàng tiêu chuẩn",
            description: "Giao hàng trong 3-5 ngày làm việc",
            price: 30000,
            estimatedDelivery: "3-5 ngày",
            isDefault: false,
        },
        paymentMethod: "paypal",
        subtotal: 650000,
        shippingCost: 30000,
        discount: 0,
        total: 680000,
        status: "shipped",
        statusHistory: [
            { status: "pending", date: new Date("2025-04-18T09:15:00") },
            { status: "paid", date: new Date("2025-04-18T09:16:00") },
            { status: "processing", date: new Date("2025-04-19T10:30:00") },
            { status: "shipped", date: new Date("2025-04-20T14:45:00"), note: "Đã giao cho đơn vị vận chuyển" },
        ],
    },
]

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([])

    // Load orders from localStorage on initial render
    useEffect(() => {
        // Try to get orders from localStorage
        const storedOrders = localStorage.getItem("orders")

        if (storedOrders) {
            try {
                // Parse the stored orders and convert date strings back to Date objects
                const parsedOrders = JSON.parse(storedOrders, (key, value) => {
                    // Convert date strings back to Date objects
                    if (key === "date" || key === "statusHistory") {
                        if (Array.isArray(value)) {
                            return value.map((item) => ({
                                ...item,
                                date: new Date(item.date),
                            }))
                        }
                        return new Date(value)
                    }
                    return value
                })
                setOrders(parsedOrders)
            } catch (error) {
                console.error("Failed to parse orders from localStorage:", error)
                // If parsing fails, use sample orders
                setOrders(sampleOrders)
            }
        } else {
            // If no orders in localStorage, use sample orders
            setOrders(sampleOrders)
        }
    }, [])

    // Save orders to localStorage whenever they change
    useEffect(() => {
        if (orders.length > 0) {
            localStorage.setItem("orders", JSON.stringify(orders))
        }
    }, [orders])

    // Create a new order
    const createOrder = async (orderData: Omit<Order, "id" | "orderNumber" | "statusHistory">): Promise<Order> => {
        // Generate a unique ID
        const id = `ord${orders.length + 1}`

        // Generate an order number (format: ORD + 6 random digits)
        const orderNumber = `ORD${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0")}`

        // Create status history with initial "pending" status
        const statusHistory = [{ status: "pending" as OrderStatus, date: new Date() }]

        // Create the new order
        const newOrder: Order = {
            id,
            orderNumber,
            statusHistory,
            ...orderData,
        }

        // Add the new order to the orders array
        setOrders((prevOrders) => [newOrder, ...prevOrders])

        // Return the new order
        return newOrder
    }

    // Get an order by ID
    const getOrderById = (id: string): Order | undefined => {
        return orders.find((order) => order.id === id)
    }

    // Get an order by order number
    const getOrderByNumber = (orderNumber: string): Order | undefined => {
        return orders.find((order) => order.orderNumber === orderNumber)
    }

    // Update order status
    const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string): boolean => {
        const orderIndex = orders.findIndex((order) => order.id === orderId)

        if (orderIndex === -1) {
            return false
        }

        const updatedOrders = [...orders]
        updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            status,
            statusHistory: [...updatedOrders[orderIndex].statusHistory, { status, date: new Date(), note }],
        }

        setOrders(updatedOrders)
        return true
    }

    // Generate invoice PDF
    const generateInvoice = (order: Order) => {
        try {
            // Create a new PDF document
            const doc = new jsPDF()

            // Add company logo and info
            doc.setFontSize(20)
            doc.setTextColor(236, 72, 153) // Pink color
            doc.text("Tiểu Phương Crochet", 105, 20, { align: "center" })

            doc.setFontSize(10)
            doc.setTextColor(100)
            doc.text("123 Đường ABC, Quận 1, TP Hồ Chí Minh", 105, 25, { align: "center" })
            doc.text("Email: tieuphuong@example.com | SĐT: +84 123 456 789", 105, 30, { align: "center" })

            // Add invoice title and details
            doc.setFontSize(16)
            doc.setTextColor(0)
            doc.text("HÓA ĐƠN", 105, 40, { align: "center" })

            doc.setFontSize(10)
            doc.text(`Số hóa đơn: ${order.orderNumber}`, 14, 50)
            doc.text(`Ngày đặt hàng: ${order.date.toLocaleDateString("vi-VN")}`, 14, 55)
            doc.text(`Trạng thái: ${getStatusText(order.status)}`, 14, 60)

            // Customer information
            doc.setFontSize(12)
            doc.text("Thông tin khách hàng", 14, 70)

            doc.setFontSize(10)
            doc.text(`Họ tên: ${order.shippingAddress.fullName}`, 14, 75)
            doc.text(`Số điện thoại: ${order.shippingAddress.phone}`, 14, 80)
            doc.text(
                `Địa chỉ: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.province}`,
                14,
                85,
            )

            // Order items
            doc.setFontSize(12)
            doc.text("Chi tiết đơn hàng", 14, 95)

            // Create table for order items
            const tableColumn = ["STT", "Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền"]
            const tableRows = order.items.map((item, index) => [
                (index + 1).toString(),
                item.name +
                (item.selectedColor ? ` (${item.selectedColor})` : "") +
                (item.selectedSize ? ` - ${item.selectedSize.toUpperCase()}` : ""),
                formatCurrency(item.price),
                item.quantity.toString(),
                formatCurrency(item.price * item.quantity),
            ])

            // @ts-ignore - jspdf-autotable types are not available
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 100,
                theme: "grid",
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255] },
            })

            // Get the final y position after the table
            // @ts-ignore - jspdf-autotable types are not available
            const finalY = (doc as any).lastAutoTable.finalY || 150

            // Order summary
            doc.setFontSize(10)
            doc.text("Tạm tính:", 130, finalY + 10)
            doc.text(formatCurrency(order.subtotal), 170, finalY + 10, { align: "right" })

            doc.text("Phí vận chuyển:", 130, finalY + 15)
            doc.text(formatCurrency(order.shippingCost), 170, finalY + 15, { align: "right" })

            if (order.discount > 0) {
                doc.text("Giảm giá:", 130, finalY + 20)
                doc.text(`- ${formatCurrency(order.discount)}`, 170, finalY + 20, { align: "right" })

                doc.setFontSize(12)
                doc.setFont("helvetica", "bold")
                doc.text("Tổng cộng:", 130, finalY + 30)
                doc.text(formatCurrency(order.total), 170, finalY + 30, { align: "right" })
            } else {
                doc.setFontSize(12)
                doc.setFont("helvetica", "bold")
                doc.text("Tổng cộng:", 130, finalY + 25)
                doc.text(formatCurrency(order.total), 170, finalY + 25, { align: "right" })
            }

            // Payment and shipping information
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            doc.text(`Phương thức thanh toán: ${getPaymentMethodText(order.paymentMethod)}`, 14, finalY + 40)
            doc.text(`Phương thức vận chuyển: ${order.shippingMethod.name}`, 14, finalY + 45)

            // Footer
            doc.setFontSize(8)
            doc.setTextColor(100)
            doc.text("Cảm ơn quý khách đã mua hàng tại Tiểu Phương Crochet!", 105, finalY + 60, { align: "center" })
            doc.text("Mọi thắc mắc xin vui lòng liên hệ: tieuphuong@example.com hoặc +84 123 456 789", 105, finalY + 65, {
                align: "center",
            })

            // Save the PDF
            doc.save(`hoa-don-${order.orderNumber}.pdf`)
        } catch (error) {
            console.error("Error generating invoice:", error)
        }
    }

    // Helper function to get status text in Vietnamese
    const getStatusText = (status: OrderStatus): string => {
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

    // Helper function to get payment method text in Vietnamese
    const getPaymentMethodText = (method: PaymentMethod): string => {
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
        <OrderContext.Provider
            value={{
                orders,
                createOrder,
                getOrderById,
                getOrderByNumber,
                updateOrderStatus,
                generateInvoice,
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

// Custom hook to use the order context
export function useOrder() {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error("useOrder must be used within an OrderProvider")
    }
    return context
}
