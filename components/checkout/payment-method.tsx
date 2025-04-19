"use client"

import type React from "react"

import { useState } from "react"
import { useCheckout } from "@/contexts/checkout-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Banknote, Wallet } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function PaymentMethod() {
  const { state, setPaymentMethod, setNotes } = useCheckout()
  const [notes, setNotesLocal] = useState(state.notes || "")

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method as any)

    // Show toast based on selected payment method
    let methodName = ""
    switch (method) {
      case "credit-card":
        methodName = "Thẻ tín dụng / Thẻ ghi nợ"
        break
      case "paypal":
        methodName = "PayPal"
        break
      case "cod":
        methodName = "Thanh toán khi nhận hàng (COD)"
        break
    }

    if (methodName) {
      toast({
        title: "Phương thức thanh toán đã được cập nhật",
        description: `Bạn đã chọn: ${methodName}`,
      })
    }
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNotesLocal(value)
    setNotes(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Phương thức thanh toán</h2>

        <RadioGroup value={state.paymentMethod || ""} onValueChange={handlePaymentMethodChange} className="space-y-3">
          <div className="flex items-start space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value="credit-card" id="credit-card" className="mt-1" />
            <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Thẻ tín dụng / Thẻ ghi nợ</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1 ml-7">
                <p>Thanh toán an toàn với Visa, Mastercard, JCB</p>
              </div>

              {state.paymentMethod === "credit-card" && (
                <div className="mt-4 ml-7 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Số thẻ</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Ngày hết hạn</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">Mã bảo mật (CVV)</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Tên chủ thẻ</Label>
                    <Input id="card-name" placeholder="NGUYEN VAN A" />
                  </div>
                </div>
              )}
            </Label>
          </div>

          <div className="flex items-start space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
            <Label htmlFor="paypal" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span className="font-medium">PayPal</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1 ml-7">
                <p>Thanh toán an toàn với tài khoản PayPal của bạn</p>
              </div>
            </Label>
          </div>

          <div className="flex items-start space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value="cod" id="cod" className="mt-1" />
            <Label htmlFor="cod" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-green-500" />
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1 ml-7">
                <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Ghi chú đơn hàng (tùy chọn)</h2>
        <Textarea
          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
          className="min-h-[100px]"
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
    </div>
  )
}
