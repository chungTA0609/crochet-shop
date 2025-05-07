"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle2, CreditCard, MapPin, Truck, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

// Define the interface for the checkout data
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

interface OrderConfirmationProps {
  checkoutData: CheckoutData
  onCreateOrder?: () => Promise<void> // Made optional since we'll handle it internally now
}

export function OrderConfirmation({ checkoutData, onCreateOrder }: OrderConfirmationProps) {
  const router = useRouter()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderResult, setOrderResult] = useState<{
    success: boolean
    orderId?: string
    error?: string
  } | null>(null)
  const [processingStep, setProcessingStep] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    setProcessingStep("checkout")

    try {
      // Step 1: Call the checkout API
      const checkoutResponse = await axios.post("/api/checkout/process", checkoutData)

      if (!checkoutResponse.data.success) {
        throw new Error(checkoutResponse.data.message || "Checkout process failed")
      }

      // Get the checkout ID from the response
      const checkoutId = checkoutResponse.data.checkoutId

      // Step 2: Create the order
      setProcessingStep("order")
      const orderResponse = await axios.post("/api/orders/create", {
        checkoutId,
        ...checkoutData,
      })

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Order creation failed")
      }

      // Set success state
      setOrderResult({
        success: true,
        orderId: orderResponse.data.orderId,
      })

      // Show success toast
      toast({
        title: "Đặt hàng thành công!",
        description: `Đơn hàng #${orderResponse.data.orderId} của bạn đã được đặt thành công.`,
      })

      // Redirect to order success page
      setTimeout(() => {
        router.push(`/order-success?orderId=${orderResponse.data.orderId}`)
      }, 2000)
    } catch (error) {
      console.error("Error placing order:", error)

      // Set error state
      setOrderResult({
        success: false,
        error: error instanceof Error ? error.message : "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.",
      })

      // Show error toast
      toast({
        title: "Đặt hàng thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
      setProcessingStep(null)
    }
  }

  // Check if all required information is provided
  const canPlaceOrder = checkoutData.shippingAddress && checkoutData.shippingMethod && checkoutData.paymentMethod

  // Get payment method display name
  const getPaymentMethodName = () => {
    switch (checkoutData.paymentMethod) {
      case "credit-card":
        return "Thẻ tín dụng / Thẻ ghi nợ"
      case "paypal":
        return "PayPal"
      case "cod":
        return "Thanh toán khi nhận hàng (COD)"
      default:
        return "Chưa chọn"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium mb-4">Xác nhận đơn hàng</h2>

      {orderResult && (
        <Alert variant={orderResult.success ? "default" : "destructive"} className="mb-6">
          {orderResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{orderResult.success ? "Đặt hàng thành công!" : "Đặt hàng thất bại"}</AlertTitle>
          <AlertDescription>
            {orderResult.success
              ? `Đơn hàng #${orderResult.orderId} của bạn đã được đặt thành công. Cảm ơn bạn đã mua hàng!`
              : orderResult.error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-pink-500" />
              <h3 className="font-medium">Địa chỉ giao hàng</h3>
            </div>
            {checkoutData.shippingAddress ? (
              <div className="text-sm ml-7">
                <p className="font-medium">{checkoutData.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{checkoutData.shippingAddress.phone}</p>
                <p className="text-muted-foreground mt-1">
                  {checkoutData.shippingAddress.address}, {checkoutData.shippingAddress.city},{" "}
                  {checkoutData.shippingAddress.province}
                </p>
                {checkoutData.shippingAddress.postalCode && (
                  <p className="text-muted-foreground">Mã bưu điện: {checkoutData.shippingAddress.postalCode}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-500 ml-7">Vui lòng chọn địa chỉ giao hàng</p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-pink-500" />
              <h3 className="font-medium">Phương thức vận chuyển</h3>
            </div>
            {checkoutData.shippingMethod ? (
              <div className="text-sm ml-7">
                <p className="font-medium">{checkoutData.shippingMethod.name}</p>
                <p className="text-muted-foreground">{checkoutData.shippingMethod.description}</p>
                <p className="text-muted-foreground">
                  Thời gian giao hàng dự kiến: {checkoutData.shippingMethod.estimatedDelivery}
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500 ml-7">Vui lòng chọn phương thức vận chuyển</p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-pink-500" />
              <h3 className="font-medium">Phương thức thanh toán</h3>
            </div>
            {checkoutData.paymentMethod ? (
              <div className="text-sm ml-7">
                <p className="font-medium">{getPaymentMethodName()}</p>
              </div>
            ) : (
              <p className="text-sm text-red-500 ml-7">Vui lòng chọn phương thức thanh toán</p>
            )}
          </div>

          {checkoutData.notes && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Ghi chú đơn hàng</h3>
              <p className="text-sm text-muted-foreground">{checkoutData.notes}</p>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Tóm tắt đơn hàng</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(checkoutData.subtotal)}</span>
            </div>

            {checkoutData.shippingMethod && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển ({checkoutData.shippingMethod.name})</span>
                <span>{formatCurrency(checkoutData.shippingCost)}</span>
              </div>
            )}

            {checkoutData.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giảm giá</span>
                <span className="text-green-600">-{formatCurrency(checkoutData.discount)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Tổng cộng</span>
              <span className="text-lg text-pink-500">{formatCurrency(checkoutData.total)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-pink-500 hover:bg-pink-600"
            disabled={!canPlaceOrder || isPlacingOrder || orderResult?.success}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {processingStep === "checkout" ? "Đang xử lý thanh toán..." : "Đang tạo đơn hàng..."}
              </div>
            ) : (
              "Đặt hàng"
            )}
          </Button>

          {!canPlaceOrder && !orderResult?.success && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Vui lòng điền đầy đủ thông tin để tiến hành đặt hàng
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
