"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useCart } from "@/contexts/cart-context"

// Types
export type ShippingMethod = {
  id: string
  name: string
  description: string
  price: number
  estimatedDelivery: string
}

export type PaymentMethod = "credit-card" | "paypal" | "cod"

export type Address = {
  id: string
  fullName: string
  phone: string
  email?: string
  address: string
  city: string
  province: string
  postalCode: string
  isDefault?: boolean
}

export type PromoCode = {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minimumOrder?: number
  expiryDate?: Date
}

export type CheckoutState = {
  step: number
  shippingAddress: Address | null
  shippingMethod: ShippingMethod | null
  paymentMethod: PaymentMethod | null
  promoCode: PromoCode | null
  notes: string
}

// Context type
type CheckoutContextType = {
  state: CheckoutState
  savedAddresses: Address[]
  availableShippingMethods: ShippingMethod[]
  subTotal: number
  shippingCost: number
  discount: number
  total: number
  setStep: (step: number) => void
  setShippingAddress: (address: Address | null) => void
  addNewAddress: (address: Address) => void
  setShippingMethod: (method: ShippingMethod | null) => void
  setPaymentMethod: (method: PaymentMethod | null) => void
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => PromoCode | null
  setNotes: (notes: string) => void
  placeOrder: () => Promise<{ success: boolean; orderId?: string; error?: string }>
}

// Create context
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

// Sample data
const sampleAddresses: Address[] = [
  {
    id: "addr1",
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    address: "123 Đường Lê Lợi, Phường Bến Nghé",
    city: "Quận 1",
    province: "TP Hồ Chí Minh",
    postalCode: "700000",
    isDefault: true,
  },
  {
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
]

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    description: "Giao hàng trong 3-5 ngày làm việc",
    price: 30000,
    estimatedDelivery: "3-5 ngày",
  },
  {
    id: "express",
    name: "Giao hàng nhanh",
    description: "Giao hàng trong 1-2 ngày làm việc",
    price: 60000,
    estimatedDelivery: "1-2 ngày",
  },
  {
    id: "same-day",
    name: "Giao hàng trong ngày",
    description: "Giao hàng trong ngày (áp dụng cho đơn hàng trước 12h)",
    price: 100000,
    estimatedDelivery: "Trong ngày",
  },
  {
    id: "pickup",
    name: "Nhận tại cửa hàng",
    description: "Nhận hàng tại cửa hàng (miễn phí)",
    price: 0,
    estimatedDelivery: "Có thể nhận ngay",
  },
]

const promoCodes: PromoCode[] = [
  {
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    minimumOrder: 0,
    expiryDate: new Date("2025-12-31"),
  },
  {
    code: "FREESHIP",
    discount: 30000,
    type: "fixed",
    minimumOrder: 300000,
    expiryDate: new Date("2025-12-31"),
  },
  {
    code: "SUMMER25",
    discount: 25,
    type: "percentage",
    minimumOrder: 500000,
    expiryDate: new Date("2025-12-31"),
  },
]

// Provider component
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { cartItems, cartTotal, clearCart } = useCart()

  const [state, setState] = useState<CheckoutState>({
    step: 1,
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    promoCode: null,
    notes: "",
  })

  const [savedAddresses, setSavedAddresses] = useState<Address[]>(sampleAddresses)

  // Initialize with default address if available
  useEffect(() => {
    if (savedAddresses.length > 0 && !state.shippingAddress) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault) || savedAddresses[0]
      setState((prev) => ({ ...prev, shippingAddress: defaultAddress }))
    }
  }, [savedAddresses, state.shippingAddress])

  // Calculate totals
  const subTotal = cartTotal
  const shippingCost = state.shippingMethod?.price || 0

  // Calculate discount
  const calculateDiscount = (): number => {
    if (!state.promoCode) return 0

    if (state.promoCode.type === "percentage") {
      return (subTotal * state.promoCode.discount) / 100
    } else {
      return state.promoCode.discount
    }
  }

  const discount = calculateDiscount()
  const total = subTotal + shippingCost - discount

  // Set step
  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, step }))
  }

  // Set shipping address
  const setShippingAddress = (address: Address | null) => {
    setState((prev) => ({ ...prev, shippingAddress: address }))
  }

  // Add new address
  const addNewAddress = (address: Address) => {
    const newAddress = {
      ...address,
      id: `addr${savedAddresses.length + 1}`,
    }

    // If this is the first address or marked as default, set all others to non-default
    if (savedAddresses.length === 0 || address.isDefault) {
      setSavedAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: false })).concat(newAddress))
    } else {
      setSavedAddresses((prev) => [...prev, newAddress])
    }

    // Set as current shipping address
    setShippingAddress(newAddress)
  }

  // Set shipping method
  const setShippingMethod = (method: ShippingMethod | null) => {
    setState((prev) => ({ ...prev, shippingMethod: method }))
  }

  // Set payment method
  const setPaymentMethod = (method: PaymentMethod | null) => {
    setState((prev) => ({ ...prev, paymentMethod: method }))
  }

  // Apply promo code
  const applyPromoCode = (code: string): boolean => {
    const promoCode = promoCodes.find((promo) => promo.code.toLowerCase() === code.toLowerCase())

    if (!promoCode) {
      return false
    }

    // Check if minimum order is met
    if (promoCode.minimumOrder && subTotal < promoCode.minimumOrder) {
      return false
    }

    // Check if code is expired
    if (promoCode.expiryDate && new Date() > promoCode.expiryDate) {
      return false
    }

    setState((prev) => ({ ...prev, promoCode }))
    return true
  }

  // Remove promo code
  const removePromoCode = () => {
    const removedCode = state.promoCode
    setState((prev) => ({ ...prev, promoCode: null }))
    return removedCode
  }

  // Set notes
  const setNotes = (notes: string) => {
    setState((prev) => ({ ...prev, notes }))
  }

  // Place order
  const placeOrder = async (): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    // Validate required fields
    if (!state.shippingAddress) {
      return { success: false, error: "Vui lòng chọn địa chỉ giao hàng" }
    }

    if (!state.shippingMethod) {
      return { success: false, error: "Vui lòng chọn phương thức vận chuyển" }
    }

    if (!state.paymentMethod) {
      return { success: false, error: "Vui lòng chọn phương thức thanh toán" }
    }

    // In a real app, you would send the order to your backend here
    // For now, we'll simulate a successful order

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random order ID
        const orderId = `ORD${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")}`

        // Clear the cart
        clearCart()

        // Return success
        resolve({ success: true, orderId })
      }, 1500)
    })
  }

  return (
    <CheckoutContext.Provider
      value={{
        state,
        savedAddresses,
        availableShippingMethods: shippingMethods,
        subTotal,
        shippingCost,
        discount,
        total,
        setStep,
        setShippingAddress,
        addNewAddress,
        setShippingMethod,
        setPaymentMethod,
        applyPromoCode,
        removePromoCode,
        setNotes,
        placeOrder,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

// Custom hook to use the checkout context
export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
