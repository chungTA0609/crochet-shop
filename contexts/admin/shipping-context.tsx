"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
export type ShippingZone = {
    id: string
    name: string
    regions: string[] // Province/City names
    methods: {
        id: string
        name: string
        description?: string
        price: number
        estimatedDeliveryDays: string
        isActive: boolean
    }[]
}

// Context type
type ShippingContextType = {
    shippingZones: ShippingZone[]
    getShippingZone: (id: string) => ShippingZone | undefined
    createShippingZone: (shippingZone: Omit<ShippingZone, "id">) => ShippingZone
    updateShippingZone: (id: string, shippingZoneData: Partial<ShippingZone>) => boolean
    deleteShippingZone: (id: string) => boolean
}

// Create context
const ShippingContext = createContext<ShippingContextType | undefined>(undefined)

// Sample data
const sampleShippingZones: ShippingZone[] = [
    {
        id: "zone1",
        name: "TP Hồ Chí Minh",
        regions: ["TP Hồ Chí Minh"],
        methods: [
            {
                id: "method1",
                name: "Giao hàng tiêu chuẩn",
                description: "Giao hàng trong 3-5 ngày làm việc",
                price: 30000,
                estimatedDeliveryDays: "3-5 ngày",
                isActive: true,
            },
            {
                id: "method2",
                name: "Giao hàng nhanh",
                description: "Giao hàng trong 1-2 ngày làm việc",
                price: 60000,
                estimatedDeliveryDays: "1-2 ngày",
                isActive: true,
            },
            {
                id: "method3",
                name: "Giao hàng trong ngày",
                description: "Giao hàng trong ngày (áp dụng cho đơn hàng trước 12h)",
                price: 100000,
                estimatedDeliveryDays: "Trong ngày",
                isActive: true,
            },
        ],
    },
    {
        id: "zone2",
        name: "Miền Nam",
        regions: ["Đồng Nai", "Bình Dương", "Vũng Tàu", "Long An", "Tiền Giang"],
        methods: [
            {
                id: "method4",
                name: "Giao hàng tiêu chuẩn",
                description: "Giao hàng trong 3-5 ngày làm việc",
                price: 40000,
                estimatedDeliveryDays: "3-5 ngày",
                isActive: true,
            },
            {
                id: "method5",
                name: "Giao hàng nhanh",
                description: "Giao hàng trong 2-3 ngày làm việc",
                price: 80000,
                estimatedDeliveryDays: "2-3 ngày",
                isActive: true,
            },
        ],
    },
    {
        id: "zone3",
        name: "Miền Trung và Miền Bắc",
        regions: ["Hà Nội", "Đà Nẵng", "Huế", "Quảng Nam", "Quảng Ngãi"],
        methods: [
            {
                id: "method6",
                name: "Giao hàng tiêu chuẩn",
                description: "Giao hàng trong 5-7 ngày làm việc",
                price: 50000,
                estimatedDeliveryDays: "5-7 ngày",
                isActive: true,
            },
            {
                id: "method7",
                name: "Giao hàng nhanh",
                description: "Giao hàng trong 3-4 ngày làm việc",
                price: 100000,
                estimatedDeliveryDays: "3-4 ngày",
                isActive: true,
            },
        ],
    },
]

// Provider component
export function ShippingProvider({ children }: { children: ReactNode }) {
    const [shippingZones, setShippingZones] = useState<ShippingZone[]>(sampleShippingZones)

    // Shipping Zone Management
    const getShippingZone = (id: string): ShippingZone | undefined => {
        return shippingZones.find((shippingZone) => shippingZone.id === id)
    }

    const createShippingZone = (shippingZoneData: Omit<ShippingZone, "id">): ShippingZone => {
        const newShippingZone: ShippingZone = {
            id: `zone${shippingZones.length + 1}`,
            ...shippingZoneData,
        }

        setShippingZones((prevShippingZones) => [...prevShippingZones, newShippingZone])
        return newShippingZone
    }

    const updateShippingZone = (id: string, shippingZoneData: Partial<ShippingZone>): boolean => {
        const shippingZoneIndex = shippingZones.findIndex((shippingZone) => shippingZone.id === id)

        if (shippingZoneIndex === -1) {
            return false
        }

        const updatedShippingZones = [...shippingZones]
        updatedShippingZones[shippingZoneIndex] = { ...updatedShippingZones[shippingZoneIndex], ...shippingZoneData }

        setShippingZones(updatedShippingZones)
        return true
    }

    const deleteShippingZone = (id: string): boolean => {
        const shippingZoneIndex = shippingZones.findIndex((shippingZone) => shippingZone.id === id)

        if (shippingZoneIndex === -1) {
            return false
        }

        const updatedShippingZones = shippingZones.filter((shippingZone) => shippingZone.id !== id)
        setShippingZones(updatedShippingZones)
        return true
    }

    return (
        <ShippingContext.Provider
            value={{
                shippingZones,
                getShippingZone,
                createShippingZone,
                updateShippingZone,
                deleteShippingZone,
            }}
        >
            {children}
        </ShippingContext.Provider>
    )
}

// Custom hook to use the shipping context
export function useShippingAdmin() {
    const context = useContext(ShippingContext)
    if (context === undefined) {
        throw new Error("useShippingAdmin must be used within a ShippingProvider")
    }
    return context
}
