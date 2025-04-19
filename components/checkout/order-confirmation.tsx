"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCheckout } from "@/contexts/checkout-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle2, CreditCard, MapPin, Truck, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OrderConfirmation() {
  const router = useRouter()
  const { state, subTotal, shippingCost, discount, total, placeOrder } = useCheckout()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderResult, setOrderResult] = useState<{
    success: boolean
    orderId?: string
    error?: string
  } | null>(null)

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)

    try {
      const result = await placeOrder()
      setOrderResult(result)

      if (result.success) {
        // In a real app, you might redirect to an order confirmation page
        setTimeout(() => {
          router.push(`/order-success?orderId=${result.orderId}`)
        }, 2000)
      }
    } catch (error) {
      setOrderResult({
        success: false,
        error: "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  // Check if all required information is provided
  const canPlaceOrder = state.shippingAddress && state.shippingMethod && state.paymentMethod

  // Get payment method display name
  const getPaymentMethodName = () => {
    switch (state.paymentMethod) {
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
            {state.shippingAddress ? (
              <div className="text-sm ml-7">
                <p className="font-medium">{state.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{state.shippingAddress.phone}</p>
                <p className="text-muted-foreground mt-1">
                  {state.shippingAddress.address}, {state.shippingAddress.city}, {state.shippingAddress.province}
                </p>
                {state.shippingAddress.postalCode && (
                  <p className="text-muted-foreground">Mã bưu điện: {state.shippingAddress.postalCode}</p>
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
            {state.shippingMethod ? (
              <div className="text-sm ml-7">
                <p className="font-medium">{state.shippingMethod.name}</p>
                <p className="text-muted-foreground">{state.shippingMethod.description}</p>
                <p className="text-muted-foreground">
                  Thời gian giao hàng dự kiến: {state.shippingMethod.estimatedDelivery}
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
            {state.paymentMethod ? (
              <div className="text-sm ml-7">
                <p className="font-medium">{getPaymentMethodName()}</p>
              </div>
            ) : (
              <p className="text-sm text-red-500 ml-7">Vui lòng chọn phương thức thanh toán</p>
            )}
          </div>

          {state.notes && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Ghi chú đơn hàng</h3>
              <p className="text-sm text-muted-foreground">{state.notes}</p>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Tóm tắt đơn hàng</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>

            {state.shippingMethod && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển ({state.shippingMethod.name})</span>
                <span>{formatCurrency(shippingCost)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giảm giá</span>
                <span className="text-green-600">-{formatCurrency(discount)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Tổng cộng</span>
              <span className="text-lg text-pink-500">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-pink-500 hover:bg-pink-600"
            disabled={!canPlaceOrder || isPlacingOrder || orderResult?.success}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? "Đang xử lý..." : "Đặt hàng"}
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
