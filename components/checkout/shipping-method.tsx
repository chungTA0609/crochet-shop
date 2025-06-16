"use client"

import { useCheckout, type ShippingMethod } from "@/contexts/checkout-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Clock, Loader2, Package, Truck } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import axios from "@/lib/axios"

export function ShippingMethodSelector() {
  const [isLoading, setIsLoading] = useState(true)
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const { availableShippingMethods, state, setShippingMethod } = useCheckout()


  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('/api/shipping-methods')
        if (response.data.data && Array.isArray(response.data.data)) {
          setShippingMethods(response.data.data)

          // If there's a default method and no method is selected, select it
          if (!state.shippingMethod) {
            const defaultMethod = response.data.data.find((method: ShippingMethod) => method.isDefault)
            if (defaultMethod) {
              setShippingMethod(defaultMethod)
            }
          }
        } else {
          toast({
            title: "Lỗi tải phương thức vận chuyển",
            description: "Không thể tải danh sách phương thức vận chuyển. Định dạng dữ liệu không hợp lệ.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error)
        toast({
          title: "Lỗi tải phương thức vận chuyển",
          description: "Đã xảy ra lỗi khi tải danh sách phương thức vận chuyển. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShippingMethods()
  }, [])

  const handleShippingMethodChange = (methodId: string) => {
    const selectedMethod = shippingMethods.find((method) => method.id == methodId) || null
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
      case "1":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "2":
        return <Truck className="h-5 w-5 text-green-500" />
      case "3":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "4":
        return <Package className="h-5 w-5 text-purple-500" />
      default:
        return <Truck className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Phương thức vận chuyển</h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <span className="ml-2 text-gray-500">Đang tải phương thức vận chuyển...</span>
        </div>
      ) : shippingMethods.length > 0 ? (
        <RadioGroup
          value={state.shippingMethod?.id || ""}
          onValueChange={handleShippingMethodChange}
          className="space-y-3"
        >
          {shippingMethods.map((method) => (
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
        </RadioGroup>) : (
        // Empty state
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>Không có phương thức vận chuyển nào khả dụng.</p>
        </div>
      )}
    </div>
  )
}
