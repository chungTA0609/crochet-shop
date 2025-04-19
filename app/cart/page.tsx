"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { toast } from "@/components/ui/use-toast"

export default function CartPage() {
    const { cartItems, removeFromCart, updateCartItemQuantity, addToWishlist, cartTotal, cartCount } = useCart()

    const [couponCode, setCouponCode] = useState("")
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

    const shippingFee = cartTotal > 500000 ? 0 : 30000

    const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]

    const handleApplyCoupon = () => {
        if (!couponCode) return
        setIsApplyingCoupon(true)

        // Simulate API call
        setTimeout(() => {
            setIsApplyingCoupon(false)
            toast({
                title: "Mã giảm giá không hợp lệ",
                description: "Mã giảm giá không hợp lệ hoặc đã hết hạn",
                variant: "destructive",
            })
        }, 1000)
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

                                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
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
                                        </div>
                                    </div>
                                    <Button asChild variant="outline" className="rounded-full">
                                        <Link href="/shop">Tiếp tục mua sắm</Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <CartSummary cartTotal={cartTotal} shippingFee={shippingFee} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
