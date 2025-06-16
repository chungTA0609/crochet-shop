"use client"

import { useState, useEffect } from "react"
import { useCheckout, type Address } from "@/contexts/checkout-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

export function ShippingAddress() {
  const { state, setShippingAddress, addNewAddress } = useCheckout()
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  })

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("/api/addresses")

        if (response.data.data && Array.isArray(response.data.data)) {
          const adrArray = response.data.data.map((element: any) => {
            return {
              id: element.id.toString(),
              fullName: element.fullName,
              phone: element.phoneNumber,
              email: element.email,
              address: element.street,
              city: element.state,
              province: element.city,
              postalCode: element.zipCode,
              isDefault: element.default,
            }
          });

          setAddresses(adrArray)

          // If there's a default address and no address is selected, select it
          if (!state.shippingAddress) {
            const defaultAddress = response.data.data.find((addr: Address) => addr.isDefault)
            if (defaultAddress) {
              setShippingAddress(defaultAddress)
            }
          }
        } else {
          toast({
            title: "Lỗi tải địa chỉ",
            description: "Không thể tải danh sách địa chỉ. Định dạng dữ liệu không hợp lệ.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Lỗi tải địa chỉ",
          description: "Đã xảy ra lỗi khi tải danh sách địa chỉ. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [])

  const handleAddressChange = (addressId: string) => {
    const selectedAddress = addresses.find((addr) => addr.id === addressId) || null
    setShippingAddress(selectedAddress)
  }

  const handleNewAddressChange = (field: keyof Omit<Address, "id">, value: string | boolean) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddNewAddress = async () => {
    // Basic validation
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.province) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin địa chỉ",
        variant: "destructive",
      })
      return
    }

    try {
      // Call API to add new address
      const response = await axios.post("/api/addresses", newAddress)

      if (response.data && response.data.id) {
        // Add the new address to the list
        const addedAddress = response.data
        setAddresses((prev) => [...prev, addedAddress])

        // Select the new address
        setShippingAddress(addedAddress)

        // Also update the context
        addNewAddress(addedAddress)

        // Reset form
        setNewAddress({
          fullName: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          province: "",
          postalCode: "",
          isDefault: false,
        })

        // Hide form
        setShowNewAddressForm(false)

        // Show success toast
        toast({
          title: "Thêm địa chỉ thành công",
          description: "Địa chỉ mới đã được thêm vào danh sách",
        })
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error adding new address:", error)
      toast({
        title: "Lỗi thêm địa chỉ",
        description: "Đã xảy ra lỗi khi thêm địa chỉ mới. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Địa chỉ giao hàng</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <span className="ml-2 text-gray-500">Đang tải địa chỉ...</span>
          </div>
        ) : addresses.length > 0 ? (
          <RadioGroup value={state.shippingAddress?.id || ""} onValueChange={handleAddressChange} className="space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <div className="flex justify-between">
                    <span className="font-medium">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded">Mặc định</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <p>{address.phone}</p>
                    <p className="mt-1">
                      {address.address}, {address.city}, {address.province}
                    </p>
                    {address.postalCode && <p className="mt-1">Mã bưu điện: {address.postalCode}</p>}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center py-6 border rounded-lg bg-gray-50">
            <p className="text-gray-500">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
          </div>
        )}

        {!showNewAddressForm ? (
          <Button variant="outline" className="mt-4 w-full" onClick={() => setShowNewAddressForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm địa chỉ mới
          </Button>
        ) : (
          <div className="mt-6 border p-4 rounded-lg">
            <h3 className="font-medium mb-4">Thêm địa chỉ mới</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={newAddress.fullName}
                  onChange={(e) => handleNewAddressChange("fullName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => handleNewAddressChange("phone", e.target.value)}
                  placeholder="0901234567"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email (tùy chọn)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAddress.email || ""}
                  onChange={(e) => handleNewAddressChange("email", e.target.value)}
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={newAddress.address}
                  onChange={(e) => handleNewAddressChange("address", e.target.value)}
                  placeholder="123 Đường Lê Lợi, Phường Bến Nghé"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Quận/Huyện</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => handleNewAddressChange("city", e.target.value)}
                  placeholder="Quận 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                <Input
                  id="province"
                  value={newAddress.province}
                  onChange={(e) => handleNewAddressChange("province", e.target.value)}
                  placeholder="TP Hồ Chí Minh"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Mã bưu điện (tùy chọn)</Label>
                <Input
                  id="postalCode"
                  value={newAddress.postalCode || ""}
                  onChange={(e) => handleNewAddressChange("postalCode", e.target.value)}
                  placeholder="700000"
                />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2 mt-2">
                <Checkbox
                  id="isDefault"
                  checked={newAddress.isDefault || false}
                  onCheckedChange={(checked) => handleNewAddressChange("isDefault", checked === true)}
                />
                <Label htmlFor="isDefault" className="text-sm">
                  Đặt làm địa chỉ mặc định
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewAddressForm(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddNewAddress} className="bg-pink-500 hover:bg-pink-600">
                Lưu địa chỉ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
