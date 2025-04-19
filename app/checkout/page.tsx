"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
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

const steps = [
  { id: 1, title: "Giỏ hàng" },
  { id: 2, title: "Địa chỉ" },
  { id: 3, title: "Vận chuyển" },
  { id: 4, title: "Thanh toán" },
  { id: 5, title: "Xác nhận" },
]

function CheckoutContent() {
  const router = useRouter()
  const { cartItems } = useCart()
  const { state, setStep } = useCheckout()

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart")
    }
  }, [cartItems.length, router])

  // Handle next step
  const handleNextStep = () => {
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

    setStep(state.step + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle previous step
  const handlePreviousStep = () => {
    setStep(state.step - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
        return <OrderConfirmation />
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
                  <Button onClick={handleNextStep} className="bg-pink-500 hover:bg-pink-600">
                    {state.step === 4 ? "Xác nhận đơn hàng" : "Tiếp tục"}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {state.step < 5 && (
              <div className="lg:col-span-1">
                <OrderSummary isEditable={state.step === 1} />
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
