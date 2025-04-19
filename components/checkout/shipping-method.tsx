"use client"

import { useCheckout, type ShippingMethod } from "@/contexts/checkout-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Clock, Package, Truck } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function ShippingMethodSelector() {
  const { availableShippingMethods, state, setShippingMethod } = useCheckout()

  const handleShippingMethodChange = (methodId: string) => {
    const selectedMethod = availableShippingMethods.find((method) => method.id === methodId) || null
    setShippingMethod(selectedMethod)

    if (selectedMethod) {
      toast({
        title: "Phương thức vận chuyển đã được cập nhật",
        description: `Bạn đã chọn: ${selectedMethod.name}`,
      })
    }
  }

  // Icons for shipping methods
  const getMethodIcon = (method: ShippingMethod) => {
    switch (method.id) {
      case "standard":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "express":
        return <Truck className="h-5 w-5 text-green-500" />
      case "same-day":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "pickup":
        return <Package className="h-5 w-5 text-purple-500" />
      default:
        return <Truck className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Phương thức vận chuyển</h2>

      <RadioGroup
        value={state.shippingMethod?.id || ""}
        onValueChange={handleShippingMethodChange}
        className="space-y-3"
      >
        {availableShippingMethods.map((method) => (
          <div key={method.id} className="flex items-start space-x-2 border p-4 rounded-lg">
            <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                {getMethodIcon(method)}
                <span className="font-medium">{method.name}</span>
                <span className="ml-auto font-medium">
                  {method.price === 0 ? "Miễn phí" : formatCurrency(method.price)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1 ml-7">
                <p>{method.description}</p>
                <p className="mt-1">Thời gian giao hàng dự kiến: {method.estimatedDelivery}</p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
