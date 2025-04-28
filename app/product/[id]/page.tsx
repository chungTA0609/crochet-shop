"use client"

import Link from "next/link"
import { useState } from "react"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Heart, Minus, Plus, Share2, ShoppingCart, Truck } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { products, relatedProducts, reviews } from "@/lib/constants"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ProductImages } from "@/components/product/product-images"
import { ProductRating } from "@/components/product/product-rating"
import { ProductReviews } from "@/components/product/product-reviews"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId) || products[0]

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.value || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")

  const { addToCart, addToWishlist, isInWishlist } = useCart()

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Cửa hàng", href: "/shop" },
    { label: product.name },
  ]

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} (${quantity}) đã được thêm vào giỏ hàng.`,
      action: (
        <ToastAction altText="Xem giỏ hàng">
          <Link href="/cart">Xem giỏ hàng</Link>
        </ToastAction>
      ),
    })
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
    toast({
      title: "Đã thêm vào danh sách yêu thích",
      description: `${product.name} đã được thêm vào danh sách yêu thích.`,
      action: (
        <ToastAction altText="Xem danh sách">
          <Link href="/wishlist">Xem danh sách</Link>
        </ToastAction>
      ),
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto p-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Product Detail */}
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <ProductImages images={product.images || [product.image]} name={product.name} />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                <ProductRating rating={product.rating || 0} reviews={product.reviews || 0} />
              </div>

              <div className="text-2xl font-bold text-pink-500">{formatCurrency(product.price)}</div>

              <div className="space-y-1">
                <h3 className="font-medium">Mô tả</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>

              <div className="space-y-4 pt-4">
                {/* Color Options */}
                {product.colors && (
                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <RadioGroup
                      id="color"
                      value={selectedColor}
                      onValueChange={setSelectedColor}
                      className="flex gap-2"
                    >
                      {product.colors.map((color) => (
                        <Label
                          key={color.value}
                          htmlFor={`color-${color.value}`}
                          className="cursor-pointer rounded-full p-1 border-2 flex items-center justify-center [&:has(:checked)]:border-pink-500"
                        >
                          <RadioGroupItem id={`color-${color.value}`} value={color.value || ""} className="sr-only" />
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.hex }} />
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Size Options */}
                {product.sizes && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="size">Kích thước</Label>
                      <button className="text-xs text-pink-500 hover:underline">Hướng dẫn kích thước</button>
                    </div>
                    <RadioGroup
                      id="size"
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      className="flex flex-wrap gap-2"
                    >
                      {product.sizes.map((size) => (
                        <Label
                          key={size}
                          htmlFor={`size-${size}`}
                          className="cursor-pointer border rounded-md w-10 h-10 flex items-center justify-center text-sm [&:has(:checked)]:bg-pink-500 [&:has(:checked)]:text-white [&:has(:checked)]:border-pink-500"
                        >
                          <RadioGroupItem id={`size-${size}`} value={size} className="sr-only" />
                          {size.toUpperCase()}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng</Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none h-10 w-10"
                      onClick={decrementQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      className="h-10 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none h-10 w-10"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="flex-1 bg-pink-500 hover:bg-pink-600 rounded-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant="outline"
                    className={`rounded-full ${isInWishlist(product.id) ? "bg-pink-50 text-pink-500 border-pink-500" : ""}`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? "fill-pink-500" : ""}`} />
                    {isInWishlist(product.id) ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Giao hàng miễn phí</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Miễn phí giao hàng cho đơn hàng trên 500.000₫. Thời gian giao hàng dự kiến: 3-5 ngày.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 py-3"
                >
                  Mô tả chi tiết
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 py-3"
                >
                  Thông số kỹ thuật
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 py-3"
                >
                  Đánh giá ({product.reviews || 0})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-6">
                <div className="prose max-w-none">
                  <p>{product.longDescription || product.description}</p>
                  <p>
                    Sản phẩm được làm thủ công từ các loại sợi cotton và len cao cấp, đảm bảo độ bền và màu sắc tươi
                    sáng. Mỗi sản phẩm đều được làm tỉ mỉ và kiểm tra chất lượng trước khi giao đến tay khách hàng.
                  </p>
                  <p>Lưu ý khi sử dụng:</p>
                  <ul>
                    <li>Giặt tay nhẹ nhàng với nước lạnh</li>
                    <li>Không sử dụng chất tẩy mạnh</li>
                    <li>Phơi khô trong bóng râm</li>
                    <li>Tránh tiếp xúc với nhiệt độ cao</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4">Thông tin sản phẩm</h3>
                    <div className="space-y-2">
                      {Object.entries(product.specifications || {}).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">{key}</span>
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Kích thước</h3>
                    <div className="space-y-2">
                      {Object.entries(product.dimensions || {}).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">{key}</span>
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-6">
                <ProductReviews reviews={reviews} rating={product.rating || 0} reviewCount={product.reviews || 0} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
