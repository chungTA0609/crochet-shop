import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

// Define the discount info interface
interface DiscountInfo {
  type: "percentage" | "fixed"
  value: number
  maxDiscount?: number
  code: string
}

interface CartSummaryProps {
  cartTotal: number
  shippingFee: number
  discount: DiscountInfo | null
}

export function CartSummary({ cartTotal, shippingFee, discount }: CartSummaryProps) {
  // Calculate discount amount
  let discountAmount = 0
  if (discount) {
    if (discount.type === "percentage") {
      discountAmount = (cartTotal * discount.value) / 100
      // Apply max discount if specified
      if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
        discountAmount = discount.maxDiscount
      }
    } else {
      // Fixed discount
      discountAmount = discount.value
    }

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal
    }
  }

  // Calculate final total
  const finalTotal = cartTotal + shippingFee - discountAmount

  return (
    <div className="bg-white rounded-lg border overflow-hidden sticky top-4">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-medium">Tổng đơn hàng</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span>{cartTotal.toLocaleString("vi-VN")}₫</span>
          </div>

          {discount && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <Tag size={16} />
                <span>Giảm giá {discount.type === "percentage" ? `(${discount.value}%)` : ""}</span>
              </span>
              <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span>{shippingFee > 0 ? `${shippingFee.toLocaleString("vi-VN")}₫` : "Miễn phí"}</span>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-medium text-lg">
              <span>Tổng cộng</span>
              <span className="text-pink-600">{finalTotal.toLocaleString("vi-VN")}₫</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Đã bao gồm VAT (nếu có)</p>
          </div>
          <Button asChild className="w-full bg-pink-500 hover:bg-pink-600">
            <Link href="/checkout">Tiến hành thanh toán</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
