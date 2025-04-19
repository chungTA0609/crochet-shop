"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CreditCard, Shield, Truck } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface CartSummaryProps {
  cartTotal: number
  shippingFee: number
}

export function CartSummary({ cartTotal, shippingFee }: CartSummaryProps) {
  const totalWithShipping = cartTotal + shippingFee

  return (
    <div className="bg-white rounded-lg border overflow-hidden sticky top-4">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-medium">Tóm tắt đơn hàng</h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Tổng cộng</span>
            <span className="text-lg text-pink-500">{formatCurrency(totalWithShipping)}</span>
          </div>
        </div>

        <Button asChild className="w-full mt-6 bg-pink-500 hover:bg-pink-600 rounded-full">
          <Link href="/checkout">
            Tiến hành thanh toán <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-2">
            <Truck className="h-4 w-4 mt-0.5 text-pink-500" />
            <div>
              <p className="text-sm font-medium">Miễn phí vận chuyển</p>
              <p className="text-xs text-muted-foreground">Cho đơn hàng từ 500.000₫</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="h-4 w-4 mt-0.5 text-pink-500" />
            <div>
              <p className="text-sm font-medium">Thanh toán an toàn</p>
              <p className="text-xs text-muted-foreground">Hỗ trợ nhiều phương thức thanh toán</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 mt-0.5 text-pink-500" />
            <div>
              <p className="text-sm font-medium">Bảo hành sản phẩm</p>
              <p className="text-xs text-muted-foreground">Đổi trả trong vòng 7 ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
