"use client"

import { createContext, useContext, type ReactNode } from "react"
import { UserProvider, useUserAdmin, type User } from "./admin/user-context"
import { ProductProvider, useProductAdmin, } from "./admin/product-context"
import { CategoryProvider, useCategoryAdmin, type Category } from "./admin/category-context"
import { OrderAdminProvider, useOrderAdmin } from "./admin/order-admin-context"
import { PromoCodeProvider, usePromoCodeAdmin, type PromoCode } from "./admin/promo-code-context"
import { ShippingProvider, useShippingAdmin, type ShippingZone } from "./admin/shipping-context"
import { MetricsProvider, useMetricsAdmin, type AdminMetrics } from "./admin/metrics-context"
import type { OrderStatus } from "@/contexts/order-context"
import { Color, Product } from "@/lib/constants"

// Re-export types
export type { User, Product, Color, Category, PromoCode, ShippingZone, AdminMetrics }

// Context type
type AdminContextType = {
    // Users
    users: User[]
    getUser: (id: string) => User | undefined
    createUser: (user: Omit<User, "id" | "createdAt">) => User
    updateUser: (id: string, userData: Partial<User>) => boolean
    deleteUser: (id: string) => boolean

    // Products
    products: Product[]
    getProduct: (id: number) => Product | undefined
    createProduct: (product: Omit<Product, "id">) => Product
    updateProduct: (id: number, productData: Partial<Product>) => boolean
    deleteProduct: (id: number) => boolean

    // Categories
    categories: Category[]
    getCategory: (id: number) => Category | undefined
    createCategory: (category: Omit<Category, "id" | "productsCount">) => Category
    updateCategory: (id: number, categoryData: Partial<Category>) => boolean
    deleteCategory: (id: number) => boolean

    // Orders
    updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => boolean
    cancelOrder: (orderId: string, reason: string) => boolean
    processRefund: (orderId: string, amount: number, reason: string) => boolean

    // Promo Codes
    promoCodes: PromoCode[]
    getPromoCode: (id: string) => PromoCode | undefined
    createPromoCode: (promoCode: Omit<PromoCode, "id" | "usageCount" | "createdAt" | "updatedAt">) => PromoCode
    updatePromoCode: (id: string, promoCodeData: Partial<PromoCode>) => boolean
    deletePromoCode: (id: string) => boolean

    // Shipping
    shippingZones: ShippingZone[]
    getShippingZone: (id: string) => ShippingZone | undefined
    createShippingZone: (shippingZone: Omit<ShippingZone, "id">) => ShippingZone
    updateShippingZone: (id: string, shippingZoneData: Partial<ShippingZone>) => boolean
    deleteShippingZone: (id: string) => boolean

    // Metrics
    getMetrics: () => AdminMetrics
}

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Provider component
export function AdminProvider({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <ProductProvider>
                <CategoryProvider>
                    <OrderAdminProvider>
                        <PromoCodeProvider>
                            <ShippingProvider>
                                <MetricsProvider>
                                    <AdminProviderInner>{children}</AdminProviderInner>
                                </MetricsProvider>
                            </ShippingProvider>
                        </PromoCodeProvider>
                    </OrderAdminProvider>
                </CategoryProvider>
            </ProductProvider>
        </UserProvider>
    )
}

// Inner provider component that consumes all the individual providers
function AdminProviderInner({ children }: { children: ReactNode }) {
    const userAdmin = useUserAdmin()
    const productAdmin = useProductAdmin()
    const categoryAdmin = useCategoryAdmin()
    const orderAdmin = useOrderAdmin()
    const promoCodeAdmin = usePromoCodeAdmin()
    const shippingAdmin = useShippingAdmin()
    const metricsAdmin = useMetricsAdmin()

    return (
        <AdminContext.Provider
            value={{
                // Users
                ...userAdmin,

                // Products
                ...productAdmin,

                // Categories
                ...categoryAdmin,

                // Orders
                ...orderAdmin,

                // Promo Codes
                ...promoCodeAdmin,

                // Shipping
                ...shippingAdmin,

                // Metrics
                ...metricsAdmin,
            }}
        >
            {children}
        </AdminContext.Provider>
    )
}

// Custom hook to use the admin context
export function useAdmin() {
    const context = useContext(AdminContext)
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
}
