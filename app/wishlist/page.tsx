"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { WishlistItem } from "@/components/wishlist/wishlist-item"
import { EmptyWishlist } from "@/components/wishlist/empty-wishlist"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart()

  const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Danh sách yêu thích" }]

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart(item, 1)
    removeFromWishlist(item.id)
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

          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Danh Sách Yêu Thích</h1>

          {wishlistItems.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium">Danh sách yêu thích của bạn ({wishlistItems.length} sản phẩm)</h2>
                </div>
              </div>

              <div className="divide-y">
                {wishlistItems.map((item) => (
                  <WishlistItem key={item.id} item={item} onAddToCart={handleAddToCart} onRemove={removeFromWishlist} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/shop">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
