"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useCheckout } from "@/contexts/checkout-context"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

// Define the discount info interface
interface DiscountInfo {
  type: "percentage" | "fixed"
  value: number
  maxDiscount?: number
  code: string
}

export function OrderSummary({ isEditable = true }: { isEditable?: boolean }) {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart()
  const { subTotal, shippingCost, state, applyPromoCode, removePromoCode } = useCheckout()

  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null)

  // Calculate discount amount based on discount info
  const calculateDiscountAmount = (): number => {
    if (!discountInfo) return 0

    let discountAmount = 0
    if (discountInfo.type === "percentage") {
      discountAmount = (subTotal * discountInfo.value) / 100
      // Apply maximum discount if specified
      if (discountInfo.maxDiscount && discountAmount > discountInfo.maxDiscount) {
        discountAmount = discountInfo.maxDiscount
      }
    } else {
      discountAmount = discountInfo.value
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subTotal) {
      discountAmount = subTotal
    }

    return discountAmount
  }

  const discountAmount = calculateDiscountAmount()
  const total = subTotal + shippingCost - discountAmount

  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      toast({
        title: "Mã giảm giá trống",
        description: "Vui lòng nhập mã giảm giá",
        variant: "destructive",
      })
      return
    }

    setIsApplyingPromo(true)
    setPromoError("")

    try {
      // Send the request with the promo code as a query parameter and empty body
      const response = await axios.post(
        `/api/checkout/promo-code/calculate?promoCode=${encodeURIComponent(promoCode)}`
      )

      if (response.data.status === "SUCCESS") {        // Create discount info from API response
        const newDiscountInfo: DiscountInfo = {
          type: response.data.discountType || "fixed",
          value: response.data.data || 0,
          maxDiscount: response.data.data,
          code: promoCode,
        }

        // Store the discount info
        setDiscountInfo(newDiscountInfo)

        // Also use the existing applyPromoCode function to maintain compatibility
        applyPromoCode(promoCode)

        toast({
          title: "Áp dụng mã giảm giá thành công",
          description: `Mã ${promoCode} đã được áp dụng cho đơn hàng của bạn`,
        })
        setPromoCode("")
      } else {
        toast({
          title: "Mã giảm giá không hợp lệ",
          description: response.data.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error applying promo code:", error)
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi áp dụng mã giảm giá. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = () => {
    // Clear the discount info
    setDiscountInfo(null)

    // Also use the existing removePromoCode function to maintain compatibility
    const removedCode = removePromoCode()
    if (removedCode) {
      toast({
        title: "Đã xóa mã giảm giá",
        description: `Mã ${removedCode.code} đã được xóa khỏi đơn hàng`,
      })
    }
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-medium">Đơn hàng của bạn</h2>
      </div>

      <div className="p-4">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link href={`/product/${item.id}`} className="text-sm font-medium hover:text-pink-500">
                    {item.name}
                  </Link>
                  <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.selectedColor && <span className="capitalize">{item.selectedColor} · </span>}
                  {item.selectedSize && <span className="uppercase">{item.selectedSize} · </span>}
                  <span>
                    {formatCurrency(item.price)} × {item.quantity}
                  </span>
                </div>

                {isEditable && (
                  <div className="flex items-center mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        {isEditable && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Mã giảm giá</h3>
            {!discountInfo ? (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={promoError ? "border-red-500" : ""}
                  />
                  {promoError && <p className="text-xs text-red-500 mt-1 absolute">{promoError}</p>}
                </div>
                <Button
                  onClick={handleApplyPromoCode}
                  disabled={isApplyingPromo}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  {isApplyingPromo ? "Đang áp dụng..." : "Áp dụng"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-4 p-2 bg-green-50 border border-green-200 rounded-md">
                <div>
                  <span className="text-sm font-medium text-green-700">{discountInfo.code}</span>
                  <p className="text-xs text-green-600">
                    {discountInfo.type === "percentage"
                      ? `Giảm ${discountInfo.value}%`
                      : `Giảm ${formatCurrency(discountInfo.value)}`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePromoCode}
                  className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Order Summary */}
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

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" /> Giảm giá
              </span>
              <span className="text-green-600">-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Tổng cộng</span>
            <span className="text-lg text-pink-500">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
