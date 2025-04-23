"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
export type PromoCode = {
    id: string
    code: string
    type: "percentage" | "fixed" | "free_shipping"
    value: number
    minimumOrderAmount?: number
    maxUsage?: number
    usageCount: number
    startDate: Date
    endDate: Date
    isActive: boolean
    applicableProducts?: number[] // Product IDs
    applicableCategories?: number[] // Category IDs
    createdAt: Date
    updatedAt: Date
}

// Context type
type PromoCodeContextType = {
    promoCodes: PromoCode[]
    getPromoCode: (id: string) => PromoCode | undefined
    createPromoCode: (promoCode: Omit<PromoCode, "id" | "usageCount" | "createdAt" | "updatedAt">) => PromoCode
    updatePromoCode: (id: string, promoCodeData: Partial<PromoCode>) => boolean
    deletePromoCode: (id: string) => boolean
}

// Create context
const PromoCodeContext = createContext<PromoCodeContextType | undefined>(undefined)

// Sample data
const samplePromoCodes: PromoCode[] = [
    {
        id: "promo1",
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minimumOrderAmount: 0,
        maxUsage: 1000,
        usageCount: 45,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        isActive: true,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
    },
    {
        id: "promo2",
        code: "FREESHIP",
        type: "free_shipping",
        value: 0,
        minimumOrderAmount: 300000,
        maxUsage: 500,
        usageCount: 120,
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-06-30"),
        isActive: true,
        createdAt: new Date("2025-03-01"),
        updatedAt: new Date("2025-03-01"),
    },
    {
        id: "promo3",
        code: "SUMMER25",
        type: "percentage",
        value: 25,
        minimumOrderAmount: 500000,
        maxUsage: 200,
        usageCount: 35,
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-08-31"),
        isActive: false,
        createdAt: new Date("2025-05-15"),
        updatedAt: new Date("2025-05-15"),
    },
    {
        id: "promo4",
        code: "FIXED50K",
        type: "fixed",
        value: 50000,
        minimumOrderAmount: 200000,
        maxUsage: 100,
        usageCount: 12,
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-04-30"),
        isActive: true,
        applicableCategories: [1, 2],
        createdAt: new Date("2025-03-25"),
        updatedAt: new Date("2025-03-25"),
    },
]

// Provider component
export function PromoCodeProvider({ children }: { children: ReactNode }) {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>(samplePromoCodes)

    // Promo Code Management
    const getPromoCode = (id: string): PromoCode | undefined => {
        return promoCodes.find((promoCode) => promoCode.id === id)
    }

    const createPromoCode = (
        promoCodeData: Omit<PromoCode, "id" | "usageCount" | "createdAt" | "updatedAt">,
    ): PromoCode => {
        const newPromoCode: PromoCode = {
            id: `promo${promoCodes.length + 1}`,
            usageCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...promoCodeData,
        }

        setPromoCodes((prevPromoCodes) => [...prevPromoCodes, newPromoCode])
        return newPromoCode
    }

    const updatePromoCode = (id: string, promoCodeData: Partial<PromoCode>): boolean => {
        const promoCodeIndex = promoCodes.findIndex((promoCode) => promoCode.id === id)

        if (promoCodeIndex === -1) {
            return false
        }

        const updatedPromoCodes = [...promoCodes]
        updatedPromoCodes[promoCodeIndex] = {
            ...updatedPromoCodes[promoCodeIndex],
            ...promoCodeData,
            updatedAt: new Date(),
        }

        setPromoCodes(updatedPromoCodes)
        return true
    }

    const deletePromoCode = (id: string): boolean => {
        const promoCodeIndex = promoCodes.findIndex((promoCode) => promoCode.id === id)

        if (promoCodeIndex === -1) {
            return false
        }

        const updatedPromoCodes = promoCodes.filter((promoCode) => promoCode.id !== id)
        setPromoCodes(updatedPromoCodes)
        return true
    }

    return (
        <PromoCodeContext.Provider
            value={{
                promoCodes,
                getPromoCode,
                createPromoCode,
                updatePromoCode,
                deletePromoCode,
            }}
        >
            {children}
        </PromoCodeContext.Provider>
    )
}

// Custom hook to use the promo code context
export function usePromoCodeAdmin() {
    const context = useContext(PromoCodeContext)
    if (context === undefined) {
        throw new Error("usePromoCodeAdmin must be used within a PromoCodeProvider")
    }
    return context
}
