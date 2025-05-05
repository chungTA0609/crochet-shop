"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { toast } from "@/components/ui/use-toast"
import axios from "@/lib/axios"

// Define the discount info interface
interface DiscountInfo {
    type: "percentage" | "fixed"
    value: number
    maxDiscount?: number
    code: string
}

export default function CartPage() {
    const { cartItems, removeFromCart, updateCartItemQuantity, addToWishlist, cartTotal, cartCount } = useCart()

    const [couponCode, setCouponCode] = useState("")
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [discount, setDiscount] = useState<DiscountInfo | null>(null)

    const shippingFee = cartTotal > 500000 ? 0 : 30000

    const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]

    const handleApplyCoupon = async () => {
        if (!couponCode) return
        setIsApplyingCoupon(true)

        try {
            // Send the request with the promo code as a query parameter and empty body
            const response = await axios.post(
                `/api/checkout/promo-code/calculate?promoCode=${encodeURIComponent(couponCode)}`,
                "",
            )

            if (response.data.status === "SUCCESS") {
                toast({
                    title: "Mã giảm giá hợp lệ",
                    description: response.data.message || "Mã giảm giá đã được áp dụng thành công",
                    variant: "default",
                })

                // Store the discount information from the API response
                setDiscount({
                    type: response.data.discountType || "fixed",
                    value: response.data.data || 0,
                    maxDiscount: response.data.data,
                    code: couponCode,
                })

                // Clear the input field after successful application
                setCouponCode("")
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
            setIsApplyingCoupon(false)
        }
    }

    const removeCoupon = () => {
        setDiscount(null)
        toast({
            title: "Mã giảm giá đã được xóa",
            description: "Mã giảm giá đã được xóa khỏi đơn hàng của bạn",
            variant: "default",
        })
    }

    const moveToWishlist = (item: (typeof cartItems)[0]) => {
        addToWishlist(item)
        removeFromCart(item.id)
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto p-4 md:p-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Giỏ Hàng</h1>

                    {cartItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg border overflow-hidden">
                                    <div className="p-4 border-b bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <h2 className="font-medium">Giỏ hàng của bạn ({cartCount} sản phẩm)</h2>
                                        </div>
                                    </div>

                                    <div className="divide-y">
                                        {cartItems.map((item) => (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                                onUpdateQuantity={updateCartItemQuantity}
                                                onRemove={removeFromCart}
                                                onMoveToWishlist={moveToWishlist}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            {discount ? (
                                                <>
                                                    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                                                        <span className="flex-1">
                                                            Mã giảm giá: <span className="font-medium">{discount.code}</span>
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={removeCoupon}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Input
                                                        placeholder="Nhập mã giảm giá"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        className="pr-24 rounded-full"
                                                    />
                                                    <Button
                                                        className="absolute right-0 top-0 rounded-l-none rounded-full h-full bg-pink-500 hover:bg-pink-600"
                                                        disabled={isApplyingCoupon}
                                                        onClick={handleApplyCoupon}
                                                    >
                                                        {isApplyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" className="rounded-full">
                                        <Link href="/shop">Tiếp tục mua sắm</Link>
                                    </Button>
                                </div> */}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <CartSummary cartTotal={cartTotal} shippingFee={shippingFee} discount={discount} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
