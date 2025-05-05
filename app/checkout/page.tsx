"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { CheckoutProvider, useCheckout } from "@/contexts/checkout-context"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ShippingAddress } from "@/components/checkout/shipping-address"
import { ShippingMethodSelector } from "@/components/checkout/shipping-method"
import { PaymentMethod } from "@/components/checkout/payment-method"
import { OrderConfirmation } from "@/components/checkout/order-confirmation"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"

const steps = [
  { id: 1, title: "Giỏ hàng" },
  { id: 2, title: "Địa chỉ" },
  { id: 3, title: "Vận chuyển" },
  { id: 4, title: "Thanh toán" },
  { id: 5, title: "Xác nhận" },
]

// Define the checkout data interface
interface CheckoutData {
  cartItems: any[]
  shippingAddress: any | null
  shippingMethod: any | null
  paymentMethod: string | null
  notes: string
  promoCode: string | null
  subtotal: number
  shippingCost: number
  discount: number
  total: number
}

// Define the price summary interface
interface PriceSummary {
  subtotal: number
  shippingCost: number
  discount: number
  total: number
}

function CheckoutContent() {
  const router = useRouter()
  const { cartItems, cartTotal } = useCart()
  const { state, setStep, savedAddresses, availableShippingMethods } = useCheckout()
  const [isCalculating, setIsCalculating] = useState(false)

  // Initialize checkout data state
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    cartItems: [],
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    notes: "",
    promoCode: null,
    subtotal: 0,
    shippingCost: 0,
    discount: 0,
    total: 0,
  })

  // Update checkout data when relevant state changes
  useEffect(() => {
    setCheckoutData((prev) => ({
      ...prev,
      cartItems: cartItems,
      shippingAddress: state.shippingAddress,
      shippingMethod: state.shippingMethod,
      paymentMethod: state.paymentMethod,
      notes: state.notes,
      promoCode: state.promoCode ? state.promoCode.code : null,
    }))
  }, [cartItems, state.shippingAddress, state.shippingMethod, state.paymentMethod, state.notes, state.promoCode])

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems.length, router])

  // Function to calculate price summary from API based on current step
  const calculatePriceSummary = async (): Promise<PriceSummary> => {
    setIsCalculating(true)
    try {
      let endpoint = ""
      let requestData = {}

      // Determine the API endpoint and request data based on the current step
      switch (state.step) {
        case 1: // Cart step
          endpoint = "/api/checkout/calculate/cart"
          requestData = {
            cartItems: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            promoCode: state.promoCode?.code || null,
          }
          break

        case 2: // Address step
          endpoint = "/api/checkout/calculate/address"
          requestData = {
            cartItems: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            promoCode: state.promoCode?.code || null,
            addressId: state.shippingAddress?.id,
            address: state.shippingAddress,
          }
          break

        case 3: // Shipping method step
          endpoint = "/api/checkout/calculate/shipping"
          requestData = {
            cartItems: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            promoCode: state.promoCode?.code || null,
            addressId: state.shippingAddress?.id,
            address: state.shippingAddress,
            shippingMethodId: state.shippingMethod?.id,
          }
          break

        case 4: // Payment method step
          endpoint = "/api/checkout/calculate/payment"
          requestData = {
            cartItems: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            promoCode: state.promoCode?.code || null,
            addressId: state.shippingAddress?.id,
            address: state.shippingAddress,
            shippingMethodId: state.shippingMethod?.id,
            paymentMethod: state.paymentMethod,
            notes: state.notes,
          }
          break

        default:
          // Default to cart calculation
          endpoint = "/api/checkout/calculate/cart"
          requestData = {
            cartItems: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            promoCode: state.promoCode?.code || null,
          }
      }

      // Make API call to calculate price summary
      const response = await axios.post(endpoint, requestData)

      if (response.data.success) {
        return {
          subtotal: response.data.subtotal || cartTotal,
          shippingCost: response.data.shippingCost || state.shippingMethod?.price || 0,
          discount: response.data.discount || 0,
          total: response.data.total || cartTotal + (state.shippingMethod?.price || 0),
        }
      } else {
        // If API call fails, calculate locally
        console.warn("API calculation failed, using local calculation:", response.data.message)
        return calculateLocalPriceSummary()
      }
    } catch (error) {
      console.error("Error calculating price summary:", error)
      // If API call fails, calculate locally
      return calculateLocalPriceSummary()
    } finally {
      setIsCalculating(false)
    }
  }

  // Local fallback calculation
  const calculateLocalPriceSummary = (): PriceSummary => {
    const subtotal = cartTotal
    const shippingCost = state.shippingMethod?.price || 0
    let discount = 0

    if (state.promoCode) {
      if (state.promoCode.type === "percentage") {
        discount = (subtotal * state.promoCode.discount) / 100
        if (state.promoCode.maxDiscount && discount > state.promoCode.maxDiscount) {
          discount = state.promoCode.maxDiscount
        }
      } else {
        discount = state.promoCode.discount
      }
    }

    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) {
      discount = subtotal
    }

    const total = subtotal + shippingCost - discount

    return {
      subtotal,
      shippingCost,
      discount,
      total,
    }
  }

  // Handle next step
  const handleNextStep = async () => {
    // Validate current step
    if (state.step === 2 && !state.shippingAddress) {
      toast({
        title: "Địa chỉ giao hàng trống",
        description: "Vui lòng chọn địa chỉ giao hàng",
        variant: "destructive",
      })
      return
    }

    if (state.step === 3 && !state.shippingMethod) {
      toast({
        title: "Phương thức vận chuyển trống",
        description: "Vui lòng chọn phương thức vận chuyển",
        variant: "destructive",
      })
      return
    }

    if (state.step === 4 && !state.paymentMethod) {
      toast({
        title: "Phương thức thanh toán trống",
        description: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive",
      })
      return
    }

    try {
      // Calculate price summary from API
      const priceSummary = await calculatePriceSummary()

      // Update checkout data with calculated values
      setCheckoutData((prev) => ({
        ...prev,
        subtotal: priceSummary.subtotal,
        shippingCost: priceSummary.shippingCost,
        discount: priceSummary.discount,
        total: priceSummary.total,
      }))

      // Move to next step
      setStep(state.step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error during step transition:", error)
      toast({
        title: "Lỗi xử lý",
        description: "Đã xảy ra lỗi khi xử lý thông tin. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  // Handle previous step
  const handlePreviousStep = () => {
    setStep(state.step - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle order creation
  const createOrder = async () => {
    try {
      // Show loading toast
      toast({
        title: "Đang xử lý đơn hàng",
        description: "Vui lòng đợi trong giây lát...",
      })

      // Make API call to create order
      const response = await axios.post("/api/orders/create", checkoutData)

      if (response.data.success) {
        // Redirect to success page with order ID
        router.push(`/order-success?orderId=${response.data.orderId}`)
      } else {
        // Show error toast
        toast({
          title: "Lỗi tạo đơn hàng",
          description: response.data.message || "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Lỗi tạo đơn hàng",
        description: "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  // Render current step content
  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return <OrderSummary />
      case 2:
        return <ShippingAddress />
      case 3:
        return <ShippingMethodSelector />
      case 4:
        return <PaymentMethod />
      case 5:
        return <OrderConfirmation checkoutData={checkoutData} onCreateOrder={createOrder} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng", href: "/cart" }, { label: "Thanh toán" }]}
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Thanh Toán</h1>

          {/* Checkout Steps */}
          <CheckoutSteps currentStep={state.step} steps={steps} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderStepContent()}

              {/* Navigation Buttons */}
              {state.step < 5 && (
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePreviousStep} disabled={state.step === 1}>
                    Quay lại
                  </Button>
                  <Button onClick={handleNextStep} className="bg-pink-500 hover:bg-pink-600" disabled={isCalculating}>
                    {isCalculating ? "Đang tính toán..." : state.step === 4 ? "Xác nhận đơn hàng" : "Tiếp tục"}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {state.step < 5 && (
              <div className="lg:col-span-1">
                <OrderSummary isEditable={state.step !== 5} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  )
}
